<template>
    <div>
        <div class="large-header">
            <div class="title">{{ info.id > 0 ? '编辑' : '新建' }}任务</div>
            <i class="fa fa-check" @click="tapSubmit"></i>
        </div>
        <div class="input-box">
            <input type="text" name="name" required v-model="info.name" placeholder="请输入账号">
        </div>
        <div class="input-box">
            <input type="text" name="description" required v-model="info.description" placeholder="请输入说明">
        </div>
        <div class="input-box time-box">
            <span for="every_time">单次时间：</span>
            <input type="number" id="every_time" name="every_time" v-model="info.every_time" placeholder="请输入单次时间">
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { getTaskInfo, saveTask } from '../../api/task';
import { ITask } from '../../api/model';

const app = getApp<IMyApp>();

interface IPageData {
    info: ITask
}
@WxJson({
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#05a6b1',
    navigationBarTextStyle: 'white'
})
export class Edit extends WxPage<IPageData> {
    public data: IPageData = {
        info: {
            name: '',
            description: '',
            every_time: 25
        }
    };

    onLoad(option: any) {
        const id = option && option.id ? parseInt(option.id, 10) : 0;
        if (!id) {
            return;
        }
        getTaskInfo(id).then(res => {
            this.setData({
                info: res
            });
        })
    }

    public tapSubmit() {
        let info = this.data.info;
        if (!info.name) {
            wx.showToast({
                title: '请输入名称',
                icon: 'none'
            });
            return;
        }
        saveTask(info).then(_ => {
            wx.navigateBack();
        });
    }


}
</script>
<style lang="scss" scoped>
.time-box {
    text-align: right;
    text {
        line-height: 40px;
        float: left;
    }
    input {
        display: inline-block;
        width: 60px;
        border-left: 1px solid #ccc;
    }
}
</style>
