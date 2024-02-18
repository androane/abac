import { Helmet } from 'react-helmet-async'

import { ClientCreateView } from 'sections/client/view'

export default function ClientCreatePage() {
  return (
    <>
      <Helmet>
        <title>ABAC Soft</title>
      </Helmet>

      <ClientCreateView />
    </>
  )
}
