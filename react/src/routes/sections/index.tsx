import { Navigate, useRoutes } from 'react-router-dom'

import { PATH_AFTER_LOGIN } from 'config/config-global'
import { authRoutes } from './auth'
import { dashboardRoutes } from './dashboard'

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    ...authRoutes,
    ...dashboardRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}
