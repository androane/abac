import { ApolloClient, createHttpLink, from } from '@apollo/client'
import { InMemoryCache } from '@apollo/client/cache'

import { GRAPHQL_ENDPOINT } from 'config/config-env'

const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT })

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
    link: from([httpLink]),
    cache,
    resolvers: {},
    connectToDevTools: true,
  })
}

export default initClient
