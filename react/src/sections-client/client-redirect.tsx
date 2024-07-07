import { LoadingScreen } from 'components/loading-screen'
import ResponseHandler from 'components/response-handler'
import { useOrganizationClientsQuery } from 'generated/graphql'
import { Navigate } from 'react-router-dom'
import { paths } from 'routes/paths'
import { defaultTab } from 'sections-client/constants'

const ClientRedirect = () => {
  const result = useOrganizationClientsQuery()
  const { loading, data } = result
  if (!data || loading) {
    return <LoadingScreen />
  }

  return (
    <ResponseHandler {...result}>
      {({ organization }) => {
        return (
          <Navigate to={paths.clientApp.detail(organization.clients[0].uuid, defaultTab)} replace />
        )
      }}
    </ResponseHandler>
  )
}

export default ClientRedirect
