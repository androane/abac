import Button from '@mui/material/Button'
import ResponseHandler from 'components/response-handler'
import { useUsersQuery } from 'generated/graphql'

const ClientCreateView = () => {
  const result = useUsersQuery()

  return (
    <ResponseHandler {...result}>
      {({ users }) => {
        return <Button variant="contained">{users?.length} Users</Button>
      }}
    </ResponseHandler>
  )
}

export default ClientCreateView
