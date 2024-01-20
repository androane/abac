import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AuthGuard } from 'auth/guard'
import DashboardLayout from 'layouts/dashboard'

import { LoadingScreen } from 'components/loading-screen'

const ClientsListPage = lazy(() => import('pages/dashboard/clients/list'))

const clients = {
  path: 'clients',
  children: [
    { element: <ClientsListPage />, index: true },
    { path: 'list', element: <ClientsListPage /> },
  ],
}

export const dashboardRoutes = [
  {
    path: '',
    element: (
      <AuthGuard>
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
