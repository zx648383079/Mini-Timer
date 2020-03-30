<template>
    <div>
        <div class="cat-item" v-for="(item, index) in items" :key="index" @click="tapItem(item.id)">
            <div class="thumb">
                <img :src="item.thumb">
            </div>
            <div class="name">{{ item.name }}</div>
            <div class="count" v-if="item.blog_count > 0">{{ item.blog_count }}</div>
        </div>
        <div class="empty-box" v-if="items.length < 1">
            没有分类哦
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { IArticleCategory } from '../../api/model';
import { getCategories } from '../../api/article';

interface IPageData {
    items: IArticleCategory[],
}
@WxJson({
    navigationBarTitleText: "分类",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Category extends WxPage<IPageData> {
    
    public data: IPageData = {
        items: [],
    }

    onLoad() {
        getCategories().then(res => {
            this.setData({
                items: res.data
            });
        });
    }

    /**
     * tapItem
     */
    public tapItem(id: number) {
        wx.navigateTo({
            url: 'index?category=' + id
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.cat-item {
    position: relative;
    display: inline-block;
    background-color: #fff;
    margin-bottom: 50rpx;
    .thumb {
        image {
            width: 350rpx;
            height: 350rpx;
        }
    }
    .name {
        line-height: 30px;
        text-align: center;
        height: 30px;
        overflow: hidden;
    }
    .count {
        position: absolute;
        top: 0;
        right: 0;
        color: #fff;
        background-color: #a10000;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        font-size: 10px;
        overflow: hidden;
    }
    &:nth-of-type(2n) {
        margin-left: 50rpx;
    }
}
</style>
