import { STORAGE_KEY } from 'auth/context/auth-provider'

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    sessionStorage.setItem(STORAGE_KEY, accessToken)
  } else {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}
