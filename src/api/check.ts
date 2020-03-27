import { IDataOne, IData, ICheckIn } from './model';
import { fetch, post } from '../utils/http';

export const getCanCheckIn = () => fetch<IDataOne<ICheckIn>>('check_in');
export const checkIn = () => post<IDataOne<ICheckIn>>('check_in/home/check_in');
export const getMonth = (month?: string) => post<IData<ICheckIn>>('check_in/home/month', {month});
