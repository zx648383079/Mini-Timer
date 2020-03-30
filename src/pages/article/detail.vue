<template>
    <div v-if="article">
        <div class="article-title">{{ article.title }}</div>
        <div class="article-tags">
            <span class="author" v-if="article.user"><i class="fa fa-pencil"></i><b>{{ article.user.name }}</b></span>
            <span class="category" v-if="article.term"><i class="fa fa-tag"></i><b>{{ article.term.name }}</b></span>
            <span class="comment"><i class="fa fa-comments"></i><b>{{ article.comment_count }}</b></span>
            <span class="agree"><i class="fa fa-thumbs-o-up"></i><b>{{ article.recommend }}</b></span>
            <span class="click"><i class="fa fa-eye"></i><b>{{ article.click_count }}</b></span>
        </div>
        <div class="article-content">
            <rich-text nodes="{{article.content}}"/>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { IArticle } from '../../api/model';
import { getArticle } from '../../api/article';

interface IPageData {
    article: IArticle | null,
}
@WxJson({
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Detail extends WxPage<IPageData> {
    public data: IPageData = {
        article: null,
    };

    onLoad(option: any) {
        const id = option && option.id ? option.id : 0;
        if (id < 1) {
            wx.navigateBack();
            return;
        }
        getArticle(id).then(res => {
            this.setData({
                article: res,
            });
        }, () => {
            wx.navigateBack();
        });
    }

    public onShareAppMessage() {
        let article = this.data.article;
        if (!article) {
            return {};
        }
        return {
            title: article.title,
        };
    }

    public onPageScroll(e: any) {
        let article = this.data.article;
        if (!article) {
            return;
        }
        let title = '';
        if (e.scrollTop > 100) {
            title = article.title;
        }
        wx.setNavigationBarTitle({
            title: title
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.article-content {
    background-color: #fff;
    margin: 0 0 20px;
    padding: 10px 5px;
}
.article-title {
    color: #fff;
    background-color: #05a6b1;
    font-size: 18px;
    text-align: center;
    line-height: 30px;
}
.article-tags {
    padding-top: 10px;
    padding-left: 10px;
    line-height: 20px;
    font-size: 13px;
    color: #fff;
    background-color: #05a6b1;
    .author,
    .agree,
    .category,
    .comment,
    .click {
        display: inline-block;
        margin-right: 10px;
    }
}
</style>
