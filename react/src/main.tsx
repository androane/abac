import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import initClient from 'config/configureClient'
import App from 'components/App'

const renderApp = () => {
  initClient().then(client => {
    render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>,
      document.getElementById('root'),
    )
  })
}

renderApp()
