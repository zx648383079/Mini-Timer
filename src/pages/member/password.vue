<template>
    <div>
        <div class="large-header">
            <div class="title">修改密码</div>
            <i class="fa fa-check1" @click="tapSubmit"></i>
        </div>
        <div class="input-box">
            <input type="password" placeholder="旧密码" required  v-model="oldpassword">
        </div>
        <div class="input-box">
            <input type="password" placeholder="新密码" required v-model="password">
        </div>
        <div class="input-box">
            <input type="password" placeholder="确认新密码" required v-model="repassword">
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from "../../../typings/wx/lib.vue";
import { IMyApp } from "../../app.vue";
import { updatePassword } from "../../api/user";

const app = getApp<IMyApp>();

interface IPageData {
    oldpassword: string,
    password: string,
    repassword: string
}

@WxJson({
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class Password extends WxPage<IPageData> {
    public data: IPageData = {
        oldpassword: '',
        password: '',
        repassword: ''
    }

    /**
     * tapSubmit
     */
    public tapSubmit() {
        let data = this.data;
        if (data.oldpassword.length < 4) {
            wx.showToast({
                icon: 'none',
                title: '请输入原密码！'
            });
            return;
        }
        if (data.password.length < 4) {
            wx.showToast({
                icon: 'none',
                title: '请输入新密码！'
            });
            return;
        }
        if (data.password === data.oldpassword) {
            wx.showToast({
                icon: 'none',
                title: '新密码不能和原密码一样！'
            });
            return;
        }
        if (data.password !== data.repassword) {
            wx.showToast({
                icon: 'none',
                title: '确认密码不一致！'
            });
            return;
        }
        updatePassword(this.data.oldpassword, this.data.password)
            .then(res => {
            app.setUser(res);
        });
    }
}
</script>
<style lang="scss" scoped>
</style>
