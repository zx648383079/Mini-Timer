<template>
    <div>
        <div class="account-box">
            <div class="line-item" v-for="(item, index) in items" :key="index" :class="{active: item.id}" @click="tapBind(index)">
                <span class="vendor"><i :class="['fa', item.icon]"></i>{{ item.name }}</span>
                <span class="label">{{ item.id ? '已绑(' + item.nickname + ')' : '未绑定' }}</span>
                <i class="fa fa-chevron-right"></i>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { IConnect } from '../../api/model';
import { getConnect } from '../../api/account';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

interface IPageData {
    items: IConnect[]
}

@WxJson({
    navigationBarTitleText: "账户关联",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Center extends WxPage<IPageData> {

    public data: IPageData = {
        items: []
    };

    public onLoad() {
        getConnect().then(res => {
            if (!res.data) {
                return;
            }
            this.setData({
                items: res.data
            });
        }); 
    }

    public tapBind(i: number) {
        const item = this.data.items[i];
        if (item.name !== '微信小程序') {
            return;
        }
        if (item.id && item.id > 0) {
            return;
        }
        wx.navigateTo({
            url: 'bind'
        });
    }
}
</script>
<style lang="scss" scoped>
.account-box {
    .line-item {
        .vendor {
            display: inline-block;
            .fa {
                position: static;
            }
        }
        .label {
            color: #999;
            font-size: 12px;
        }
        &.active {
            .label {
                color: #333;
            }
        }
    }
}
</style>
