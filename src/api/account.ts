import {fetch, post, } from '../utils/http';
import {IData, IDataOne, IDriver, IConnect, IUser} from './model';


export const getConnect = () => fetch<IData<IConnect>>('shop/account/connect');

export const getDriver = () => fetch<IData<IDriver>>('auth/account/driver');

export const saveFeedback = (param: any) => post<IDataOne<boolean>>('contact/home/feedback', param);

export const cancelUser = (param: any) => post<IUser>('auth/account/cancel', param);