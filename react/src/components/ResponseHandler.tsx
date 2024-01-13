import { ReactElement } from 'react'

import { ApolloError } from '@apollo/client'
import get from 'lodash/get'

type ChildrenProps<QueryData, T> = {
  children: (
    data: NonNullable<QueryData>,
    restQueryResult: Partial<Props<QueryData, T>>,
  ) => ReactElement
}

type Props<QueryData, T> = {
  hideLoader?: boolean
  requiredQueries?: string[]
  data?: QueryData
  previousData?: QueryData
  skip?: boolean
  error?: ApolloError
  loading?: Boolean
  networkStatus: number
  loaderNode?: ReactElement
  hideStaleData?: Boolean
} & ChildrenProps<QueryData, T>

/**
 * Utility component that handles query responses in a predictable way.
 *
 * Notes:
 *    - Need to use 2 arguments for the generic otherwise there is a syntax error expecting a JSX tag
 *    - Do not pass "skip" as an argument to the ResponseHandler. ResponseHandler should be used when
 *      we need to handle query data. If we want to use skip, migrate this to a be a custom hook.
 */
const ResponseHandler = <QueryData, T>(props: Props<QueryData, T>) => {
  const {
    children,
    error,
    loading,
    hideLoader,
    loaderNode = null,
    requiredQueries,
    data,
    ...restProps
  } = props
  if (error) {
    const errorMessage = get(error.graphQLErrors, '0.message', error.message)
    console.error(errorMessage)
    return <span>{`Error: ${errorMessage.slice(0, 80)}`}</span>
  }
  // Show a loader when we are fetching new data, regardless of whether we have already rendered old data.
  // Even though in some cases we could continue to show old data while refetching, it helps to prevent
  // bugs from partial data. We also check for "loading" in case a query contains multiple nodes,
  // we should reload while one is being refetched.
  if (!data || loading) {
    return hideLoader ? loaderNode : 'Loading...'
  }
  const restResultProps = { ...restProps, loading }
  // If you want to return null instead of rendering children when the data comes back empty.
  if (requiredQueries && !requiredQueries.every(name => data[name as keyof QueryData])) return null
  return children(data!, restResultProps)
}

export default ResponseHandler
