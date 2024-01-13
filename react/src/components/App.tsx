import Button from '@mui/material/Button'
import ResponseHandler from 'components/ResponseHandler'
import { useUsersQuery } from 'generated/graphql'

const App = () => {
  const users = useUsersQuery()

  return (
    <ResponseHandler {...users}>
      {() => {
        return <Button variant="contained">Hello world</Button>
      }}
    </ResponseHandler>
  )
}

export default App
