import { Md5 } from 'ts-md5';
import { appId, secret } from '../config/config';
export * from '../config/config';

interface IAppParam {
    appid: string,
    timestamp: string,
    sign: string,
}

export function getAppParams(): IAppParam {
    const timestamp = getCurrentTime();
    const sign = Md5.hashStr(appId + timestamp + secret) + '';
    return {
        appid: appId,
        timestamp,
        sign,
    };
}

export function formatTime(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(twoPad).join('-') + ' ' + [hour, minute, second].map(twoPad).join(':')
}

export function getCurrentTime() {
  return formatTime(new Date());
}

export function twoPad(n: number): string {
  const str = n.toString()
  return str[1] ? str : '0' + str
}

export function formatHour(time: number, format?: string, isSecond = false): string {
    if (isNaN(time)) {
        time = 0;
    }
    if (!isSecond) {
        time = Math.floor(time / 1000);
    }
    let s = time % 60,
        m = format && format.indexOf('h') < 0 ? Math.floor(time / 60) : (Math.floor(time / 60) % 60),
        h = Math.floor(time / 3600);
    if (!format) {
        return (h !== 0 ? twoPad(h) + ':' : '') + twoPad(m) + ':' + twoPad(s);
    }
    return format.replace(/h+/, twoPad(h)).replace(/i+/, twoPad(m)).replace(/s+/, twoPad(s));
}

export function each(data: any, cb: (val: any, key: string | number) => boolean| void) {
  if (typeof data !== 'object') {
      return cb(data, 0);
  }
  if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
          if (cb(data[i], i) === false) {
              return;
          }
      }
      return;
  }
  for (const key in data) {
      if (data.hasOwnProperty(key)) {
          if (cb(data[key], key) === false) {
              return;
          }
      }
  }
}

export function uriEncode (path: string, obj: any = {}, unEncodeURI?: boolean) {
    let result = []
    for (let name of Object.keys(obj)) {
        let value = obj[name];
        result.push(name + '=' + (unEncodeURI ? value : encodeURIComponent(value)))
    }
    if (result.length < 1) {
        return path;
    }
    return path + (path.indexOf('?') > 0 ? '&' : '?') + result.join('&');
}



