<template>
    <div>
        

        <div class="fixed-icon" @click="tapAdd">
            <i class="fa fa-plus"></i>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

const app = getApp<IMyApp>();

interface IPageData {
    isGuest: boolean;
}
@WxJson({
    navigationBarTitleText: "首页",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        isGuest: true
    };

    onLoad() {
        this.setData({
            isGuest: !app.globalData.token
        });
    }

    public tapAdd() {
        if (this.data.isGuest) {
            wx.navigateTo({
                url: '/pages/member/login'
            })
            return;
        }
        wx.navigateTo({
            url: '/pages/task/index'
        })
    }
}
</script>
<style lang="scss" scoped>
</style>
