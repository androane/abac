import { AuthUserType } from 'auth/types'
import { AUTH_STORAGE_KEY, AUTH_USER_KEY } from 'config/config-global'

export const setSession = (accessToken: string | null, user: AuthUserType) => {
  if (accessToken) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, accessToken)
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  } else {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    sessionStorage.removeItem(AUTH_USER_KEY)
  }
}

export const getSession = () => {
  const accessToken = sessionStorage.getItem(AUTH_STORAGE_KEY)
  const user = sessionStorage.getItem(AUTH_USER_KEY)

  return {
    accessToken,
    user: user ? JSON.parse(user) : null,
  }
}
