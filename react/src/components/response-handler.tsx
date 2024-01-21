import { ReactElement } from 'react'

import { ApolloError } from '@apollo/client'
import { LoadingScreen } from 'components/loading-screen'
import get from 'lodash/get'

type ChildrenProps<QueryData, T> = {
  children: (
    data: NonNullable<QueryData>,
    restQueryResult: Partial<Props<QueryData, T>>,
  ) => ReactElement
}

type Props<QueryData, T> = {
  hideLoader?: boolean
  data?: QueryData
  previousData?: QueryData
  error?: ApolloError
  loading?: Boolean
} & ChildrenProps<QueryData, T>

const ResponseHandler = <QueryData, T>(props: Props<QueryData, T>) => {
  const { children, error, loading, data, ...restProps } = props
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
    return <LoadingScreen />
  }
  const restResultProps = { ...restProps, loading }
  return children(data!, restResultProps)
}

export default ResponseHandler
