<template>
    <div>
        <div>
            <div class="login-box" v-if="mode < 1">
                <EmailLogin bind:click="tapChangeMode" bind:back="tapLoginBack"/>
                <div class="login-oauth-box">
                    <button open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="tapAuth"><i class="fa fa-weixin"></i></button>
                </div>
            </div>
            <div class="register-box" v-if="mode == 1">
                <EmailRegister bind:click="tapChangeMode" bind:back="tapLoginBack"/>
            </div>
            <div class="register-box" v-if="mode == 2">
                <EmailFind bind:click="tapChangeMode"/>
            </div>

        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxJson, WxPage, TouchEvent, getCurrentPages } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
    mode: number
}
@WxJson({
    usingComponents: {
        "EmailLogin": "/pages/member/Child/EmailLogin",
        "EmailRegister": "/pages/member/Child/EmailRegister",
        "EmailFind": "/pages/member/Child/EmailFind",
    },
    navigationBarTitleText: "登录",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        mode: 0
    };

    tapMode(e: TouchEvent) {
        this.tapChange(e.currentTarget.dataset.mode as number);
    }

    tapChangeMode(e: any) {
        this.tapChange(e.detail);
    }

    public tapChange(mode: number) {
        const titles = [
            '登录',
            '注册',
            '找回密码'
        ];
        wx.setNavigationBarTitle({
            title: mode >= 0 && mode < titles.length ? titles[mode] : titles[0] 
        });
        this.setData({mode});
    }

    public tapLoginBack() {
        wx.switchTab({
            url: '/pages/index/index',
            success: function () { 
                let page = getCurrentPages().pop(); 
                if (!page) {
                    return; 
                }
                page.onLoad(); 
            }
        });
    }

    public authLogin(code: string, nickname: string, avatar: string, gender: number) {
        app.authloginUser({code, nickname, avatar, gender}).then(res => {
            if (res) {
                this.tapLoginBack();
            }
        });
    }

    /**
     * tapAuth
     */
    public tapAuth(e: any) {
        let code: string| null = null,
            userInfo: WechatMiniprogram.UserInfo | null = e.detail.userInfo,
            that = this;
        wx.login({
            success(res) {
                code = res.code;
                userInfo && that.authLogin(code, userInfo.nickName, userInfo.avatarUrl, userInfo.gender);
            }
        })
    }
}
</script>
<style lang="scss" scoped>

</style>
