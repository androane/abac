import { useCallback, useEffect } from 'react'

import { useRouter, useSearchParams } from 'routes/hooks'
import { getLandingPage } from 'routes/paths'

import { SplashScreen } from 'components/loading-screen'

import { useAuthContext } from '../hooks'

type Props = {
  children: React.ReactNode
}

const GuestGuard: React.FC<Props> = ({ children }) => {
  const { loading } = useAuthContext()

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>
}

const Container: React.FC<Props> = ({ children }) => {
  const router = useRouter()

  const searchParams = useSearchParams()

  const { authenticated } = useAuthContext()

  const check = useCallback(() => {
    if (authenticated) {
      const returnTo = searchParams.get('returnTo')

      if (returnTo) {
        router.replace(returnTo)
      } else {
        router.replace(getLandingPage())
      }
    }
  }, [authenticated, searchParams, router])

  useEffect(() => {
    check()
  }, [check])

  return <>{children}</>
}

export default GuestGuard
