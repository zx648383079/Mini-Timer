<template>
    <div>
        <div class="box">
            <div class="day-item" v-for="(item, index) in items" :key="index" @click="tapDay" data-id="{{ item.id }}">
                <div class="name">{{ item.task.name }}</div>
                <div class="desc">{{ item.task.description }}</div>
                <div class="count" v-if="item.amount > 1">{{ item.amount }}</div>
                <div class="tip" v-if="item.status === 9">进行中</div>
                <div class="tip" v-if="item.status === 8">暂停中</div>
            </div>

            <div class="empty-box" v-if="items.length < 1">
                您今日没有安排了
            </div>
        </div>

        <div class="fixed-icon" @click="tapAdd">
            <i class="fa fa-plus"></i>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';
import { ITaskDay } from '../../api/model';
import { getTaskDayList } from '../../api/task';

const app = getApp<IMyApp>();

interface IPageData {
    isGuest: boolean;
    items: ITaskDay[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    navigationBarTitleText: "今日任务",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black",
    enablePullDownRefresh: true
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        isGuest: true,
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
    };

    onLoad() {
    }

    onShow() {
        this.setData({
            isGuest: !app.globalData.token
        });
        this.tapRefresh();
    }

    onPullDownRefresh() {
        this.tapRefresh();
        wx.stopPullDownRefresh();
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
        if (this.data.isLoading || this.data.isGuest) {
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
        }, () => {
            this.setData({
                isLoading: false
            });
        });
    }

    public tapAdd() {
        if (this.data.isGuest) {
            wx.navigateTo({
                url: '/pages/member/login'
            })
            return;
        }
        wx.navigateTo({
            url: '/pages/task/index'
        })
    }

    public tapDay(e: TouchEvent) {
        wx.navigateTo({
            url: '/pages/task/detail?id=' + e.currentTarget.dataset.id
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.day-item {
    min-height: 80px;
    padding: 10px 10px;
    margin: 5px;
    border: 1px solid aquamarine;
    border-radius: 5px;
    position: relative;
    background-color: #fff;
    .name {
        font-weight: bold;
        line-height: 30px;
        font-size: 16px;
    }
    .desc {
        color: 777;
        font-size: 14px;
    }
    .count {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 30px;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: rgba($color: red, $alpha: .6);
        color: #fff;
    }
    .tip {
        position: absolute;
        font-size: 30px;
        right: 0;
        opacity: .1;
        top: 0;
    }
}
</style>
