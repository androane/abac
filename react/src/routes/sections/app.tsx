import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AuthGuard } from 'auth/guard'
import DashboardLayout from 'layouts/dashboard'

import { LoadingScreen } from 'components/loading-screen'
import { ROOTS } from 'routes/paths'

const ClientListPage = lazy(() => import('pages/client/list'))
const ClientCreatePage = lazy(() => import('pages/client/new'))
const ClientEditPage = lazy(() => import('pages/client/edit'))
const SettingsServicePage = lazy(() => import('pages/settings/service/list'))

const clients = {
  path: ROOTS.CLIENT,
  children: [
    { element: <ClientListPage />, index: true },
    { path: 'list', element: <ClientListPage /> },
    { path: 'new', element: <ClientCreatePage /> },
    { path: ':id/edit', element: <ClientEditPage /> },
  ],
}

const settings = {
  path: ROOTS.SETTINGS,
  children: [
    { element: <SettingsServicePage />, index: true },
    {
      path: 'service',
      children: [
        { element: <SettingsServicePage />, index: true },
        { path: 'list', element: <SettingsServicePage /> },
      ],
    },
  ],
}

export const appRoutes = [
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
    children: [clients, settings],
  },
]
