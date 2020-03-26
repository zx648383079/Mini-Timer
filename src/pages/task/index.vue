<template>
    <div>
        <div class="tab-header">
            <span v-for="(item, index) in status_list" :key="index" @click="tapStatus" data-status="{{ item.status }}" class="tab-item {{status == item.status ? 'active' : ''}}">{{ item.name }}</span>
        </div>

        <SwipeRowBox class="swipe-box box">
            <SwipeRow name="task-item" v-for="(item, index) in items" :key="index" right-width="200" height="300">
                <div slot="content" class="swipe-content">
                    <div class="name">{{ item.name }}</div>
                    <div class="desc">{{ item.description }}</div>
                </div>
                <div slot="right" class="actions-right">
                    <i class="fa fa-trash" @click="tapRemove"></i>
                </div>
            </SwipeRow>
        </SwipeRowBox>

        <div class="footer-tip" v-show="!hasMore">
            我是有底线的
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
import { ITask } from '../../api/model';
import { getTaskList } from '../../api/task';

const app = getApp<IMyApp>();

interface IPageData {
    status: number;
    status_list: any[];
    items: ITask[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    usingComponents: {
        SwipeRowBox: '/components/SwipeRow/box',
        SwipeRow: '/components/SwipeRow/index'
    },
    navigationBarTitleText: "我的任务",
    navigationBarBackgroundColor: '#05a6b1',
    navigationBarTextStyle: 'white'
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        status: 1,
        status_list: [
            {
                name: '进行中',
                status: 1
            },
            {
                name: '已结束',
                status: 2
            },
        ],
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
    };

    onLoad() {
        
    }

    onShow() {
        this.tapRefresh();
    }

    public tapStatus(e: TouchEvent) {
        this.setData({
            status: e.currentTarget.dataset.status
        });
        this.tapRefresh();
    }

    public tapAdd() {
        wx.navigateTo({
            url: '/pages/task/edit'
        })
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
        getTaskList({
            page: page,
            status: this.data.status,
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
.swipe-content {
    width: 750rpx;
    margin: 0;
    padding: 10px 10px;
    .name {
        font-weight: bold;
        line-height: 30px;
        font-size: 16px;
    }
    .desc {
        color: 777;
        font-size: 14px;
    }
}
.actions-right {
    height: 100px;
    display: flex;
    direction: row;
    text-align: center;
    vertical-align: middle;
    line-height: 100px;
    
    .fa-trash {
        background-color: red;
        color: #fff;
        width: 150rpx;
        font-size: 30px;
    }
}
.footer-tip {
    text-align: center;
    color: #ccc;
    line-height: 60px;
}
</style>
