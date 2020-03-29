import { fetch } from "../utils/http";
import { IPage, IArticle, IData, IArticleCategory, IArticleComment } from "./model";

export const getArticleList = (param: any) => fetch<IPage<IArticle>>('blog', param);

export const getCategories = () => fetch<IData<IArticleCategory>>('blog/term');

export const getArticle = (id: number) => fetch<IArticle>('blog', {id});

export const getCommentList = (param: any) => fetch<IPage<IArticleComment>>('blog/comment', param);


export const getSuggestion = (keywords: string) => fetch<IData<IArticle>>('blog/home/suggest', {keywords});
