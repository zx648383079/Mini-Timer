import { IPage, IBulletinUser } from './model';
import { fetch } from '../utils/http';

export const getBulletinList = (param: any) => fetch<IPage<IBulletinUser>>('auth/bulletin', param)
