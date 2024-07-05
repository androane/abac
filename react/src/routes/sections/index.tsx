import { Navigate, useRoutes } from 'react-router-dom'

import { getLandingPage } from 'routes/paths'
import { mainRoutes } from './main'
import { appRoutes } from './app'
import { authRoutes } from './auth'
import { clientAppRoutes } from './client-app'

const Router = () => {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={getLandingPage()} replace />,
    },
    ...authRoutes,
    ...clientAppRoutes,
    ...appRoutes,
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}

export default Router
