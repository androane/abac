import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'

import { ApolloProvider } from '@apollo/client'
import initClient from 'utils/apollo'
import App from './app'

const renderApp = () => {
  const root = createRoot(document.getElementById('root')!)
  initClient().then(client => {
    root.render(
      <HelmetProvider>
        <BrowserRouter>
          <Suspense>
            <ApolloProvider client={client}>
              <App />
            </ApolloProvider>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>,
    )
  })
}

renderApp()
