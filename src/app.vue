<script lang="ts">
import {
    TOKEN_KEY
} from "./utils/types";
import {
    IUser, ILogin, IRegister, IDataOne
} from "./api/model";
import { getProfile, login, logout, authLogin, register, sendFindEmail } from "./api/user";
import { WxPage, WxApp, WxAppJson } from "typings/wx/lib.vue";

interface IAppData {
    token: string | null,
    user: IUser | null,
}

export interface IMyApp {
    globalData: IAppData,
    getUser(): Promise<IUser|null>,
    setUser(user: IUser|null): void,
    setToken(token?: string): void,
    loginUser(params: ILogin): Promise<IUser| void>,
    authloginUser(params: any): Promise<IUser| void>;
    registerUser(params: IRegister): Promise<IUser| void>;
    sendFindEmail(email: string): Promise<IDataOne<boolean>>;
    logoutUser(): Promise<void>;
    setWatcher(page: WxPage<any>): void,
    observe(obj: any, key: string, watchFun: (this: WxPage<any>, newVal: any, oldVal: any) => void, deep: boolean, page: WxPage<any>): void,
}

@WxAppJson({
    pages: [
        'pages/index/index',
        'pages/member/index',
        'pages/member/profile',
        'pages/member/login',
        'pages/account/cancel',
        'pages/account/driver',
        'pages/member/password',
        'pages/member/edit',
        'pages/article/index',
        'pages/article/category',
        'pages/article/detail',
        'pages/task/index',
        'pages/task/edit',
        'pages/task/detail',
        'pages/message/index',
        'pages/checkin/index',
        'pages/feedback/index',
        'pages/account/connect',
        'pages/account/bind',
        'pages/authorize/index',
        'pages/setting/index',
        'pages/record/index',
    ],
    window: {
        backgroundTextStyle: 'light',
        backgroundColor: '#f4f4f4',
        navigationBarBackgroundColor: '#05a6b1',
        navigationBarTitleText: 'ZoDream Timer',
        navigationBarTextStyle: 'white'
    },
    tabBar: {
        backgroundColor: '#fff',
        borderStyle: 'black',
        selectedColor: '#b4282d',
        color: '#666',
        list: [{
                pagePath: 'pages/index/index',
                iconPath: 'images/icon/home.png',
                selectedIconPath: 'images/icon/home_red.png',
                text: '首页'
            },
            {
                pagePath: 'pages/record/index',
                iconPath: 'images/icon/time.png',
                selectedIconPath: 'images/icon/time_red.png',
                text: '时间薄'
            },
            {
                pagePath: 'pages/member/index',
                iconPath: 'images/icon/user.png',
                selectedIconPath: 'images/icon/user_red.png',
                text: '我的'
            }
        ]
    }
})
export class Application extends WxApp<IAppData> implements IMyApp {

    public globalData: IAppData = {
        token: null,
        user: null,
    }

    public onLaunch() {
        // 展示本地存储能力
        this.globalData.token = wx.getStorageSync(TOKEN_KEY);
    }
    public getUser() {
        return new Promise<IUser|null>((resolve, reject) => {
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
    }

    public setUser(user: IUser| null) {
        if (user && user.token && user.token.length > 0 && user.id && user.id > 0) {
            this.setToken(user.token);
        }
        this.globalData.user = user;
    }

    public setToken(token?: string) {
        this.globalData.token = token && token.length > 0 ? token : null;
        if (!this.globalData.token) {
            wx.removeStorageSync(TOKEN_KEY);
            this.globalData.user = null;
            return;
        }
        wx.setStorageSync(TOKEN_KEY, token);
    }
    public loginUser(params: ILogin) {
        return login(params).then((res: IUser) => {
            this.setUser(res);
            return res;
        });
    }
    public authloginUser(params: any) {
        return authLogin(params).then((res: IUser) => {
            this.setUser(res);
            return res;
        });
    }
    public registerUser(params: IRegister) {
        return register(params).then((res: IUser) => {
            this.setUser(res);
            return res;
        });
    }

    public sendFindEmail(email: string) {
        return sendFindEmail(email);
    }

    public logoutUser() {
        return new Promise<void>((resolve, reject) => {
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
    }
    /**
     * 设置监听器
     */
    public setWatcher(page: any) {
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
    }
    /**
     * 监听属性 并执行监听函数
     */
    public observe(obj: any, key: string, watchFun: (newVal: any, oldVal: any) => void, deep: boolean, page: WxPage<any>) {
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
    }
}
</script>
<style lang="scss">
$debc: #e4e4e4;
$title: 16px;
$subtitle: 13px;
$smsub: 12px;
$margin: 10px;
$gray: #81838e;
$border: #e1e1e1;
$padding: 10px;
$fontfamily: 'Microsoft Yahei';
$headerBg: #05a6b1;
$white: #fff;
$hr: 1px solid #ccc;
$bg: #f4f4f4;
$red: #d22222;
$lineHeight: 2.5rem;

@import 'icon';

@mixin lineItem() {
    .line-item {
        position: relative;
        line-height: 1.875rem;

        >.fa {
            position: absolute;
            right: 0.3125rem;
            top: 0;
        }

        .label {
            float: right;
            margin-right: 1.25rem;
        }
    }
}

@mixin menuA() {
    display: block;
    padding: 0.625rem;
    background: $white;
    margin-top: 0.125rem;

    .fa:nth-child(2),
    .fa-chevron-right {
        float: right;
        margin-right: 0.625rem;
        line-height: 20px;
    }
}



.hide {
    display: none;
}

.btn {
    padding: 0 30px;
    background: #b4282d;
    border: none;
    display: inline-block;
    text-decoration: none;
    line-height: 30px;
    margin: 0 8px;
    vertical-align: middle;
}




.menu-list {
    background: $white;
    padding: 0 0.625rem;

    .item {
        @include menuA();
        margin-top: 0;
        padding: 0.625rem 0;

        &:not(:last-child),
        &.line {
            border-bottom: $hr;
        }
    }
}


.login-type-box,
.login-box,
.register-box {
    text-align: center;
    padding: 10px;

    .logo {
        padding: 30px 0;
    }

    .btn,
    button {
        display: block;
        margin: 0 0 10px;
        line-height: 40px;
        height: 40px;
        color: $white;
        border: 1px solid #b4282d;
        background-color: #b4282d;

        &.btn-none {
            background-color: $white;
            color: #b4282d;
        }
    }

    button {
        width: 100%;
    }

    

    .input-group {
        text-align: left;
    }

    .unlogin {
        line-height: 40px;
        text-align: left;

        text {
            &:last-child {
                float: right;
            }
        }
    }

    .input-group {
        .checkbox {
            label::before {
                top: 3px;
            }
        }
    }
}

.login-oauth-box {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 40px;
    text-align: center;
    font-size: 20px;

    navigator {
        display: inline-block;
        padding: 0 10px;

        &:not(:last-child) {
            border-right: $hr;
        }
    }
    button {
        display: inline-block;
        background-color: transparent;
        border: 0;
        width: 3rem;
        line-height: 3rem;
        height: 3rem;
        color: #333;
        border: none;
        margin:0;
        padding: 0;
        &:hover {
            background-color: transparent;
        }
    }
    .fa {
        font-size: 2rem;
    }
}

.input-box,
.code-input {
    border-bottom: $hr;
    input {
        height: 40px;
        border: 0;
        background: transparent;
        width: 100%;
        outline: none;
        text-align: left;
    }
}

.code-input {
    display: grid;
    grid-template-columns: 1fr 80px;

    navigator {
        border: 1px solid;
        font-size: 12px;
        line-height: 40px;
    }
}

.profile-box,
.account-box {
    margin-bottom: 2rem;
    background-color: $white;
    padding: 0 10px;
    @include lineItem();

    .avatar-item {
        line-height: 5rem;

        .fa {
            top: 0;
        }

        .avatar {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
            padding: 5px;
            box-sizing: border-box;
            image {
                width: 70px;
                height: 70px;
            }
        }
    }

    .line-item {
        border-top: $hr;
    }
}

.btn {
    &.del-btn {
        margin: 0.875rem;
        box-sizing: border-box;
        padding: 0.375rem;
        display: block;
        text-align: center;
        background-color: $red;
        color: $white;
    }
    &.primary-btn {
        margin: 0.875rem;
        box-sizing: border-box;
        padding: 0.375rem;
        display: block;
        text-align: center;
        background-color: $headerBg;
        color: $white;
    }
}

.form-inline {
    .input-group {
        display: block;
        border-bottom: 1px solid #777;
        min-height: $lineHeight;

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="password"],
        input[type="url"],
        input[type="number"],
        select,
        textarea {
            border: none;
            background: transparent;
            height: $lineHeight;
            box-sizing: border-box;

            &.height-auto {
                height: auto;
            }
        }
        input {
            width: 100%;
        }

        span {
            line-height: 1.875rem;
        }

        textarea {
            width: 100%;
            height: 5rem;
        }
    }

    .input-radio {
        line-height: 1.875rem;
        position: relative;

        .fa {
            position: absolute;
            right: 0.625rem;
            font-size: 1.5625rem;
            top: 0.125rem;
        }
    }
    .btn {
        line-height: $lineHeight;
        margin-top: 8px;
    }
}

.check-box {
    font-size:1rem;
    &::before {
        content: "\e8dc";
    }

    &.active {
        &::before {
            content: "\e8d9";
        }
    }
}

.register-box {
    button {
        margin-top: 10px;
    }
}

.tab-header {
    display: flex;
    justify-content: space-around;
    flex-flow: row nowrap;
    line-height: 40px;
    background-color: $headerBg;
    color: $white;
    .tab-item {
        &.active {
            border-bottom: 2px solid #b4282d;
            color: #b4282d;
        }
    }
}

.fixed-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: aquamarine;
    color: #fff;
    line-height: 40px;
    text-align: center;
    .fa {
        font-size: 30px;
    }
}

.large-header {
    background-color: $headerBg;
    color: $white;
    height: 100px;
    position: relative;
    margin-bottom: 20px;
    .title {
        padding: 40px 0 0 20px;
        font-size: 30px;
    }
    .fa {
        position: absolute;
        bottom: -20px;
        font-size: 30px;
        display: block;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        right: 20px;
        border-radius: 50%;
        background-color: #1d8686;
    }
}

.empty-box {
    line-height: 40px;
    text-align: center;
    font-size: 30px;
    color: #999;
    margin-top: 30vh;
}

.no-more-tip {
    text-align: center;
    color: #ccc;
    line-height: 60px;
}
</style>