<template>
    <div>

    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

const app = getApp<IMyApp>();

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "任务进行中",
    navigationBarBackgroundColor: '#05a6b1',
    navigationBarTextStyle: 'white'
})
export class Detail extends WxPage<IPageData> {
    public data: IPageData = {
    };

    onLoad() {

    }
}
</script>
<style lang="scss" scoped>

</style>
