import {
    TOKEN_KEY
} from "./utils/types";
import {
    IUser, ILogin, IRegister, IData
} from "./api/model";
import { getProfile, login, logout, authLogin, register, sendFindEmail } from "./api/user";
import { WxPage } from "typings/wx/lib.wx.page";

//app.ts
export interface IMyApp {
    globalData: {
        token: string | null,
        user: IUser | null,
    },
    getUser(): Promise<IUser|null>,
    setToken(token?: string): void,
    loginUser(params: ILogin): Promise<IUser| void>,
    authloginUser(params: any): Promise<IUser| void>;
    registerUser(params: IRegister): Promise<IUser| void>;
    sendFindEmail(email: string): Promise<IData<boolean>>;
    logoutUser(): Promise<void>;
    setWatcher(page: WxPage<any>): void,
    observe(obj: any, key: string, watchFun: (this: WxPage<any>, newVal: any, oldVal: any) => void, deep: boolean, page: WxPage<any>): void,
}

App<IMyApp>({
    onLaunch() {
        // 展示本地存储能力
        this.globalData.token = wx.getStorageSync(TOKEN_KEY);
    },
    getUser() {
        return new Promise((resolve, reject) => {
            if (this.globalData.user) {
                resolve(this.globalData.user);
                return;
            }
            const token = wx.getStorageSync<string>(TOKEN_KEY);
            if (!token) {
                resolve(null);
                return;
            }
            getProfile().then((res: IUser) => {
                this.globalData.user = res;
                resolve(res);
            }).catch(reject);
        });
    },
    setToken(token?: string) {
        this.globalData.token = token ? token : null;
        if (!token) {
            wx.removeStorageSync(TOKEN_KEY);
            this.globalData.user = null;
            return;
        }
        wx.setStorageSync(TOKEN_KEY, token);
    },
    loginUser(params: ILogin) {
        return login(params).then((res: IUser) => {
            this.setToken(res.token);
            this.globalData.user = res;
        });
    },
    authloginUser(params: any) {
        return authLogin(params).then((res: IUser) => {
            this.setToken(res.token);
            return this.globalData.user = res;
        });
    },
    registerUser(params: IRegister) {
        return register(params).then((res: IUser) => {
            this.setToken(res.token);
            this.globalData.user = res;
        });
    },
    sendFindEmail(email: string) {
        return sendFindEmail(email);
    },
    logoutUser() {
        return new Promise((resolve, reject) => {
            const token = wx.getStorageSync<string>(TOKEN_KEY);
            if (!token) {
                resolve();
                return;
            }
            logout().then(() => {
                this.setToken();
                resolve();
            }).catch(reject);
        });
    },
    /**
     * 设置监听器
     */
    setWatcher(page: any) {
        let data = page.data;
        let watch = page.watch;
        Object.keys(watch).forEach(v => {
            let key = v.split('.'); // 将watch中的属性以'.'切分成数组
            let nowData = data; // 将data赋值给nowData
            for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
                nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
            }
            let lastKey = key[key.length - 1];
            // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
            let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
            let deep = watch[v].deep; // 若未设置deep,则为undefine
            this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
        })
    },
    /**
     * 监听属性 并执行监听函数
     */
    observe(obj: any, key: string, watchFun: (newVal: any, oldVal: any) => void, deep: boolean, page: WxPage<any>) {
        let val = obj[key];
        // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
        if (deep && val != null && typeof val === 'object') { 
            Object.keys(val).forEach(childKey=>{ // 遍历val对象下的每一个key
                this.observe(val,childKey,watchFun,deep,page); // 递归调用监听函数
            })
        }
        let that = this;
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            set: function(value) {
                // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
                watchFun.call(page,value,val); // value是新值，val是旧值
                val = value;
                if(deep){ // 若是深度监听,重新监听该对象，以便监听其属性。
                    that.observe(obj, key, watchFun, deep, page); 
                }
            },
            get: function() {
                return val;
            }     
        })
    },
    globalData: {
        token: null,
        user: null,
    }
})