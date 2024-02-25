import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'routes/hooks'
import { paths } from 'routes/paths'

import { SplashScreen } from 'components/loading-screen'

import { useAuthContext } from '../hooks'

type Props = {
  children: React.ReactNode
}

const AuthGuard: React.FC<Props> = ({ children }) => {
  const { loading } = useAuthContext()

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>
}

function Container({ children }: Props) {
  const router = useRouter()

  const { authenticated } = useAuthContext()

  const [checked, setChecked] = useState(false)

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString()

      const loginPath = paths.auth.login

      const href = `${loginPath}?${searchParams}`

      router.replace(href)
    } else {
      setChecked(true)
    }
  }, [authenticated, router])

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
