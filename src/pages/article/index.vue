<template>
    <div>
        <div :class="['scroll-nav', isExpand ? 'unfold' : '']">
            <ul class="nav-ul">
                <li class="nav-li" :class="{active: category == 0}" @click="tapCat(0)">
                        <text>全部</text>
                </li>
                <li  class="nav-li" v-for="(item, index) in categories" :key="index" :class="{active: category == item.id}" @click="tapCat(item.id)">
                        <text>{{ item.name }}</text>
                </li>
            </ul>
            <span @click="isExpand = !isExpand" class="fa nav-arrow"></span>
        </div>

        <div class="box">
            <block v-for="(item, index) in items" :key="index">
                <dl class="article-item" @click="tapArticle(item.id)">
                    <dt class="item-dt">{{ item.title }}
                        <span class="book-time">{{ item.crated_at }}</span></dt>
                    <dd class="item-dd">
                        <p class="item-p">{{ item.description }}</p>
                        <div class="tags">
                            <span class="author" v-if="item.user"><i class="fa fa-pencil"></i><b>{{ item.user.name }}</b></span>
                            <span class="category" v-if="item.term"><i class="fa fa-tag"></i><b>{{ item.term.name }}</b></span>
                            <span class="comment"><i class="fa fa-comments"></i><b>{{ item.comment_count }}</b></span>
                            <span class="agree"><i class="fa fa-thumbs-o-up"></i><b>{{ item.recommend }}</b></span>
                            <span class="click"><i class="fa fa-eye"></i><b>{{ item.click_count }}</b></span>
                        </div>
                    </dd>
                </dl>
            </block>
            <div class="empty-box" v-if="items.length < 1">
                没有文章哦
            </div>
        </div>

        <SearchBar @search="tapSearch"/>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { IArticleCategory, IArticle } from '../../api/model';
import { getCategories, getArticleList } from '../../api/article';

interface IPageData {
    categories: IArticleCategory[],
    category: number,
    keywords: string,
    items: IArticle[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    usingComponents: {
        SearchBar: '/pages/article/Child/SearchBar'
    },
    navigationBarTitleText: "文章列表",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        categories: [],
        category: 0,
        keywords: '',
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
    };

    onLoad(option: any) {
        if (option && option.category) {
            this.setData({
                category: option.category 
            });
        }
        getCategories().then(res => {
            this.setData({
                categories: res.data
            });
        });
        this.tapRefresh();
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
        getArticleList({
            category: this.data.category,
            keywords: this.data.keywords,
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

    /**
     * tapSearch
     */
    public tapSearch(e: any) {
        this.setData({
            keywords: e.detail
        });
        this.tapRefresh();
    }

    /**
     * tapCat
     */
    public tapCat(id: number) {
        this.setData({
            category: id,
            isExpand: false
        });
        this.tapRefresh();
    }

    /**
     * tapArticle
     */
    public tapArticle(id: string) {
        wx.navigateTo({
            url: 'detail?id=' + id
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.scroll-nav {
    position: relative;
    height: 45px;
    background-color: #05a6b1;
    color: #fff;
    z-index: 10;
    .nav-ul {
        padding-right: 35px;
        font-size: 0;
        font-family: none;
        white-space: nowrap;
        overflow: hidden;
        overflow-x: auto;
        background-color:  #05a6b1;
    }
    .nav-li {
        min-width: 3.75rem;
        padding: 0 5px;
        text-align: center;
        font-size: 13px;
        display: inline-block;
        vertical-align: top;
        text {
            display: inline-block;
            height: 45px;
            line-height: 45px;
            color: #fff;
        }
        &.active {
            text {
                color: #e4393c;
                border-bottom: 2px solid #e4393c;
            }
        }
    }
    .nav-arrow {
        position: absolute;
        top: 0;
        right: 0;
        width: 35px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        background-color: #05a6b1;
        &::before {
            content: "\e8df";
        }
    }
    &.unfold {
        .nav-ul {
            padding-right: 0;
            white-space: normal;
            padding-right: 30px;
        }
        .nav-arrow {
            &::before {
                content: "\e8e2";
            }
        }
    }
}
.article-item {
    background-color: #fff;
    margin-top: 10px;
    padding: 10px;
    .item-dt {
        line-height: 30px;
        font-weight: 800;
        font-size: 18px;
    }
    .item-dd {
        .item-p {
            margin: 5px 0;
            min-height: 40px;
            overflow: hidden;
        }
        .tags {
            line-height: 20px;
            font-size: 13px;
            color: #767676;
            .author,
            .agree,
            .category,
            .comment,
            .click {
                display: inline-block;
                margin-right: 10px;
            }
        }
    }
}
</style>
