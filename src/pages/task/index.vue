<template>
    <div>
        <div class="tab-header">
            <span v-for="(item, index) in status_list" :key="index" @click="tapStatus" data-status="{{ item.status }}" class="tab-item {{status == item.status ? 'active' : ''}}">{{ item.name }}</span>
        </div>

        <div class="box" v-if="items.length > 0" :class="{'on-edit': isEdit}">
            <div class="task-item" v-for="(item, index) in items" :key="index" @click="tapEdit(item.id, index)" :class="{finished: item.status < 5}">
                <i class="fa check-box" :class="{active: item.checked}"></i>
                <div class="name">{{ item.name }}</div>
                <div class="desc">{{ item.description }}</div>
                <div class="time">{{ item.time_format }}</div>
            </div>
            <div class="no-more-tip" v-show="!hasMore">
                我是有底线的
            </div>
        </div>

        <div class="empty-box" v-else>
            您的任务为空
        </div>

        <div class="edit-icon" v-if="!isEdit && status == 1" @click="isEdit = true">
            <i class="fa fa-edit"></i>
        </div>

        <div class="fixed-icon" @click="tapAdd" v-show="!isEdit">
            <i class="fa fa-plus"></i>
        </div>

        <div class="edit-action" v-show="isEdit">
            <div class="add-btn" @click="tapBatchAdd">添加至今日任务</div>
            <div class="stop-btn" @click="tapBatchStop">结束任务</div>
            <div class="cancel-btn" @click="tapFinish">完成</div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';
import { ITask } from '../../api/model';
import { getTaskList, batchAddTask, batchStopTask } from '../../api/task';
import { formatHour } from '../../utils/util';

interface IPageData {
    status: number;
    status_list: any[];
    items: ITask[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
    isEdit: boolean,
}
@WxJson({
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
        isEdit: false
    };

    onLoad() {
        
    }

    onShow() {
        this.tapRefresh();
    }

    public tapStatus(e: TouchEvent) {
        this.setData({
            status: e.currentTarget.dataset.status,
            isEdit: false
        });
        this.tapRefresh();
    }

    public tapAdd() {
        wx.navigateTo({
            url: '/pages/task/edit'
        })
    }

    public tapEdit(id: number, i: number) {
        if (!this.data.isEdit) {
            wx.navigateTo({
                url: '/pages/task/edit?id=' + id
            });
            return;
        }
        let items = this.data.items;
        items[i].checked = !items[i].checked;
        this.setData({items});
    }

    public tapBatchAdd() {
        let isLoading = this.data.isLoading;
        if (isLoading) {
            return;
        }
        let items: number[] = [];
        for (const item of this.data.items) {
            if (item.checked && item.status && item.status >= 5) {
                items.push(item.id as number);
            }
        }
        if (items.length < 1) {
            wx.showToast({
                title: '请选择任务'
            })
            return;
        }
        this.setData({
            isLoading: true
        });
        batchAddTask(items).then(_ => {
            wx.showToast({
                title: '添加成功'
            });
            this.setData({
                isLoading: false
            });
        });
    }

    public tapBatchStop() {
        let isLoading = this.data.isLoading;
        if (isLoading) {
            return;
        }
        let items: number[] = [];
        for (const item of this.data.items) {
            if (item.checked && item.status && item.status >= 5) {
                items.push(item.id as number);
            }
        }
        if (items.length < 1) {
            wx.showToast({
                title: '请选择任务'
            })
            return;
        }
        this.setData({
            isLoading: true
        });
        batchStopTask(items).then(_ => {
            wx.showToast({
                title: '结束任务成功'
            });
            this.setData({
                isLoading: false
            });
            this.tapRefresh();
        });
    }

    public tapFinish() {
        let data = this.data;
        data.isEdit = false;
        for (const item of data.items) {
            item.checked = false;
        }
        this.setData(data);
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
            res.data.forEach(item => {
                item.time_format = formatHour(item.time_length as number, 'hh:ii:ss', true);
            });
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
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.box {
    margin-bottom: 50px;
}
.task-item {
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
    .check-box {
        display: none;
        position: absolute;
        left: 10px;
        top: 50%;
        margin-top: -10px;
    }
    .time {
        position: absolute;
        font-size: 30px;
        right: 0;
        opacity: .1;
        top: 0;
    }
    &.finished {
        border-color: #999;
    }
}

.on-edit {
    .task-item {
        padding: 10px 10px 10px 30px;
        .check-box {
            display: block;
        }
        .time {
            display: none;
        }
    }
}

.edit-icon {
    position: fixed;
    left: 10px;
    bottom: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgb(18, 126, 90);
    color: #fff;
    line-height: 40px;
    text-align: center;
    .fa {
        font-size: 30px;
    }
}

.edit-action {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background-color: #fff;
    line-height: 40px;
    border-top: 1px solid #ccc;
    .add-btn,
    .stop-btn,
    .cancel-btn {
        float: left;
        width: 33%;
        text-align: center;
    }
    .add-btn {
        font-size: 12px;
    }
    .stop-btn {
        background-color: #b4282d;
        color: #fff;
    }
}
</style>
