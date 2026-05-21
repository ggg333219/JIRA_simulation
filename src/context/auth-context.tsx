import React, { useState,ReactNode, useCallback } from 'react'
import * as auth from '../auth-provider'
import { User } from '../screens/project-list/search-pannel'
import { http } from '../utils/http'
import { useMount } from '../utils'
import { useAsync } from '../utils/use-async'
import { FullPageError, FullPageLoading } from '../components/lib'
import * as authStore from '../store/auth.slice'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../store'

export interface AuthForm {
    username: string,
    password: string,
}
export const bootstrapUser=async()=>{
    const token = auth.get()
    if (!token) return null

    try {
        const data = await http('me', { token })
        return data.user
    } catch (e) {
        return null
    }
}
// keep context loosely typed to avoid strict TS coupling here



export const AuthProvider = ({ children }:{children:ReactNode}) => {
    const {data:user,error,isLoading,isIdle,iserror,run,setdata:setUser}=useAsync<User|null>()
   
    const dispatch :(...args:unknown[])=>Promise<User>= useDispatch<AppDispatch>()

    useMount(()=>{
        // 在 run 完成（成功或失败）后标记引导完成，避免一直显示加载中
        run(dispatch(authStore.bootstrap()))
    })
    if(isIdle||isLoading){
        return <FullPageLoading/>
    }
    if(iserror){
        return <FullPageError error={error}/>
    }
    return children
}

export const useAuth =() =>{
    const dispatch :(...args:unknown[])=>Promise<User>= useDispatch<AppDispatch>()
    const user=useSelector(authStore.selectorUser)
    const login=useCallback((form:AuthForm)=>dispatch(authStore.login(form)),[dispatch])
    const register=useCallback((form:AuthForm)=>dispatch(authStore.register(form)),[dispatch])
    const logout=useCallback(()=>dispatch(authStore.logout()),[dispatch])
    
    

    return {
        user,
        login,
        register,
        logout
    };
}