import { post } from "../utils/http";
import { IQrToken } from "./model";

interface IQrAction {
    token: string,
    confirm?: boolean,
    reject?: boolean
}

export const checkQrToken = (token: string) => post<IQrToken>('auth/qr', {token});

export const authorizeQrToken = (param: IQrAction) => post<IQrToken>('auth/qr/authorize', param);

