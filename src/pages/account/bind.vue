<template>
    <div>
        <div class="large-header">
            <div class="title">绑定微信</div>
        </div>
        <div class="login-oauth-box">
            <button open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="tapAuth"><i class="fa fa-wechat"></i></button>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from "../../../typings/wx/lib.vue";
import { IMyApp } from "../../app.vue";
import { IUser } from "../../api/model";

const app = getApp<IMyApp>();

interface IPageData {
    user: IUser | null
}

@WxJson({
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class Password extends WxPage<IPageData> {
    public data: IPageData = {
        user: null,
    }

    public onLoad() {
        app.getUser().then(res => {
            if (!res) {
                wx.navigateBack()
                return;
            }
            this.setData({
                user: res
            });
        });
    }

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

    public authLogin(code: string, nickname: string, avatar: string, gender: number) {
        app.authloginUser({code, nickname, avatar, gender}).then(res => {
            if (res && res.token && res.id > 0) {
                wx.showToast({
                    title: '绑定成功'
                });
                wx.navigateBack();
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.login-oauth-box {
    position: static;
}
</style>
