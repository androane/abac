import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AuthGuard } from 'auth/guard'
import DashboardLayout from 'layouts/dashboard'

import { LoadingScreen } from 'components/loading-screen'
import { ROOTS } from 'routes/paths'
import { UserRoleEnum } from 'generated/graphql'

const ClientNavigation = lazy(() => import('sections-client/client-navigation'))
const ClientRedirect = lazy(() => import('sections-client/client-redirect'))

const clients = {
  path: '',
  children: [
    { path: '', element: <ClientRedirect /> },
    { path: ':uuid/:tab', element: <ClientNavigation /> },
  ],
}

export const clientAppRoutes = [
  {
    path: ROOTS.CLIENT_APP,
    element: (
      <AuthGuard role={UserRoleEnum.CLIENT}>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [clients],
  },
]
