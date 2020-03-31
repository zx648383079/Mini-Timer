<template>
    <div>
        <div class="box">
            <div class="message-item" v-for="(item, index) in items" :key="index">
                <div class="icon-header">
                    <span>{{ item.bulletin.icon }}</span>
                </div>
                <div class="content">
                    <div class="name">
                        <span>{{ item.bulletin.user_name }}</span>
                        <span>{{ item.bulletin.created_at }}</span>
                    </div>
                    <div class="desc">
                        {{ item.bulletin.title }} 
                    </div>
                    <div class="footer">
                        <span>点击查看</span>
                    </div>
                    <div class="un-read" v-if="item.status < 1">
                        未读
                    </div>
                </div>
            </div>
            <div class="empty-box" v-if="items.length < 1">
                暂无消息
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { getBulletinList } from '../../api/bulletin';
import { IBulletinUser } from '../../api/model';

interface IPageData {
    items: IBulletinUser[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    navigationBarTitleText: "消息中心",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black",
    enablePullDownRefresh: true
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
    };

    onLoad() {
        this.tapRefresh();
    }

    onShow() {
        
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
        if (this.data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true
        });
        getBulletinList({
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
    margin-bottom:10px;
    .icon-header {
        font-size:25px;
        color:#41C4FF;
        float:left;
        margin-right:15px;
        width:7%;
        height: 80px;
        text {
            display: block;
            line-height: 80px;
        }
        image {
            width: 30px;
            height: 30px;
            margin-top: 15px;
        }
    }
    .content {
        .name,
        .footer {
            font-size: 12px;
            color: #999;
            text {
                margin-right: 10px;
            }
        }
        .desc {
            font-size: 14px;
            line-height: 20px;
            padding: 10px 0;
            color: #000000;
            overflow: hidden;
            height: 40px;
        }
    }
    .un-read {
        position: absolute;
        font-size: 30px;
        right: 20px;
        opacity: .1;
        top: 20px;
        transform: rotate(30deg);
    }
}
</style>
