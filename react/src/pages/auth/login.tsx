import { Helmet } from 'react-helmet-async';

import Login from 'sections/auth/login';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>ABAC Soft</title>
      </Helmet>

      <Login />
    </>
  );
}
