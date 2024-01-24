import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AuthGuard } from 'auth/guard'
import DashboardLayout from 'layouts/dashboard'

import { LoadingScreen } from 'components/loading-screen'

const ClientsListPage = lazy(() => import('pages/dashboard/client/list'))
const ClientCreatePage = lazy(() => import('pages/dashboard/client/new'))
const ClientEditPage = lazy(() => import('pages/dashboard/client/edit'))

const clients = {
  path: 'client',
  children: [
    { element: <ClientsListPage />, index: true },
    { path: 'list', element: <ClientsListPage /> },
    { path: 'new', element: <ClientCreatePage /> },
    { path: ':id/edit', element: <ClientEditPage /> },
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
