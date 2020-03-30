<template>
    <div>
        <div class="user-header">
            <div class="avatar">
                <img :src="user.avatar">
            </div>
            <div class="tip">
                {{ tip }}
            </div>
        </div>

        <div class="btn primary-btn" @click="tapConfirm">
            确认授权
        </div>

        <div class="btn del-btn" @click="tapCancel">
            取消授权
        </div>

    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from "../../../typings/wx/lib.vue";
import { IUser } from "../../api/model";
import { IMyApp } from "../../app.vue";
import { authorizeQrToken } from '../../api/authorize';


interface IPageData {
    user: IUser | null,
    tip: string,
    token: string
}

const app = getApp<IMyApp>();

@WxJson({
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class Index extends WxPage<IPageData> {
    public data: IPageData = {
        user: null,
        tip: '正在授权WEB端登录',
        token: ''
    }

    public onLoad(option: any) {
        if (!option || !option.token) {
            wx.navigateBack();
            return;
        }
        app.getUser().then(res => {
            if (!res) {
                wx.navigateBack();
                return;
            }
            this.setData({
                user: res,
            });
        });
        const token = decodeURIComponent(option.token);
        this.setData({
            token
        });
        authorizeQrToken({token}).then(res => {
            if (res && res.id) {
                return;
            }
            wx.navigateBack();
        }, () => {
            wx.navigateBack();
        });
    }

    public tapConfirm() {
        authorizeQrToken({
            token: this.data.token,
            confirm: true
            }).then(() => {
                wx.navigateBack();
            }, () => {
                wx.navigateBack();
        });
    }

    public tapCancel() {
        authorizeQrToken({
            token: this.data.token,
            reject: true
            }).then(() => {
                wx.navigateBack();
            }, () => {
                wx.navigateBack();
            });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.user-header {
    position: relative;
    padding-top: 1.5625rem;
    padding-bottom: 1.875rem;
    background: #05a6b1;

    .avatar {
        width: 5.625rem;
        height: 5.625rem;
        margin: 0 auto;
        text-align: center;
        line-height: 0;
        position: relative;

        image {
            width: 100%;
            height: 100%;
            border-radius: 100%;
        }

        &::after {
            content: "";
            width: 6.25rem;
            height: 6.25rem;
            border: 0.125rem solid #99e3ff;
            border-radius: 100%;
            position: absolute;
            left: -0.4125rem;
            top: -0.4125rem;
            z-index: 0;
        }
    }
}
.tip {
    text-align: center;
    padding-top: 0.625rem;
    color: #fff;
    navigator {
        display: inline;
    }
}
.primary-btn {
    margin-top: 30px;
}
</style>
