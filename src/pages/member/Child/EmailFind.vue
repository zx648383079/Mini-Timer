<template>
    <div>
        <div class="logo">
            <img src="/images/wap_logo.png" mode="widthFix">
        </div>
        <form bindsubmit="formSubmit" >
            <div class="input-box">
                <input type="email" name="email" required autocomplete="off" v-model="email" placeholder="请输入邮箱" :disabled="isSended">
            </div>
            <div class="reset-box" v-if="isSended">
                <div class="input-box">
                    <input type="text" name="code" autocomplete="off" v-model="code" placeholder="请输入安全码">
                </div>
                <div class="input-box">
                    <input type="password" name="password" autocomplete="off" v-model="password" placeholder="请输入密码">
                </div>
                <div class="input-box">
                    <input type="password" name="rePassword" required autocomplete="off" v-model="rePassword" placeholder="请确认密码">
                </div>
            </div>
            <button form-type="submit">{{isSended ? '重置密码' : '发送验证邮件'}}</button>
            <span class="right" @click="tapMode" data-mode="0">返回登录</span>
        </form>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod, TouchEvent } from "../../../../typings/wx/lib.vue";
import { IMyApp } from "../../../app.vue";
import { resetPassword } from "../../../api/user";

interface IComponentData {
    email: string,
    code: string,
    password: string,
    rePassword: string,
    isSended: boolean,
}

const app = getApp<IMyApp>();

@WxJson({
    component: true
})
export class EmailFind extends WxComponent<IComponentData>  {

    public options = {
        addGlobalClass: true
    }

    public data = {
        email: '',
        code: '',
        password: '',
        rePassword: '',
        isSended: false
    };

    @WxMethod()
    tapMode(e: TouchEvent) {
        this.tapChange(e.currentTarget.dataset.mode as number);
    }
    @WxMethod()
    tapChange(mode: number) {
        this.triggerEvent('click', mode);
    }

    @WxMethod()
    formSubmit() {
        const data = this.data;
        const email = data.email;
        if (!data.isSended) {
            this.tapSendEmail(email);
            return;
        }
        const password = data.password;
        const rePassword = data.rePassword;
        const code = data.code;
        if (!email || !/.+@.+/.test(email)) {
            wx.showToast({
                icon: 'none',
                title: '请输入邮箱'
            });
            return;
        }
        if (!password || password.length < 6) {
            wx.showToast({
                icon: 'none',
                title: '请输入密码'
            });
            return;
        }
        if (rePassword !== password) {
            wx.showToast({
                icon: 'none',
                title: '两次密码不一致'
            });
            return;
        }
        if (!code || code.length < 4) {
            wx.showToast({
                icon: 'none',
                title: '请输入正确的安全码'
            });
            return;
        }
        resetPassword(
            email,
            code,
            password,
            rePassword).then(_ => {
            wx.showToast({
                title: '密码重置成功！'
            });
            this.setData({
                isSended: false
            });
            this.triggerEvent('click', 0);
        });
    }

    @WxMethod()
    tapSendEmail(email: string) {
        if (!email || !/.+@.+/.test(email)) {
            wx.showToast({
                icon: 'none',
                title: '请输入邮箱'
            });
            return;
        }
        app.sendFindEmail(email).then(_ => {
            wx.showToast({
                title: '发送成功，请查看邮件'
            });
            this.setData({
                isSended: true
            });
        });
    }

}
</script>
<style lang="scss" scoped>
.title {
    font-size: 20px;
    line-height: 80px;
    color: #333;
    margin-bottom: 10vh;
}
.checkbox {
    display: inline-block;
}
.right {
    float: right;
}
</style>
