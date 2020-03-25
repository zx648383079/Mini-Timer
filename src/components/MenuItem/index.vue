<template>
    <div @click="tapGo">
        <i class="fa {{icon}}"></i>
        {{ title }}
        <i class="fa fa-chevron-right"></i>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod } from "../../../typings/wx/lib.vue";

@WxJson({
    component: true
})
export class MenuLargeItem extends WxComponent<any>  {
    public options = {
        addGlobalClass: true
    }
    
    public properties = {
        title: String,
        icon: String,
        uri: String,
    }
    @WxMethod()
    public tapGo() {
        if (this.data.uri) {
            wx.navigateTo({
                url: this.data.uri
            });
            return;
        }
        this.triggerEvent('click');
    }
}

</script>
<style lang="scss" scoped>

</style>
