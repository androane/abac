import { ApolloClient, from } from '@apollo/client'
import { InMemoryCache } from '@apollo/client/cache'
import { onError } from '@apollo/client/link/error'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { setContext } from '@apollo/link-context'
import DebounceLink from 'apollo-link-debounce'
import { withScope, captureMessage } from '@sentry/browser'

import { GRAPHQL_ENDPOINT } from 'config/config-env'
import { clearAuthData, getAuthData } from 'auth/context/utils'
import { GENERIC_ERROR_MESSAGE } from 'utils/api-codes'

enum GraphQLErrorsEnum {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  FORBIDDEN = 'FORBIDDEN',
}

// const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT })
const httpLink = createUploadLink({ uri: GRAPHQL_ENDPOINT })

const logoutAfterware = onError(({ networkError }) => {
  if (
    networkError &&
    'statusCode' in networkError &&
    [401, 403].includes(networkError.statusCode)
  ) {
    clearAuthData()
  }
})

// eslint-disable-next-line no-unused-vars
const authLink = setContext((_, { headers }) => {
  // get the authentication token from storage if it exists
  const token = getAuthData().accessToken
  if (token) {
    // return the headers to the context so httpLink can read them
    const Authorization = `Bearer ${token}`
    return { headers: { ...headers, Authorization } }
  }
  return { headers }
})

const cache = new InMemoryCache({
  dataIdFromObject: (object: any) => {
    if (object.uuid) {
      return `${object.__typename}-${object.uuid}`
    }
    return undefined
  },
})

// await before instantiating ApolloClient, else queries might run before the cache is persisted
const initClient = async () => {
  const errorLink = onError(result => {
    withScope(scope => {
      const { networkError, graphQLErrors, operation } = result
      scope.setTransactionName(operation.operationName)
      scope.setContext('Apollo GraphQL Operation', {
        operationName: operation.operationName,
        variables: operation.variables,
        extensions: operation.extensions,
      })

      if (graphQLErrors) {
        graphQLErrors.forEach(error => {
          const errorCode = error?.extensions?.errorCode
          if (errorCode !== GraphQLErrorsEnum.UNAUTHORIZED_ACCESS) {
            captureMessage(error.message, {
              level: 'error',
              fingerprint: ['{{ default }}', '{{ transaction }}', 'ApolloGraphQLError'],
              contexts: {
                'Apollo GraphQL Error': {
                  locations: error.locations,
                  path: error.path,
                  message: error.message,
                  extensions: error.extensions,
                },
              },
            })
          }

          if (
            [GraphQLErrorsEnum.UNAUTHORIZED_ACCESS, GraphQLErrorsEnum.FORBIDDEN].includes(errorCode)
          ) {
            client.resetStore()
            clearAuthData()
            window.location.reload()
          }
        })
      }

      if (networkError) {
        captureMessage(networkError.message, {
          level: 'error',
          fingerprint: ['{{ default }}', '{{ transaction }}', 'ApolloNetworkError'],
          contexts: {
            'Apollo Network Error': {
              error: networkError,
              message: networkError.message,
              extensions: (networkError as any).extensions,
            },
          },
        })

        // Solution from https://github.com/apollographql/apollo-feature-requests/issues/153
        // to parse unhandled errors from the server that return strings instead of JSON.
        try {
          JSON.parse((networkError as { bodyText: string }).bodyText)
        } catch (e) {
          // If not replace parsing error message with real one
          networkError.message = GENERIC_ERROR_MESSAGE
        }
      }
    })
  })

  const client = new ApolloClient({
    link: from([errorLink, logoutAfterware, authLink, new DebounceLink(100), httpLink]),
    cache,
    resolvers: {},
    connectToDevTools: true,
  })
  return client
}

export default initClient
