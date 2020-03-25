<template>
    <div>
        <div class="tip">
            最新登陆设备：点击可以查看登陆时间
        </div>
        <a class="item">
            <div class="name">MI 8</div>
            <div class="time">4秒前</div>
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </a>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from "../../../typings/wx/lib.wx.page";


interface IPageData {
    items: string[],
}

@WxJson({
    navigationBarTitleText: "登陆设备管理",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class Driver extends WxPage<IPageData> {
    public data: IPageData = {
        items: [],
    }
}
</script>
<style lang="scss" scoped>
.tip {
    line-height: 30px;
    padding: 10px;
}
.item {
    background-color: #fff;
    padding: 5px 60px 5px 10px;
    position: relative;
    display: block;
    .name {
        line-height: 30px;
        font-size: 20px;
    }
    .time {
        color: #ccc;
        font-size: 12px;
    }
    .fa {
        position: absolute;
        right: 10px;
        top: 18px;
        font-size: 20px;
        color: #999;
    }
    &:not(:last-of-type) {
        border-bottom: 1px solid #ccc;
    }
}
</style>
