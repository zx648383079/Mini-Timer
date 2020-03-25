<template>
    <div>
        

    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
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
}
</script>
<style lang="scss" scoped>

</style>
