import { AuthUserType } from 'auth/types'
import { AUTH_REMEMBER_ME_KEY, AUTH_STORAGE_KEY, AUTH_USER_KEY } from 'config/config-global'
import { forEach } from 'lodash'

export const setAuthData = (
  accessToken: string | null,
  user: AuthUserType,
  rememberMe: boolean,
) => {
  const storage = rememberMe ? localStorage : sessionStorage

  if (accessToken) {
    storage.setItem(AUTH_STORAGE_KEY, accessToken)
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    storage.setItem(AUTH_REMEMBER_ME_KEY, JSON.stringify(rememberMe))
  } else {
    clearAuthData()
  }
}

export const clearAuthData = () => {
  forEach([localStorage, sessionStorage], storage => {
    storage.removeItem(AUTH_STORAGE_KEY)
    storage.removeItem(AUTH_USER_KEY)
    storage.removeItem(AUTH_REMEMBER_ME_KEY)
  })
}

export const getAuthData = () => {
  const rememberMe = localStorage.getItem(AUTH_REMEMBER_ME_KEY)
  const storage = rememberMe ? localStorage : sessionStorage
  const accessToken = storage.getItem(AUTH_STORAGE_KEY)
  const user = storage.getItem(AUTH_USER_KEY)

  return {
    accessToken,
    user: user ? JSON.parse(user) : null,
  }
}
