import { useCallback, useEffect, useMemo, useReducer } from 'react'

import { AUTH_STORAGE_KEY } from 'config/config-global'
import { useCurrentUserQuery, useLoginMutation, useLogoutMutation } from 'generated/graphql'
import { ActionMapType, AuthStateType, AuthUserType } from '../types'
import { AuthContext } from './auth-context'
import { setSession } from './utils'

enum StatusEnum {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FETCHING_CURRENT_USER = 'FETCHING_CURRENT_USER',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType
  }
  [Types.FETCHING_CURRENT_USER]: undefined
  [Types.LOGIN]: {
    user: AuthUserType
  }
  [Types.LOGOUT]: undefined
}

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>]

const initialState: AuthStateType = {
  user: null,
  loading: true,
}

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    }
  }
  if (action.type === Types.FETCHING_CURRENT_USER) {
    return {
      loading: true,
      user: null,
    }
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    }
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    }
  }
  return state
}

type Props = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loginMutation] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()
  const currentUserResponse = useCurrentUserQuery()

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(AUTH_STORAGE_KEY)

      if (accessToken) {
        if (currentUserResponse.loading) {
          dispatch({
            type: Types.FETCHING_CURRENT_USER,
          })
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: {
                ...currentUserResponse.data?.currentUser,
                accessToken,
              },
            },
          })
        }
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        })
      }
    } catch (error) {
      console.error(error)
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      })
    }
  }, [currentUserResponse])

  useEffect(() => {
    initialize()
  }, [initialize])

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const res = await loginMutation({ variables: { email, password } })

    if (!res.data?.login) {
      return
    }
    const { token, user, error } = res.data.login

    if (!token) {
      throw new Error(error?.message)
    }

    setSession(token)

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          ...user,
          token,
        },
      },
    })
  }, [loginMutation])

  // LOGOUT
  const logout = useCallback(async () => {
    await logoutMutation()

    setSession(null)
    dispatch({
      type: Types.LOGOUT,
    })
  }, [logoutMutation])

  const checkAuthenticated = state.user ? StatusEnum.AUTHENTICATED : StatusEnum.UNAUTHENTICATED

  const status = state.loading ? StatusEnum.LOADING : checkAuthenticated

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: status === StatusEnum.LOADING,
      authenticated: status === StatusEnum.AUTHENTICATED,
      unauthenticated: status === StatusEnum.UNAUTHENTICATED,
      //
      login,
      logout,
    }),
    [login, logout, state.user, status],
  )

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}
