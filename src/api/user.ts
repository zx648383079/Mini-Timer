import {fetch, post, deleteRequest} from '../utils/http';
import {IUser, ILogin, IPage, IAccountLog, ICollect, IData, IConnect, IDataOne, IRegister,} from './model';

export const getProfile = () => fetch<IUser>('auth/user');

export const getConnect = () => fetch<IData<IConnect>>('shop/account/connect');

export const login = (param: ILogin) => post<IUser>('auth/login', param);

export const authLogin = (param: any) => post<IUser>('auth/oauth/mini', param);

export const logout = () => fetch('auth/logout');

export const register = (param: IRegister) => post<IUser>('auth/register', param);

export const sendFindEmail = (email: string) => post<IDataOne<boolean>>('auth/password/send_find_email', {
    email
});

export const updatePassword = (oldPassword: string, password: string) => post<IUser>('auth/password/update', {
    old_password: oldPassword,
    password,
});
