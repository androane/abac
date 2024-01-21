import { Navigate, useRoutes } from 'react-router-dom'

import { PATH_AFTER_LOGIN } from 'config/config-global'
import { usePathname } from 'routes/hooks'
import { mainRoutes } from 'routes/sections/main'
import { authRoutes } from './auth'
import { dashboardRoutes } from './dashboard'

export default function Router() {
  const pathname = usePathname()
  console.log(pathname)

  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    ...authRoutes,
    ...dashboardRoutes,
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}
