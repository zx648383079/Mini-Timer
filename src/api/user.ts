import {fetch, post, uploadFile, put} from '../utils/http';
import {IUser, ILogin, IData, IDataOne, IRegister, IDriver,} from './model';

export const getProfile = () => fetch<IUser>('auth/user');

export const getDriver = () => fetch<IData<IDriver>>('auth/user/driver');

export const login = (param: ILogin) => post<IUser>('auth/login', param);

export const authLogin = (param: any) => post<IUser>('auth/oauth/mini', param);

export const logout = () => fetch('auth/logout');

export const register = (param: IRegister) => post<IUser>('auth/register', param);

export const cancelUser = (param: any) => post<IUser>('auth/user/cancel', param);

export const sendFindEmail = (email: string) => post<IDataOne<boolean>>('auth/password/send_find_email', {
    email
});

export const updatePassword = (oldPassword: string, password: string) => post<IUser>('auth/password/update', {
    old_password: oldPassword,
    password,
});

export const updateProfile = (param: any) => put<IUser>('auth/user/update', param);


export const uploadAvatar = (img: string) => uploadFile<IUser>(img, {url: 'auth/user/avatar'});