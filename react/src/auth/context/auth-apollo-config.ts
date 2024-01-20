import { ApolloClient, createHttpLink, from } from '@apollo/client'
import { InMemoryCache } from '@apollo/client/cache'
import { setContext } from '@apollo/link-context'
import DebounceLink from 'apollo-link-debounce'
import { STORAGE_KEY } from 'auth/context/auth-provider'

import { GRAPHQL_ENDPOINT } from 'config/config-env'

const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT })

// eslint-disable-next-line no-unused-vars
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = sessionStorage.getItem(STORAGE_KEY)
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
  return new ApolloClient({
    link: from([authLink, new DebounceLink(100), httpLink]),
    cache,
    resolvers: {},
    connectToDevTools: true,
  })
}

export default initClient
