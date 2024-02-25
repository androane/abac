import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import CompactLayout from 'layouts/compact'

import { SplashScreen } from 'components/loading-screen'

const View404 = lazy(() => import('sections/error/not-found-view'))

export const mainRoutes = [
  {
    element: (
      <CompactLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </CompactLayout>
    ),
    children: [{ path: '404', element: <View404 /> }],
  },
]
