<template>
    <div>
        <div class="large-header">
            <div class="title">修改{{ title }}</div>
            <i class="fa fa-check1" @click="tapSubmit"></i>
        </div>
        <div class="input-box">
            <input type="text" placeholder="{{ title }}" required  v-model="value">
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from "../../../typings/wx/lib.vue";
import { IMyApp } from "../../app.vue";
import { updateProfile } from "../../api/user";
import { IUser } from "../../api/model";

const app = getApp<IMyApp>();

interface IPageData {
    field: 'name',
    value: string,
    title: string,
    user: IUser | null,
}

const PROFILE_NAMES: any = {
    name: '昵称'
};

@WxJson({
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class Password extends WxPage<IPageData> {
    public data: IPageData = {
        title: '昵称',
        field: 'name',
        value: '',
        user: null,
    }

    public onLoad(option: any) {
        const data = this.data;
        data.field = option.field || 'name';
        data.title = PROFILE_NAMES.hasOwnProperty(data.field) ? PROFILE_NAMES[data.field]  : '信息';
        app.getUser().then(res => {
            if (!res) {
                wx.navigateBack({
                    delta: 0
                })
                return;
            }
            data.user = res;
            data.value = res.hasOwnProperty(data.field) ? res[data.field]  : '';
            this.setData(data);
        });
    }

    /**
     * tapSubmit
     */
    public tapSubmit() {
        let data = this.data;
        if (data.value.length < 2) {
            wx.showToast({
                icon: 'none',
                title: '请输入'+ data.title +'！'
            });
            return;
        }
        updateProfile({
            [data.field]: data.value
        }).then(res => {
            app.setUser(res);
            wx.navigateBack({
                delta: 0
            });
        });
    }
}
</script>
<style lang="scss" scoped>
</style>
