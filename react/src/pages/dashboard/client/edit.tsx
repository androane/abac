import { Helmet } from 'react-helmet-async'

import { useParams } from 'routes/hooks'

import { ClientEditView } from 'sections/client/view'

export default function ClientEditPage() {
  const params = useParams()

  const { id } = params

  return (
    <>
      <Helmet>
        <title> ABAC Soft</title>
      </Helmet>

      <ClientEditView id={`${id}`} />
    </>
  )
}
