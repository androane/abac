import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AuthGuard } from 'auth/guard'
import DashboardLayout from 'layouts/dashboard'

import { LoadingScreen } from 'components/loading-screen'
import { ROOTS } from 'routes/paths'

const ClientListView = lazy(() => import('sections/client/view/client-list-view'))
const ClientCreateView = lazy(() => import('sections/client/view/client-create-view'))
const ClientEditView = lazy(() => import('sections/client/view/client-edit-view'))
const SettingsActivityView = lazy(() => import('sections/settings/view/activity-list-view'))
const SettingsSolutionView = lazy(() => import('sections/settings/view/solution-list-view'))
const SettingsUsersView = lazy(() => import('sections/settings/view/user-list-view'))

const clients = {
  path: ROOTS.CLIENT,
  children: [
    { element: <ClientListView />, index: true },
    { path: 'list', element: <ClientListView /> },
    {
      path: 'new',
      element: <ClientCreateView />,
    },
    { path: ':uuid/edit', element: <ClientEditView /> },
  ],
}

const settings = {
  path: ROOTS.SETTINGS,
  children: [
    {
      path: 'activities',
      element: <SettingsActivityView />,
    },
    {
      path: 'solutions',
      element: <SettingsSolutionView />,
    },
    {
      path: 'users',
      element: <SettingsUsersView />,
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
