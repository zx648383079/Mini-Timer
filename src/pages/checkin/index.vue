<template>
    <div>
        <div class="top-header">
            <div v-if="!checked" class="check-btn" @click="tapCheck">
                签到
            </div>
            <div v-else class="checked-btn">
                <i class="fa fa-calendar-check" aria-hidden="true"></i>
                已签到
            </div>
            <div v-if="checked" class="checked-tip">已连续签到{{ checked.running }}天，继续加油</div>
        </div>
        <div class="date-grid">
            <div class="title">{{ title }}</div>
            <div class="day-grid">
                <ol class="gird-header"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ol>
                <ul class="gird-body">
                    <block v-for="(item, index) in day_list" :key="index">
                        <li class="{{ item.disable ? 'disable' : ''}} {{item.active ? 'active': ''}}">{{ item.val }}</li>
                    </block>
                </ul>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { ICheckIn } from '../../api/model';
import { getCanCheckIn, getMonth, checkIn } from '../../api/check';
import { twoPad } from '../../utils/util';

interface IPageData {
}

interface IDay {
    val: string,
    day?: number,
    disable?: boolean,
    active?: boolean,
}

interface IPageData {
    checked: ICheckIn | null,
    day_list: IDay[],
    title: string
}
@WxJson({
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        checked: null,
        day_list: [],
        title: ''
    };

    public onLoad() {
        this.refreshGrid(new Date());
        getCanCheckIn().then(res => {
            if (res.data) {
                this.setData({
                    checked: res.data
                });
            }
        });
        getMonth().then(res => {
            if (!res.data) {
                return;
            }
            const days = [];
            for (const item of res.data) {
                days.push(new Date(item.created_at).getDate());
            }
            this.checkDay(...days);
        });
    }

    public refreshGrid(current: Date) {
        const year = current.getFullYear();
        const month = current.getMonth() + 1;
        const date = new Date(year, month, 0);
        const count = date.getDate();
        date.setDate(1);
        const start = date.getDay();
        let day_list = [];
        for (let i = 0; i < count + start; i++) {
            day_list.push(i < start ? {
                val: '',
            } : {
                val: twoPad(i - start + 1),
                day: i - start + 1,
            });
        }
        this.setData({
            title: year + '-' + twoPad(month),
            day_list
        });
    }

    /**
     * tapCheck
     */
    public tapCheck() {
        checkIn().then(res => {
            if (res.data) {
                this.setData({
                    checked: res.data
                });
                this.checkDay(new Date().getDate());
            }
        });
    }

    /**
     * checkDay
     */
    public checkDay(...days: number[]) {
        let len = days.length;
        if (len < 1) {
            return;
        }
        let day_list = this.data.day_list;
        for (let i = 0; i < day_list.length; i++) {
            if (day_list[i].day && days.indexOf(day_list[i].day as number) >= 0) {
                day_list[i].active = true;
                len --;
            }
            if (len < 1) {
                break;
            }
        }
        this.setData({
            day_list
        });
    }

}
</script>
<style lang="scss" scoped>
.top-header {
    background: #05a6b1;
    color: #fff;
    height: 200px;
    padding-top: 40px;
    .checked-btn,
    .check-btn {
        font-size: 30px;
        width: 130px;
        margin: 0 auto;
        text-align: center;
        border: 1px solid;
        line-height: 40px;
        border-radius: 20px;
    }
    .checked-btn {
        background-color: rgba(255, 255, 255, .1);
        font-size: 22px;
    }
    .checked-tip {
        text-align: center;
        margin-top: 10px;
        font-size: 13px;
        font-weight: 300;
    }
}
.date-grid {
    width: 280px;
    margin: -60px auto 0;
    background-color: #fff;
    .title {
        line-height: 40px;
        text-align: center;
    }
    .day-grid {
        .gird-header,
        .gird-body {
            view {
                display: inline-block;
                width: 40px;
                line-height: 40px;
                text-align: center;
                box-sizing: border-box;
                list-style: none;
                color: #333;
            }
        }
        .gird-header {
            background: #eee;
        }
        .gird-body {
            view {
                cursor: pointer;
                &.active {
                    background: #006cff;
                    color: #fff;
                    border-radius: 50%;
                    &:before {
                        font-family: "iconfont" !important;
                        font-weight: 900;
                        content: "\e8da";
                        color: rgba(255, 255, 255, .3);
                        font-size: 30px;
                        position: absolute;
                    }
                }
                &.disable {
                    color: #ccc;
                }
            }
        }
    }
}
</style>