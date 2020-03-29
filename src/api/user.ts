import {fetch, post, uploadFile, put} from '../utils/http';
import {IUser, ILogin, IDataOne, IRegister} from './model';

export const getProfile = () => fetch<IUser>('auth/user');

export const login = (param: ILogin) => post<IUser>('auth/login', param);

export const authLogin = (param: any) => post<IUser>('auth/oauth/mini', param);

export const logout = () => fetch('auth/logout');

export const register = (param: IRegister) => post<IUser>('auth/register', param);



export const sendFindEmail = (email: string) => post<IDataOne<boolean>>('auth/password/send_find_email', {
    email
});

export const resetPassword = (email: string, code: string,  password: string, confirm_password: string) => post<IDataOne<boolean>>('auth/password/reset', {
    email,
    code,
    password,
    confirm_password
});

export const updatePassword = (old_password: string, password: string, confirm_password: string) => post<IDataOne<boolean>>('auth/password/update', {
    old_password,
    password,
    confirm_password
});

export const updateProfile = (param: any) => put<IUser>('auth/user/update', param);


export const uploadAvatar = (img: string) => uploadFile<IUser>(img, {url: 'auth/user/avatar'});

