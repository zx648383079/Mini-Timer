<template>
    <div>
        <div class="profile-box" v-if="user">
                <div class="line-item avatar-item">
                    <span>头像</span>
                    <span class="avatar">
                        <img :src="user.avatar" alt="">
                    </span>
                    <i class="fa fa-chevron-right"></i>
                </div>
                <div class="line-item">
                    <span>昵称</span>
                    <span>{{user.name}}</span>
                    <i class="fa fa-chevron-right"></i>
                </div>
                <div class="line-item" @click="tapSex">
                    <span>性别</span>
                    <span>{{user.sex}}</span>
                    <i class="fa fa-chevron-right"></i>
                </div>
                <picker
                    mode="date"
                    value="{{user.birthday}}"
                    start="1930-01-01"
                    end="{{ max }}"
                    bindchange="bindDateChange" >
                    <div class="line-item">
                        <span>生日</span>
                        <span>{{user.birthday}}</span>
                        <i class="fa fa-chevron-right"></i>
                    </div>
                </picker>
            </div>

            
            <div class="menu-list">
                <a class="item" href="password">
                    修改密码
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
                <a class="item" href="driver">
                    登陆设备管理
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
                <a class="item" href="cancel">
                    账户注销
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
                
            </div>

            <div class="btn del-btn" @click="tapLogout">
                退出
            </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { IUser } from '../../api/model';
import { WxJson, WxPage, CustomEvent } from '../../../typings/wx/lib.vue';
const app = getApp<IMyApp>();

interface IPageData {
    user: IUser|null,
    max: string,
}
@WxJson({
    navigationBarTitleText: "个人信息",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Profile extends WxPage<IPageData> {
    public data: IPageData = {
        user: null,
        max: '2020-05-19'
    };

    public onLoad() {
        let now = new Date();
        this.setData({
            max: [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-')
        });
        app.getUser().then(res => {
            this.setData({
                user: res
            });
        });
    }

    /**
     * bindDateChange
     */
    public bindDateChange(e: CustomEvent) {
        let user = this.data.user as IUser;
        user.birthday = e.detail.value;
        this.setData({
            user
        });
    }

    /**
     * tapSex
     */
    public tapSex() {
        wx.showActionSheet({
            itemList: ['男', '女', '未知'],
            success: res => {
                console.log(res.tapIndex);
                
            }
        })
    }

    public tapLogout() {
        app.logoutUser().then(() => {
            wx.switchTab({
                url: '/pages/index/index'
            });
        });
    }
}
</script>
<style lang="scss" scoped>
.profile-box {
    .avatar-item {
        border-top: none;
        .avatar {
            float: right;
            margin-right: 1.25rem;
        }
    }
    .line-item {
        text {
            &:nth-child(2) {
                float: right;
                margin-right: 1.25rem;
            }
        }
    }
}
</style>
