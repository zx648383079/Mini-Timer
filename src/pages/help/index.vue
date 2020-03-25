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
    navigationBarTitleText: "帮助",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    
}
</script>
<style lang="scss" scoped>

</style>
