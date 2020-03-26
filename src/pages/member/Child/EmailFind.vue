<template>
    <div>
        <div class="logo">
            <img src="/images/wap_logo.png" mode="widthFix">
        </div>
        <form bindsubmit="formSubmit" >
            <div class="input-box">
                <input type="email" name="email" required autocomplete="off" v-model="email" placeholder="请输入账号">
            </div>
            <button form-type="submit">发送验证邮件</button>
            <span class="right" @click="tapMode" data-mode="0">返回登录</span>
        </form>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod, TouchEvent } from "../../../../typings/wx/lib.vue";
import { IMyApp } from "../../../app.vue";

interface IComponentData {
    email: string,
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
            this.triggerEvent('click', 0);
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
