import { User } from "./types/user"

const localStorageKey = '__auth_provider_token__'
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001'

export const get = () => window.localStorage.getItem(localStorageKey)

export const handleUseResponse = ({ user }: { user: User }) => {
    window.localStorage.setItem(localStorageKey, user.token || '')
    return user
}

export const login = async (data: { username: string, password: string }): Promise<User> => {
    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (response.ok) {
        const json = await response.json()
        return handleUseResponse(json)
    }

    const text = await response.text()
    throw new Error(text || '登录失败')
}

export const register = async (data: { username: string, password: string }): Promise<User> => {
    const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (response.ok) {
        const json = await response.json()
        return handleUseResponse(json)
    }

    const text = await response.text()
    throw new Error(text || '注册失败')
}

export const logout = async () => {
    window.localStorage.removeItem(localStorageKey)
}