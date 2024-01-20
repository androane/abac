import { AUTH_STORAGE_KEY } from "config/config-global"

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, accessToken)
  } else {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  }
}
