import qs from 'qs'
import * as auth from '../auth-provider'
import { useAuth } from '../context/auth-context';
import { useCallback } from 'react';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface Config extends RequestInit{
    token?:string
    data?:object
}

export const http= async (endpoint:string,{data,token,headers,...customConfig}:Config={})=>{
    // 与 jira-dev-tool 的失败率开关保持一致：即使不启用 loadServer，也可模拟请求失败
    if (process.env.NODE_ENV === 'development') {
        const failureRate = Number(window.localStorage.getItem('__jira_failure_rate__') || 0)
        if (failureRate > 0 && Math.random() < failureRate) {
            return Promise.reject(new Error('模拟请求失败（来自 __jira_failure_rate__）'))
        }
    }

    const config={
        method:'GET',
        headers:{
            Authorization:token?`Bearer ${token}`:'',
            'Content-Type':data?'application/json':'',
        },
        ...customConfig
    }
    if(config.method.toUpperCase()=='GET'){
        const query = qs.stringify(data)
        if (query) {
            endpoint += `?${query}`
        }
    }else{
        config.body=JSON.stringify(data||{})
    }

    return window.fetch(`${apiUrl}/${endpoint}`,config).then(async (response) => {
        if (response.status === 401) {
            await auth.logout();
            window.location.reload();
            return Promise.reject(new Error('重新登录'));
        }

        // 解析返回体，兼容空体或非 JSON
        let parsed: any = null;
        const text = await response.text();
        if (text) {
            try {
                parsed = JSON.parse(text);
            } catch (e) {
                parsed = text;
            }
        }

        if (response.ok) {
            return parsed;
        }

        const message = (parsed && (parsed.message || parsed.error)) || response.statusText || '请求出错';
        return Promise.reject(new Error(typeof message === 'string' ? message : JSON.stringify(message)));
    });
}
export const useHttp = () => {
    const { user } = useAuth();
    return useCallback(([endpoint, config]: [string, Config]) => http(endpoint, { ...config, token: user?.token }), [user?.token]);
};

// 联合类型
let myFavorateNumber: string|number
myFavorateNumber='seven'
myFavorateNumber=7
let jackFavoriteNumber : string | number

// 类型别名
type FavorateNumber = string | number
let roseFavorateNumber:FavorateNumber='6'

type Person ={
    name:string,
    age:number,
}
const xm:Partial<Person>={}
const a:Omit<Person,'name'> ={age:8}