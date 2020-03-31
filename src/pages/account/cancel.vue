<template>
    <div>
        <div class="tip">
            请选择注销原因：
        </div>

        <div class="item" v-for="(item, index) in items" :key="index"  @click="selected = index">
            <i class="fa check-box" :class="{active: selected == index}"></i>
            {{ item }}
        </div>

        <div class="btn del-btn" @click="tapSubmit">确定注销</div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { cancelUser } from '../../api/account';
import { IMyApp } from '../../app.vue';

interface IPageData {
    items: string[],
    selected: number
}

const app = getApp<IMyApp>();

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
            content: '账户注销后，您所有的记录将永远消失。',
            confirmText: '继续注销',
            cancelText: '暂不注销',
            success(res) {
                if (res.cancel) {
                    wx.navigateBack();
                }
            }
        });
    }

    public tapSubmit() {
        let data = this.data;
        cancelUser({
            reason: data.items[data.selected]
        }).then(_ => {
            app.logoutUser();
            wx.showModal({
                title: '提示',
                content: '您的账户注销申请已提交，等待管理员确认。',
                showCancel: false,
                success() {
                    wx.switchTab({
                        url: '/pages/index/index',
                        success () { 
                            let page = getCurrentPages().pop(); 
                            if (!page) {
                                return; 
                            }
                            page.onLoad();
                        }
                    });
                }
            })
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
        top: 2px;
        left: 20px;
    }
    &:not(:last-of-type) {
        border-bottom: 1px solid #ccc;
    }
}
</style>
