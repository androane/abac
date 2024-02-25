import { useCallback, useEffect, useMemo, useReducer } from 'react'

import { useLoginMutation, useLogoutMutation } from 'generated/graphql'
import { ActionMapType, AuthStateType, AuthUserType } from '../types'
import { AuthContext } from './auth-context'
import { getSession, setSession } from './utils'

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

  const initialize = useCallback(async () => {
    try {
      const { accessToken, user } = getSession()

      if (accessToken) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user,
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
  const login = useCallback(
    async (email: string, password: string) => {
      const response = await loginMutation({ variables: { email, password } })

      if (!response.data?.login) {
        return
      }
      const { token, user, error } = response.data.login

      if (!token) {
        throw new Error(error?.message)
      }

      setSession(token, user)

      dispatch({
        type: Types.LOGIN,
        payload: {
          user,
        },
      })
    },
    [loginMutation],
  )

  // LOGOUT
  const logout = useCallback(async () => {
    await logoutMutation()

    setSession(null, null)
    dispatch({
      type: Types.LOGOUT,
    })
  }, [logoutMutation])

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      authenticated: Boolean(state.user),
      unauthenticated: Boolean(state.user),
      login,
      logout,
    }),
    [login, logout, state],
  )

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}
