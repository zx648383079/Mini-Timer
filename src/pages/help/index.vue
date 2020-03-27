<template>
    <div>
        <p>1. 先添加任务</p>
        <p>2. 在任务列表点左下角“编辑”，添加任务到今天任务</p>
        <p>3. 回到首页，点击一个进入任务执行界面</p>
        <p>4. 点击下面的开始进行计时</p>
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
    navigationBarTitleText: "帮助",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    
}
</script>
<style lang="scss" scoped>

</style>
