import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AuthGuard } from 'auth/guard'
import DashboardLayout from 'layouts/dashboard'

import { LoadingScreen } from 'components/loading-screen'
import { ROOTS } from 'routes/paths'

const ClientListView = lazy(() => import('sections/client/view/client-list-view'))
const ClientCreateView = lazy(() => import('sections/client/view/client-create-view'))
const ClientEditView = lazy(() => import('sections/client/view/client-edit-view'))
const SettingsServiceView = lazy(() => import('sections/settings/view/service-list-view'))

const clients = {
  path: ROOTS.CLIENT,
  children: [
    { element: <ClientListView />, index: true },
    { path: 'list', element: <ClientListView /> },
    { path: 'new', element: <ClientCreateView /> },
    { path: ':id/edit', element: <ClientEditView /> },
  ],
}

const settings = {
  path: ROOTS.SETTINGS,
  children: [
    { element: <SettingsServiceView />, index: true },
    {
      path: 'service',
      children: [
        { element: <SettingsServiceView />, index: true },
        { path: 'list', element: <SettingsServiceView /> },
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
