import { AUTH_REMEMBER_ME_KEY, AUTH_STORAGE_KEY, AUTH_USER_ROLE_KEY } from 'config/config-global'
import { UserRoleEnum } from 'generated/graphql'
import { forEach } from 'lodash'

export const setAuthData = (
  accessToken: string | null,
  rememberMe: boolean,
  userRole: UserRoleEnum,
) => {
  const storage = rememberMe ? localStorage : sessionStorage

  if (accessToken) {
    storage.setItem(AUTH_STORAGE_KEY, accessToken)
    storage.setItem(AUTH_REMEMBER_ME_KEY, JSON.stringify(rememberMe))
    storage.setItem(AUTH_USER_ROLE_KEY, userRole)
  } else {
    clearAuthData()
  }
}

export const clearAuthData = () => {
  forEach([localStorage, sessionStorage], storage => {
    storage.removeItem(AUTH_STORAGE_KEY)
    storage.removeItem(AUTH_REMEMBER_ME_KEY)
    storage.removeItem(AUTH_USER_ROLE_KEY)
  })
}

export const getAuthData = () => {
  const rememberMe = localStorage.getItem(AUTH_REMEMBER_ME_KEY)
  const storage = rememberMe ? localStorage : sessionStorage
  const accessToken = storage.getItem(AUTH_STORAGE_KEY)
  const userRole = storage.getItem(AUTH_USER_ROLE_KEY)

  return {
    accessToken,
    userRole,
  }
}
