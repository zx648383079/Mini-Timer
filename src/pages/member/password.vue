<template>
    <div>
        <form class="form-inline" method="post" @submit="tapSubmit">
            <div class="input-group">
                <input type="password" placeholder="旧密码" required  v-model="oldpassword">
            </div>
            <div class="input-group">
                <input type="password" placeholder="新密码" required v-model="password">
            </div>
            <div class="input-group">
                <input type="password" placeholder="确认新密码" required v-model="repassword">
            </div>

            <button class="btn btn-primary">确定</button>
        </form>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from "../../../typings/wx/lib.vue";
import { IMyApp } from "../../app";
import { updatePassword } from "../../api/user";

const app = getApp<IMyApp>();

interface IPageData {
    oldpassword: string,
    password: string,
    repassword: string
}

@WxJson({
    navigationBarTitleText: "修改密码",
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
        if (this.data.password !== this.data.repassword) {
            wx.showToast({
                title: '确认密码不一致！'
            });
            return;
        }
        updatePassword(this.data.oldpassword, this.data.password).then(res => {
            app.logoutUser().then(() => {
                wx.navigateTo({
                    url: 'login'
                });
            });
        });
    }
}
</script>
<style lang="scss" scoped>
</style>
