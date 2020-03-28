<template>
    <div>
        <div class="large-header">
            <div class="title">留言反馈</div>
            <i class="fa fa-check" @click="tapSubmit"></i>
        </div>
        <div class="input-box">
            <input type="text" placeholder="称呼" required  v-model="name">
        </div>
        <div class="input-box">
            <input type="email" placeholder="邮箱" v-model="email">
        </div>
        <div class="input-box">
            <input type="text" placeholder="联系方式" v-model="phone">
        </div>
        <div class="input-box">
            <textarea placeholder="留言内容" v-model="content"></textarea>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { saveFeedback } from '../../api/account';

const app = getApp<IMyApp>();

interface IPageData {
    name: string,
    email: string;
    phone: string;
    content: string;
    isGuest: boolean
}
@WxJson({
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        name: '',
        email: '',
        phone: '',
        content: '',
        isGuest: true,
    };

    onLoad() {
        this.setData({
            isGuest: !app.globalData.token
        });
    }

    public tapSubmit() {
        let data = this.data;
        if (data.name.length < 1) {
            wx.showToast({
                icon: 'none',
                title: '请输入称呼！'
            });
            return;
        }
        if (data.content.length < 1) {
            wx.showToast({
                icon: 'none',
                title: '请输入留言内容！'
            });
            return;
        }
        saveFeedback(data).then(_ => {
            wx.showToast({
                title: '留言成功！'
            });
            wx.navigateBack();
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
