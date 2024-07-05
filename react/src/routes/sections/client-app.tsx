import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AuthGuard } from 'auth/guard'
import DashboardLayout from 'layouts/dashboard'

import { LoadingScreen } from 'components/loading-screen'
import { ROOTS } from 'routes/paths'
import { UserRoleEnum } from 'generated/graphql'

const ClientFilesView = lazy(() => import('sections-client/dashboard/client-files-view'))

const dashboard = {
  path: ROOTS.DOCUMENTS,
  children: [{ element: <ClientFilesView />, index: true }],
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
    children: [dashboard],
  },
]
