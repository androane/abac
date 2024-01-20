import { lazy } from 'react';

import { GuestGuard } from 'auth/guard';
import AuthLayout from 'layouts/auth'


const LoginPage = lazy(() => import('pages/auth/login'));

const auth = {
  path: 'login',
  element: (
    <GuestGuard>
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    </GuestGuard>
  ),
}

export const authRoutes = [
  {
    path: 'auth',
    children: [auth],
  },
];
