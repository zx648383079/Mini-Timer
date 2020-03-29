<template>
    <div>
        <div class="search-bar" v-if="inSearch">
            <div class="search-box">
                <div class="form-box">
                    <i class="fa fa-search" @click="tapConfirm"></i>
                    <input type="text" name="keywords" value="{{ keywords }}" bindinput="onKeyUp" placeholder="搜索" autocomplete="off" confirm-type="search" bindconfirm="tapConfirm">
                    <i class="fa fa-close" v-if="keywords && keywords.length > 0" @click="tapClearSearch"></i>
                </div>
                <text class="cancel-btn" @click="inSearch = false">取消</text>
            </div>
            <ul class="search-tip-box">
                <li v-for="(item, index) in tipList" :key="index">
                    <span @click="tapArticle(item.id)">{{ item.title }}</span>
                </li>
            </ul>
        </div>

        <div class="fixed-icon" @click="inSearch = true" v-if="!inSearch">
            <i class="fa fa-search"></i>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, InputEvent, TouchEvent, WxComponent, WxMethod } from '../../../../typings/wx/lib.vue';
import { getSuggestion } from '../../../api/article';
import { IArticle } from '../../../api/model';

interface IComponentData {
    keywords: string,
    tipList: IArticle[],
    inSearch: boolean
}

@WxJson({
    component: true
})
export class SearchBar extends WxComponent<IComponentData> {

    public options = {
        addGlobalClass: true
    }

    public data: IComponentData = {
        keywords: '',
        tipList: [],
        inSearch: false,
    };

    @WxMethod()
    tapClearSearch() {
        this.setData({
            keywords: '',
            tipList: []
        });
    }

    @WxMethod()
    onKeyUp(event: InputEvent) {
        this.setData({
            keywords: event.detail.value
        });
        if (!event.detail.value || event.detail.value.trim().length === 0) {
            return;
        }
        getSuggestion(event.detail.value).then(res => {
            this.setData({
                tipList: res.data ? res.data : []
            });
        });
    }

    @WxMethod()
    tapConfirm() {
        if (!this.data.keywords || this.data.keywords.trim().length === 0) {
            return;
        }
        this.tapEnterSearch(this.data.keywords);
    }

    @WxMethod()
    tapSearch(e: TouchEvent) {
        this.tapEnterSearch(e.currentTarget.dataset.value + '');
    }

    @WxMethod()
    tapArticle(id: number) {
        this.setData({
            inSearch: false
        });
        wx.navigateTo({
            url: '/pages/article/detail?id=' + id
        });
    }

    @WxMethod()
    tapEnterSearch(keywords: string) {
        this.triggerEvent('search', keywords);
        this.setData({
            inSearch: false
        });
    }
}
</script>
<style lang="scss" scoped>
.search-bar {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #05a6b1, $alpha: .3);
    z-index: 9;
}
.search-box {
    margin-top: 20vh;
    padding: 5px;
    line-height: 36px;
    display: block;
    position: relative;
    padding-right: 54px;
    background-color: #fff;
    .form-box {
        position: relative;
    }
    .fa {
        position: absolute;
        top: -2px;
        z-index: 99;
        color: #666;
        &.fa-search {
            left: 5px;
        }

        &.fa-close {
            right: 5px;
        }
    }

    input {
        margin-top: 0.125rem;
        width: 100%;
        font-size: 20px;
        padding: 4px 29px;
        box-sizing: border-box;
        background-color: #fff;
        border: 0;
        height: 32px;
        color: #333;
        text-align: left;
    }

    .cancel-btn {
        color: #333;
        position: absolute;
        width: 54px;
        right: 0;
        top: 4px;
        display: inline-block;
    }
}
.search-tip-box {
    display: block;
    padding-left: 10px;
    background-color: #fff;
    view {
        height: 30px;
        line-height: 30px;
        border-top: 1px solid #f2f2f2;
    }
}
</style>