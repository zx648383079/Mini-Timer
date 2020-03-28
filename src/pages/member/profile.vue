<template>
    <div>
        <div class="profile-box" v-if="user">
                <div class="line-item avatar-item" @click="tapAvatar">
                    <span>头像</span>
                    <span class="avatar">
                        <img :src="user.avatar" alt="">
                    </span>
                    <i class="fa fa-chevron-right"></i>
                </div>
                <div class="line-item" @click="tapName">
                    <span>昵称</span>
                    <span>{{user.name}}</span>
                    <i class="fa fa-chevron-right"></i>
                </div>
                <div class="line-item">
                    <span>邮箱</span>
                    <span>{{user.email}}</span>
                    <i class="fa fa-chevron-right"></i>
                </div>
                <div class="line-item" @click="tapSex">
                    <span>性别</span>
                    <span>{{sex}}</span>
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
                <a class="item" href="/pages/account/connect">
                    账户关联
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
                <a class="item" href="/pages/account/driver">
                    登陆设备管理
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
                <a class="item" href="/pages/account/cancel">
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
import { uploadAvatar, updateProfile } from '../../api/user';
const app = getApp<IMyApp>();

const SEX_ITEMS = ['未知', '男', '女'];

interface IPageData {
    user: IUser|null,
    max: string,
    sex: string,
}
@WxJson({
    navigationBarTitleText: "个人信息",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Profile extends WxPage<IPageData> {
    public data: IPageData = {
        user: null,
        max: '2020-05-19',
        sex: SEX_ITEMS[2]
    };

    public onLoad() {
        let now = new Date();
        this.setData({
            max: [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-')
        });
        app.getUser().then(res => {
            if (!res) {
                return;
            }
            this.setData({
                user: res,
                sex: res.sex ? SEX_ITEMS[res.sex] : SEX_ITEMS[2]
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
        this.updateProfile('birthday', user.birthday);
    }

    public tapName() {
        wx.navigateTo({
            url: 'edit?field=name'
        });
    }

    /**
     * tapSex
     */
    public tapSex() {
        wx.showActionSheet({
            itemList: SEX_ITEMS,
            success: res => {
                const user = this.data.user as IUser;
                user.sex = res.tapIndex;
                this.setData({user, sex: SEX_ITEMS[res.tapIndex]});
                this.updateProfile('sex', user.sex);
            }
        })
    }

    public tapAvatar() {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            success (res) {
                if (res.tempFilePaths && res.tempFilePaths.length > 0) {
                    uploadAvatar(res.tempFilePaths[0]).then(res => {
                        app.setUser(res);
                    });
                }
            }
        })
    }

    public updateProfile(name: string, value: any) {
        updateProfile({
            [name]: value
        }).then(res => {
            app.setUser(res);
        });
    }

    public tapLogout() {
        app.logoutUser().then(() => {
            wx.switchTab({
                url: '/pages/index/index',
                success () { 
                    let page = getCurrentPages().pop(); 
                    if (!page) {
                        return; 
                    }
                    page.onShow();
            }
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
