import Button from '@mui/material/Button'
import ResponseHandler from 'components/response-handler'
import { useUsersQuery } from 'generated/graphql'

const ClientsListPage = () => {
  const users = useUsersQuery()

  return (
    <ResponseHandler {...users}>
      {({ users }) => {
        return <Button variant="contained">{users?.length} Users</Button>
      }}
    </ResponseHandler>
  )
}

export default ClientsListPage
