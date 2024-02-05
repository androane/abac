import { UserFragment } from 'generated/graphql'

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export type AuthUserType = null | undefined | UserFragment

export type AuthStateType = {
  status?: string
  loading: boolean
  user: AuthUserType
}

type CanRemove = {
  login?: (email: string, password: string) => Promise<void>
  forgotPassword?: (email: string) => Promise<void>
  newPassword?: (email: string, code: string, password: string) => Promise<void>
  updatePassword?: (password: string) => Promise<void>
}

export type AuthContextType = CanRemove & {
  user: AuthUserType
  loading: boolean
  authenticated: boolean
  unauthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
