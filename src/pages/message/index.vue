<template>
    <div>
        <div class="box">
            <div class="message-item" v-for="(item, index) in items" :key="index">
                <div class="icon-header">
                    <span>系</span>
                </div>
                <div class="content">
                    <div class="name">
                        <span>系统通知</span>
                        <span>8小时前</span>
                    </div>
                    <div class="desc">
                        十米哦  
                    </div>
                    <div class="footer">
                        <span>点击查看</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { getTaskDayList } from '../../api/task';

const app = getApp<IMyApp>();

interface IPageData {
    items: number[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    navigationBarTitleText: "消息中心",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        items: [1, 2],
        page: 1,
        hasMore: true,
        isLoading: false,
    };

    onLoad() {
    }

    onShow() {
        
    }

    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.data.hasMore) {
            return;
        }  
        this.goPage(this.data.page + 1);
    }

    public goPage(page: number) {
        if (this.data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true
        });
        getTaskDayList({
            page: page,
        }).then(res => {
            this.setData({
                page: page,
                hasMore: res.paging.more,
                isLoading: false,
                items: page < 2 ? res.data :  [].concat(this.data.items as never[], res.data as never[])
            });
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color:#f3f3f3;
}
.message-item {
    padding:10px;
    position:relative;
    background:#fff;
    margin-top:10px;
    overflow:hidden;
    .icon-header {
        font-size:25px;
        color:#41C4FF;
        float:left;
        margin-right:15px;
        width:7%;
        height:100px;
        text {
            display: block;
            width: 30px;
            height: 30px;
            margin-top: 10px;
        }
        image {
            width: 30px;
            height: 30px;
            margin-top: 10px;
        }
    }
    .content {
        .name,
        .footer {
            font-size: 12px;
            color: #999;
        }
        .desc {
            font-size: 14px;
            padding: 10px 0;
            color: #000000;
        }
    }
}
</style>
