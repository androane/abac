import { Helmet } from 'react-helmet-async'

import { ServiceListView } from 'sections/settings/view'

export default function ServiceListPage() {
  return (
    <>
      <Helmet>
        <title>ABAC Soft</title>
      </Helmet>

      <ServiceListView />
    </>
  )
}
