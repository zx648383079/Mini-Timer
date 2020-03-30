<template>
    <div>
        <div class="dialog-body" v-if="day">
            <div class="timer-box">
                {{ time }}
            </div>
            <div class="timer-name">{{ day.task.name }}</div>
            <timer class="timer-desc">{{ day.task.description }}</timer>
        </div>

        <div class="dialog-footer" v-if="day">
            <div class="timer-play" title="开始计时" v-if="day.status == 5 || day.status == 8" @click="tapPlay">
                <i class="fa fa-play"></i>
                <div class="label">开始计时</div>
            </div>
            <div class="timer-pause" title="暂停计时" v-if="day.status == 9" @click="tapPause">
                <i class="fa fa-pause"></i>
                <div class="label">暂停计时</div>
            </div>
            <div class="timer-close" title="停止计时" v-if="day.status == 9" @click="tapStop">
                <i class="fa fa-stop"></i>
                <div class="label">停止计时</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { ITaskDay, ISetting } from '../../api/model';
import { getTaskDayInfo, playTask, pauseTask, stopTask, checkTask } from '../../api/task';
import { formatHour } from '../../utils/util';
import { SETTING_KEY } from '../../utils/types';

const TIME_SPACE = 500;

interface IPageData {
    day: ITaskDay | null,
    time: string,
    handle: number,
    startAt: Date,
    setting: ISetting,
}
@WxJson({
    navigationBarTitleText: "",
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black'
})
export class Detail extends WxPage<IPageData> {
    public data: IPageData = {
        day: null,
        time: '00:00',
        handle: 0,
        startAt: new Date(),
        setting: {
            vibrate: true,
            screenOn: true
        }
    };

    onLoad(option: any) {
        const id = option && option.id ? parseInt(option.id, 10) : 0;
        if (!id) {
            wx.navigateBack();
            return;
        }
        let setting = this.data.setting;;
        let that = this;
        wx.getStorage({
            key: SETTING_KEY,
            success(res) {
                setting = Object.assign({}, setting, res.data);
                that.setData({setting});
            }
        });
        getTaskDayInfo(id).then(res => {
            if (!res) {
                wx.navigateBack();
                return;
            }
            this.setData({
                day: res
            });
            if (res.status === 9) {
                this._begin();
            }
            this.toggleScreenOn(true);
        });
        
    }

    onUnload() {
        this._stop();
        this.toggleScreenOn(false);
    }

    public toggleScreenOn(val: boolean) {
        if (val && this.data.setting.hasOwnProperty('screenOn') && !this.data.setting.screenOn) {
            return;
        }
        wx.setKeepScreenOn({
            keepScreenOn: val
        });
    }

    public doVibrate() {
        if (this.data.setting.hasOwnProperty('vibrate') && !this.data.setting.vibrate) {
            return;
        }
        wx.vibrateLong();
    }

    public tapPlay() {
        if (!this.data.day) {
            return;
        }
        playTask(this.data.day.id).then(res => {
            if (!res) {
                return;
            }
            this.setData({
                day: res
            });
            this._begin();
        });
    }

    public tapPause() {
        if (!this.data.day) {
            return;
        }
        pauseTask(this.data.day.id).then(res => {
            if (!res) {
                return;
            }
            this.setData({
                day: res
            });
            this._stop();
        });
    }

    public tapStop() {
        if (!this.data.day) {
            return;
        }
        stopTask(this.data.day.id).then(res => {
            if (!res) {
                return;
            }
            this.setData({
                day: res,
                time: '00:00'
            });
            this._stop();
        });
    }

    private _stop() {
        if (this.data.handle > 0) {
            clearInterval(this.data.handle);
            this.data.handle = 0;
        }
    }

    private _begin() {
        if (!this.data.day || !this.data.day.log) {
            return;
        }
        if (this.data.handle > 0) {
            clearInterval(this.data.handle);
        }
        this.data.startAt = new Date(typeof this.data.day.log.created_at == 'number' ? this.data.day.log.created_at * 1000 : this.data.day.log.created_at)
        this.data.handle = setInterval(() => {
            this._showTime();
        }, TIME_SPACE);
    }

    private _showTime() {
        let data = this.data;
        if (!data.day || !data.day.log) {
            return;
        }
        const diff = new Date().getTime() - data.startAt.getTime();
        if (!data.day.task.every_time || data.day.task.every_time < 1) {
            this.setData({
                time: formatHour(diff)
            });
            return;
        }
        const total = data.day.task.every_time;
        const time = total * 60000 - diff;
        this.setData({
            time: formatHour(Math.max(0, time))
        });
        if (time > 0) {
            return;
        }
        this._stop();
        checkTask(data.day.id).then(res => {
            if (!res || !res.id) {
                this._begin();
                return;
            }
            this.setData({
                day: res
            });
            this.doVibrate();
            if (res.tip) {
                wx.showModal({
                    title: '提示',
                    content: res.tip,
                    confirmText: '好的',
                    showCancel: false,
                    success() {
                        if (res.amount > 0) {
                            return;
                        }
                        wx.navigateBack();
                    }
                });
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.dialog-body {
    position: absolute;
    top: 5vh;
    text-align: center;
    left: 0;
    right: 0;
    .timer-box {
        font-size: 60px;
    }
    .timer-name,
    .timer-desc {
        color: #ccc;
    }
}
.dialog-footer {
    position: absolute;
    bottom: 30px;
    font-size: 50px;
    text-align: center;
    left: 0;
    right: 0;
    .timer-close,
    .timer-pause,
    .timer-play {
        color: #333;
        display: inline-block;
        text-align: center;
        .fa {
            font-size: 40px;
        }
        .label {
            display: block;
            font-size: 12px;
        }
    }
    .timer-pause {
        margin-right: 10px;
    }
}
</style>
