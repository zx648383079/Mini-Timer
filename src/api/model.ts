export interface IPaging {
    limit: number;
    offset: number;
    total: number;
    more: boolean;
}

export interface IPage<T> {
    paging: IPaging;
    data: T[];
}

export interface IBaseResponse {
    appid?: string;
    sign?: string;
    sign_type?: string;
    timestamp?: string;
    encrypt?: string;
    encrypt_type?: string;
}
export interface IData<T> extends IBaseResponse {
    data?: T[];
}

export interface IDataOne<T> extends IBaseResponse {
    data?: T;
}

export interface IConnect {
    id?: number,
    vendor?: string,
    nickname?: string,
    created_at?: string,
    name?: string,
    icon?: string;
}

export interface IUser {
    id: number;
    email: string;
    name: string;
    avatar: string;
    token?: string;
    birthday?: string;
}

export interface ILogin {
    email?: string;
    password?: string;
    mobile?: string;
    code?: string;
}

export interface IRegister {
    name: string;
    email?: string;
    password?: string;
    mobile?: string;
    code?: string;
    rePassword?: string;
    agree: boolean;
}

export interface ICheckIn {
    id: number,
    created_at: string,
    running: number,
    type: number
}
