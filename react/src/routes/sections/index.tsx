import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
import HomePage from 'pages/dashboard/app'

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
          <HomePage />
      ),
    },
    // Auth routes
    ...authRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
