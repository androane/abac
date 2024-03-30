import { Navigate, useRoutes } from 'react-router-dom'

import { PATH_AFTER_LOGIN } from 'config/config-global'
import { mainRoutes } from 'routes/sections/main'
import { authRoutes } from './auth'
import { appRoutes } from './app'

const Router = () => {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    ...authRoutes,
    ...appRoutes,
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}

export default Router
