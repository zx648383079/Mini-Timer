import { IPage, ITask, ITaskDay, IDataOne } from './model';
import { fetch, post } from '../utils/http';

export const getTaskDayList = (param: any) => fetch<IPage<ITaskDay>>('task/home/today', param, {guest: true});

export const getTaskDayInfo = (id: number) => fetch<ITaskDay>('task/home/detail_day', {id});

export const getTaskList = (param: any) => fetch<IPage<ITask>>('task', param);

export const getTaskInfo = (id: number) => fetch<ITask>('task/home/detail', {id});

export const saveTask = (param: ITask) => post<ITask>('task/home/save', param);

export const batchAddTask = (id: number[]| number) => post<IDataOne<boolean>>('task/home/batch_add', {id});

export const batchStopTask = (id: number[]| number) => post<IDataOne<boolean>>('task/home/batch_stop_task', {id});

/**
 * 开始
 * @param id day_id
 */
export const playTask = (id: number) => post<ITaskDay>('task/home/play', {id});

/**
 * 暂停
 * @param id day_id
 */
export const pauseTask = (id: number) => post<ITaskDay>('task/home/pause', {id});
/**
 * 停止
 * @param id day_id
 */
export const stopTask = (id: number) => post<ITaskDay>('task/home/stop', {id});
/**
 * 验证
 * @param id day_id
 */
export const checkTask = (id: number) => post<ITaskDay>('task/home/check', {id}, {loading: false});