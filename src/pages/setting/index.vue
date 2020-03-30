<template>
    <div>
        <div class="large-header">
            <div class="title">设置</div>
            <i class="fa fa-check" @click="tapSubmit"></i>
        </div>
        <div class="line-item">
            <span class="label">震动</span>
            <div class="action">
                <switch checked="{{setting.vibrate}}" bindchange="tapVibrate"/>
            </div>
        </div>
        <div class="line-item">
            <span class="label">屏幕常亮</span>
            <div class="action">
                <switch checked="{{setting.screenOn}}" bindchange="tapScreenOn"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from "../../../typings/wx/lib.vue";
import { SETTING_KEY } from "../../utils/types";
import { ISetting } from "../../api/model";

interface IPageData {
    setting: ISetting
}

@WxJson({
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class Index extends WxPage<IPageData> {
    public data: IPageData = {
        setting: {
            vibrate: true,
            screenOn: true
        },
    };

    public onLoad() {
        let setting = this.data.setting;
        let that = this;
        wx.getStorage({
            key: SETTING_KEY,
            success(res) {
                setting = Object.assign({}, setting, res.data);
                that.setData({setting});
            }
        });
    }

    /**
     * ScreenOn
     */
    public tapScreenOn(e: any) {
        let setting = this.data.setting;
        setting.screenOn = e.detail.value;
        this.setData({setting});
    }

    /**
     * tapVibrate
     */
    public tapVibrate(e: any) {
        let setting = this.data.setting;
        setting.vibrate = e.detail.value;
        this.setData({setting});
    }

    /**
     * tapSubmit
     */
    public tapSubmit() {
        let setting = this.data.setting;
        wx.setStorage({
            key: SETTING_KEY,
            data: setting
        });
        wx.showToast({
            title: '保存成功'
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.line-item {
    line-height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    .label {

    }
    .action {
        float: right;
    }
}
</style>
