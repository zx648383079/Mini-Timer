<template>
    <div>
        <div class="day-header">
            <div class="month-picker">
                <picker
                    mode="date"
                    value="{{month}}"
                    start="2015-01-01"
                    end="{{ max }}"
                    fields="month"
                    bindchange="bindDateChange" >
                    <span>{{ month }}</span>
                </picker>
            </div>
            <ul class="day-ul">
                <li class="day-li" v-for="(item, index) in dayList" :key="index" :class="{active: item == day}" @click="tapDay(item)">
                    <span>{{ item }}</span>
                </li>
            </ul>
        </div>

        <div class="box" v-if="items.length > 0">
            <div class="task-item" v-for="(item, index) in items" :key="index" :class="{finished: item.status == 2, failure: item.status == 3}">
                <div class="name">{{ item.task.name }}</div>
                <div class="desc">{{ item.task.description }}</div>
                <div class="time">{{ item.time_format }}</div>
            </div>
            <div class="no-more-tip" v-show="!hasMore">
                我是有底线的
            </div>
        </div>

        <div class="empty-box" v-else>
            当日的时间未记录
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson, CustomEvent } from '../../../typings/wx/lib.vue';
import { twoPad, formatHour } from '../../utils/util';
import { ITaskLog } from '../../api/model';
import { getTaskLogList } from '../../api/task';

interface IPageData {
    month: string,
    dayList: string[],
    day: string,
    max: string,
    items: ITaskLog[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    navigationBarTitleText: "时间薄",
    navigationBarBackgroundColor: '#05a6b1',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        month: '2020-02',
        dayList: [],
        max: '2020-05-19',
        day: '01',
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
    };

    onLoad() {
        let now = new Date();
        this.setData({
            max: [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-')
        });
        this.tapMonth([now.getFullYear(), twoPad(now.getMonth() + 1)].join('-'));
        
    }

    public bindDateChange(e: CustomEvent) {
        this.tapMonth(e.detail.value);
    }

    public tapMonth(month: string) {
        this.setData({
            month,
        });
        this.refreshGrid();
        this.tapDay('01');
    }

    public tapDay(day: string) {
        this.setData({
            day
        });
        this.tapRefresh();
    }

    public refreshGrid() {
        const [year, month] = this.data.month.split('-');
        const date = new Date(parseInt(year, 10), parseInt(month, 10), 0);
        const count = date.getDate();
        let dayList = [];
        for (let i = 0; i < count; i++) {
            dayList.push(twoPad(i + 1));
        }
        this.setData({
            dayList
        });
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
        const data = this.data;
        if (data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true
        });
        getTaskLogList({
            page: page,
            type: 'day',
            date: [data.month, data.day].join('-')
        }).then(res => {
            res.data.forEach(item => {
                item.time_format = formatHour(item.time, 'hh:ii:ss', true);
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
            if (page < 2) {
                this.setData({
                    items: []
                });
            }
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.day-header {
    background-color: #05a6b1;
    color: #fff;
    position: relative;
    height: 45px;
    color: #fff;
    z-index: 10;
    .day-ul {
        padding-left: 80px;
        font-size: 0;
        font-family: none;
        white-space: nowrap;
        overflow: hidden;
        overflow-x: auto;
    }
    .day-li {
        padding: 0 10px;
        text-align: center;
        font-size: 13px;
        display: inline-block;
        vertical-align: top;
        text {
            display: inline-block;
            height: 45px;
            line-height: 45px;
            color: #fff;
            box-sizing: border-box;
        }
        &.active {
            text {
                color: #e4393c;
                border-bottom: 2px solid #e4393c;
            }
        }
    }
    .month-picker {
        position: absolute;
        top: 0;
        left: 0;
        width: 80px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        background-color: #05a6b1;
    }
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
    .time {
        position: absolute;
        font-size: 30px;
        right: 0;
        opacity: .1;
        top: 0;
    }
    &.finished {
        border-color: #05a6b1;
    }
    &.failure {
        border-color: #d22222;
    }
}

</style>
