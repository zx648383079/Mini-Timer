<template>
    <div>
        <div class="logo">
            <img src="/images/wap_logo.png" mode="widthFix">
        </div>
        <div class="email-password">
            <form bindsubmit="formSubmit" >
                <div class="input-box">
                    <input type="email" name="email" required autocomplete="off" v-model="email" placeholder="请输入账号">
                </div>
                <div class="input-box">
                    <input type="password" name="password" required autocomplete="off" @keyup="tapKey" v-model="password" placeholder="请输入密码">
                </div>
                <div class="unlogin">
                    <span @click="tapMode" data-mode="1">注册账号</span>
                    <span @click="tapMode" data-mode="2">忘记密码</span>
                </div>
                <button form-type="submit">登录</button>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../../app.vue';
import { WxMethod, TouchEvent, WxComponent, WxJson } from '../../../../typings/wx/lib.vue';

interface IComponentData {
    email: string,
    password: string,
}

const app = getApp<IMyApp>();

@WxJson({
    component: true
})
export class EmailLogin extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true
    }

    public data = {
        email: '',
        password : ''
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
    formSubmit(e: any) {
        const email = e.detail.value.email;
        const password = e.detail.value.password;
        if (!email || !/.+@.+/.test(email)) {
            wx.showToast({
                icon: 'none',
                title: '请输入邮箱'
            });
            return;
        }
        if (!password || password.length < 4) {
            wx.showToast({
                icon: 'none',
                title: '请输入密码'
            });
            return;
        }
        app.loginUser({email, password}).then(_ => {
            this.triggerEvent('back');
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
