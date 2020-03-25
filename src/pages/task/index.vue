<template>
    <div>
        <div class="tab-header">
            <span v-for="(item, index) in status_list" :key="index" @click="tapStatus" data-status="{{ item.status }}" class="tab-item {{status == item.status ? 'active' : ''}}">{{ item.name }}</span>
        </div>

        <div class="fixed-icon" @click="tapAdd">
            <i class="fa fa-plus"></i>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';

const app = getApp<IMyApp>();

interface IPageData {
    status: number;
    status_list: any[];
}
@WxJson({
    navigationBarTitleText: "我的任务",
    navigationBarBackgroundColor: '#05a6b1',
    navigationBarTextStyle: 'white'
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        status: 1,
        status_list: [
            {
                name: '进行中',
                status: 1
            },
            {
                name: '已结束',
                status: 2
            },
        ]
    };

    onLoad() {

    }

    public tapStatus(e: TouchEvent) {
        this.setData({
            status: e.currentTarget.dataset.status
        });
    }

    public tapAdd() {
        wx.navigateTo({
            url: '/pages/task/edit'
        })
    }
}
</script>
<style lang="scss" scoped>

</style>
