import React, { useState,ReactNode } from 'react'
import * as auth from '../auth-provider'
import { User } from '../screens/project-list/search-pannel'
import { http } from '../utils/http'
import { useMount } from '../utils'
import { useAsync } from '../utils/use-async'
import { FullPageError, FullPageLoading } from '../components/lib'
interface AuthForm {
    username: string,
    password: string,
}
const bootstrapUser=async()=>{
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
const AuthContext = React.createContext<{
    user:User|null,
    register:(form:AuthForm)=> Promise<void>
    login:(form:AuthForm)=> Promise<void>
    logout:()=> Promise<void>

}|undefined>(undefined)
AuthContext.displayName = 'AuthContext'



export const AuthProvider = ({ children }:{children:ReactNode}) => {
    const {data:user,error,isLoading,isIdle,iserror,run,setdata:setUser}=useAsync<User|null>()
    const [bootstrapped, setBootstrapped] = useState(false)
    const login = async (form: AuthForm) => { setUser(await auth.login(form)) }
    const register = async (form: AuthForm) => { setUser(await auth.register(form)) }
    const logout = async () => { await auth.logout(); setUser(null) }

    useMount(()=>{
        // 在 run 完成（成功或失败）后标记引导完成，避免一直显示加载中
        run(bootstrapUser()).finally(() => setBootstrapped(true))
    })
    if(isIdle||isLoading){
        return <FullPageLoading/>
    }
    if(iserror){
        return <FullPageError error={error}/>
    }
    return <AuthContext.Provider value={{ user, login, register, logout }}>{bootstrapped ? children : null}</AuthContext.Provider>
}

export const useAuth =() =>{
    const context=React.useContext(AuthContext)
    if(!context){
        throw new Error('不存在')

    }
    return context;
}