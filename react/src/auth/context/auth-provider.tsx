import { useCallback, useEffect, useMemo, useReducer } from 'react'

import { useCurrentUserQuery, useLoginMutation, useLogoutMutation } from 'generated/graphql'
import { ActionMapType, AuthStateType, AuthUserType } from '../types'
import { AuthContext } from './auth-context'
import { isValidToken, setSession } from './utils'

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType
  }
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

export const STORAGE_KEY = 'abacAccessToken'

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
      const accessToken = sessionStorage.getItem(STORAGE_KEY)

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken)

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...currentUserResponse.data?.currentUser,
              accessToken,
              loading: currentUserResponse.loading,
            },
          },
        })
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
  }, [])

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
  }, [])

  // LOGOUT
  const logout = useCallback(async () => {
    await logoutMutation()

    setSession(null)
    dispatch({
      type: Types.LOGOUT,
    })
  }, [])

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated'

  const status = state.loading ? 'loading' : checkAuthenticated

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      logout,
    }),
    [login, logout, state.user, status],
  )

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}
