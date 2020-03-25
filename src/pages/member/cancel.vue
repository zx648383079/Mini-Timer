<template>
    <div>
        <div class="tip">
            请选择注销原因：
        </div>

        <div class="item" v-for="(item, index) in items" :key="index"  @click="selected = index">
            <i class="fa check-box" :class="{active: selected == index}"></i>
            {{ item }}
        </div>

        <div class="btn del-btn">确定注销</div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';

interface IPageData {
    items: string[],
    selected: number
}

@WxJson({
    navigationBarTitleText: "账户注销",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class Cancel extends WxPage<IPageData> {

    public data: IPageData = {
        items: [
            '需要解绑手机',
            '需要解绑邮箱',
            '安全/隐私顾虑',
            '这是多余的账户',
        ],
        selected: 0
    }

    public onShow() {
        wx.showModal({
            title: '账户注销确认',
            content: '账户注销后，您已完成的交易将无法售后。',
            confirmText: '继续注销',
            cancelText: '暂不注销',
            fail() {
                wx.navigateBack({
                    delta: 0
                });
            }
        });
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
    position: relative;
    padding-left: 60px;
    line-height: 40px;
    .fa {
        position: absolute;
        top: 12px;
        left: 20px;
    }
    &:not(:last-of-type) {
        border-bottom: 1px solid #ccc;
    }
}
</style>
