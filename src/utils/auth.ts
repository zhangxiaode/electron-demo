// @ts-ignore
import Cookies from 'js-cookie'

export function getToken() {
    return Cookies.get('Authorization')
}

export function setToken(token: any) {
    return Cookies.set('Authorization', token)
}

export function removeToken() {
    localStorage.removeItem("Authorization")
    return Cookies.remove('Authorization')
}