import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useApolloClient } from '@apollo/client'

import { UserPermissionsEnum, useLoginMutation, useLogoutMutation } from 'generated/graphql'
import { ActionMapType, AuthStateType, AuthUserType } from '../types'
import { AuthContext } from './auth-context'
import { clearAuthData, getAuthData, setAuthData } from './utils'

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

type Props = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loginMutation] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()
  const client = useApolloClient()

  const initialize = useCallback(async () => {
    try {
      const { accessToken, user } = getAuthData()

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
    async (email: string, password: string, rememberMe: boolean) => {
      const response = await loginMutation({ variables: { email, password } })

      if (!response.data?.login) {
        return
      }
      const { token, user, error } = response.data.login

      if (!token) {
        throw new Error(error?.message)
      }

      setAuthData(token, user, rememberMe)

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

    clearAuthData()
    client.resetStore()
    dispatch({
      type: Types.LOGOUT,
    })
  }, [logoutMutation, client])

  const hasPermission = useCallback(
    (permission: UserPermissionsEnum) => {
      const permissions = state.user?.permissions || []
      return (
        permissions.includes(permission) ||
        permissions.includes(UserPermissionsEnum.HAS_ORGANIZATION_ADMIN)
      )
    },
    [state.user],
  )

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      authenticated: Boolean(state.user),
      unauthenticated: Boolean(state.user),
      login,
      logout,
      hasPermission,
    }),
    [login, logout, state, hasPermission],
  )

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}
