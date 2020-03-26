<template>
    <div>
        <div class="large-header">
            <div class="title">新建任务</div>
            <i class="fa fa-check1"></i>
        </div>
        <div class="input-box">
            <input type="text" name="name" required v-model="name" placeholder="请输入账号">
        </div>
        <div class="input-box">
            <input type="text" name="description" required v-model="description" placeholder="请输入说明">
        </div>
        <div class="input-box time-box">
            <span for="every_time">单次时间：</span>
            <input type="number" id="every_time" name="every_time" v-model="every_time" placeholder="请输入单次时间">
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
    name: string,
    description: string,
    every_time: number
}
@WxJson({
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#05a6b1',
    navigationBarTextStyle: 'white'
})
export class Edit extends WxPage<IPageData> {
    public data: IPageData = {
        name: '',
        description: '',
        every_time: 25
    };

    onLoad() {

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
