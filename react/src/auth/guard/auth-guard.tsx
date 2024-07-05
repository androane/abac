import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'routes/hooks'
import { paths } from 'routes/paths'

import { SplashScreen } from 'components/loading-screen'

import { UserRoleEnum } from 'generated/graphql'
import { useAuthContext } from '../hooks'

type Props = {
  role?: UserRoleEnum
  children: React.ReactNode
}

const AuthGuard: React.FC<Props> = ({ role, children }) => {
  const { loading } = useAuthContext()

  return <>{loading ? <SplashScreen /> : <Container role={role}>{children}</Container>}</>
}

const Container: React.FC<Props> = ({ role, children }) => {
  const router = useRouter()

  const { authenticated, user, logout } = useAuthContext()

  const [checked, setChecked] = useState(false)

  const check = useCallback(() => {
    if (authenticated && role && user?.role !== role) {
      console.log('AuthGuard role value is ', role)
      console.log('AuthGuard user value is ', user)
      logout()
      router.replace(paths.auth.login)
    }
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString()

      const href = `${paths.auth.login}?${searchParams}`
      router.replace(href)
    } else {
      setChecked(true)
    }
  }, [authenticated, router, role, logout, user])

  useEffect(() => {
    check()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!checked) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard
