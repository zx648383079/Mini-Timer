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
    sex?: number;
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

export interface ITask {
    id?:          number;
    parent_id?:   number;
    name:        string;
    description: string;
    status?:      number;
    every_time?:  number;
    time_length?: number;
}

export interface ITaskDay {
    id:             number;
    task_id:        number;
    today:          string;
    amount:         number;
    success_amount: number;
    pause_amount:   number;
    failure_amount: number;
    status:         number;
    created_at:     string;
    updated_at:     string;
    task:           ITask;
    log?:            ITaskLog;
    tip?:            string;
}

export interface ITaskLog {
    id:          number;
    task_id:     number;
    day_id:      number;
    status:      number;
    outage_time: number;
    end_at:      number;
    created_at:  string;
}
