import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async'
import initClient from 'config/config-apollo-client'

import App from './app';

const renderApp = () => {
  const root = createRoot(document.getElementById('root')!)
  initClient().then(client => {
    root.render(
      <ApolloProvider client={client}>
        <HelmetProvider>
          <BrowserRouter>
            <Suspense>
              <App />
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>
      </ApolloProvider>
    )
  })
}

renderApp()
