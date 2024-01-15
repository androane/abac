import Button from '@mui/material/Button'
import ResponseHandler from 'components/ResponseHandler'
import { useUsersQuery } from 'generated/graphql'

const App = () => {
  const users = useUsersQuery()

  return (
    <ResponseHandler {...users}>
      {({ users }) => {
        return <Button variant="contained">{users?.length} Users</Button>
      }}
    </ResponseHandler>
  )
}

export default App
