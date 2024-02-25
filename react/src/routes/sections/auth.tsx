import { lazy } from 'react'

import { GuestGuard } from 'auth/guard'
import AuthLayout from 'layouts/auth'
import { Helmet } from 'react-helmet-async'

const LoginView = lazy(() => import('sections/auth/login'))

const auth = {
  path: 'login',
  element: (
    <GuestGuard>
      <AuthLayout>
        <Helmet>
          <title>ABAC Soft</title>
        </Helmet>
        <LoginView />
      </AuthLayout>
    </GuestGuard>
  ),
}

export const authRoutes = [
  {
    path: 'auth',
    children: [auth],
  },
]
