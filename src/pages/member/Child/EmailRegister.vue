<template>
    <div>
        <div class="logo">
            <img src="/images/wap_logo.png" mode="widthFix">
        </div>
        <form bindsubmit="formSubmit" >
            <div class="input-box">
                <input type="text" name="name" required autocomplete="off" v-model="name" placeholder="请输入昵称">
            </div>
            <div class="input-box">
                <input type="email" name="email" required autocomplete="off" v-model="email" placeholder="请输入账号">
            </div>
            <div class="input-box">
                <input type="password" name="password" required autocomplete="off" v-model="password" placeholder="请输入密码">
            </div>
            <div class="input-box">
                <input type="password" name="rePassword" required autocomplete="off" v-model="rePassword" placeholder="请确认密码">
            </div>
            <button form-type="submit">注册</button>
            <div class="input-group">
                <div class="checkbox" @click="agree = !agree">
                    <i :class="['fa', agree ? 'fa-check-circle' : 'fa-circle']"></i>
                </div>
                同意<span @click="tapaAgreement">本站协议</span>

                <span class="right" @click="tapMode" data-mode="0">返回登录</span>
            </div>
        </form>
        <div class="agreement-box" v-if="mode == 1">
            <div class="title">注册协议</div>
            <div class="content">
                <p>本程序使用过程中产生的数据仅对本人公开，不会对外公布，但会存储了服务器，直到用户注销，用户产生的数据都会被删除。</p>
            </div>
            <div class="footer">
                <div class="btn" @click="tapAgree">我已阅读并同意协议</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod, TouchEvent } from "../../../../typings/wx/lib.vue";
import { IMyApp } from "../../../app.vue";

interface IComponentData {
    agree: boolean,
    name: string,
    email: string,
    password: string,
    rePassword: string,
    mode: number,
}

const app = getApp<IMyApp>();

@WxJson({
    component: true
})
export class EmailRegister extends WxComponent<IComponentData>  {

    public options = {
        addGlobalClass: true
    }

    public data = {
        name: '',
        email: '',
        password : '',
        rePassword : '',
        agree: true,
        mode: 0,
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
        const rePassword = e.detail.value.rePassword;
        const name = e.detail.value.name;
        const agree = this.data.agree;
        if (!agree) {
            wx.showToast({
                icon: 'none',
                title: '请先同意本站用户协议'
            });
            return;
        }
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
        if (rePassword !== password) {
            wx.showToast({
                icon: 'none',
                title: '两次密码不一致'
            });
            return;
        }
        app.registerUser({
            name,
            email,
            password,
            rePassword,
            agree
        }).then(_ => {
            this.triggerEvent('back');
        });
    }

    @WxMethod()
    public tapaAgreement() {
        this.setData({
            mode: 1
        });
    }

    @WxMethod()
    public tapAgree() {
        this.setData({
            mode: 0,
            agree: true
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
.agreement-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 99;
    .title {
        text-align: center;
        margin-bottom: 0;
        line-height: 60px;
    }
    .content {
        padding: 10px;
        text-align: left;
    }
    .footer {
        margin-top: 30px;
        text-align: center;
        .btn {
            display: inline-block;
        }
    }

}
</style>
