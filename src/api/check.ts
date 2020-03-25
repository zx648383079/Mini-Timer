import { IDataOne, IData, ICheckIn } from './model';
import { fetch, post } from '../utils/http';

export const getCanCheckIn = () => fetch<IDataOne<ICheckIn>>('auth/check_in');
export const checkIn = () => post<IDataOne<ICheckIn>>('auth/check_in/check_in');
export const getMonth = (month?: string) => post<IData<ICheckIn>>('auth/check_in/month', {month});
