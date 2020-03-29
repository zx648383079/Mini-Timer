<template>
    <div>
        <div class="user-header">
            <div class="avatar" @click="tapProfile">
                <img :src="user ? user.avatar : '/images/avatar.png'">
            </div>
            <div class="name">
                欢迎您，
                <a v-if="user" href="profile">{{ user.name }}</a>
                <a v-else href="login">请登陆</a>
                ~
            </div>
        </div>

        <div class="menu-list">
            <MenuItem class="item" title="扫一扫" icon="fa-scan" @click="tapScan" v-if="user"/>
            <MenuItem class="item" title="签到" icon="fa-calendar" uri="/pages/checkin/index"/>
            <MenuItem class="item" title="我的消息" icon="fa-bell" uri="/pages/message/index"/>
            <MenuItem class="item" title="帮助" icon="fa-help" uri="/pages/article/index"/>
            <MenuItem class="item" title="反馈" icon="fa-feedback" uri="/pages/feedback/index"/>
        </div>
        
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { IUser } from '../../api/model';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

const app = getApp<IMyApp>();

interface IPageData {
    user: IUser | null,
}
@WxJson({
    usingComponents: {
        MenuItem: "/components/MenuItem/index"
    },
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        user: null,
    };

    public onLoad() {
        
    }

    public onShow() {
        app.getUser().then(res => {
            this.setData({
                user: res
            });
            if (res) {
                
            }
        }).catch(_ => {
            app.setToken();
        });
    }

    public tapProfile() {
        if (!this.data.user) {
            return;
        }
        wx.navigateTo({
            url: 'profile'
        });
    }

    public tapScan() {
        wx.scanCode({
            scanType: ['qrCode'],
            onlyFromCamera: true,
            success(res) {
                wx.navigateTo({
                    url: '/pages/authorize/index?token=' + encodeURIComponent(res.result)
                });
            }
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

    .name {
        text-align: center;
        padding-top: 0.625rem;
        color: #fff;
        navigator {
            display: inline;
        }
    }
}
</style>
