import { DateString } from 'utils/types';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: DateString; output: DateString; }
};

/** An enumeration. */
export enum CurrencyEnum {
  EUR = 'EUR',
  RON = 'RON',
  USD = 'USD'
}

export type CustomerOrganizationType = {
  __typename?: 'CustomerOrganizationType';
  description?: Maybe<Scalars['String']['output']>;
  invoiceItems: Array<InvoiceItemType>;
  name: Scalars['String']['output'];
  phoneNumber1: Scalars['String']['output'];
  phoneNumber2: Scalars['String']['output'];
  programManager?: Maybe<UserType>;
  uuid: Scalars['String']['output'];
};

export type ErrorType = {
  __typename?: 'ErrorType';
  field?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type InvoiceItemInput = {
  dateSent?: InputMaybe<Scalars['Date']['input']>;
  description: Scalars['String']['input'];
  isFixedCost?: InputMaybe<Scalars['Boolean']['input']>;
  minutesAllocated?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['Int']['input']>;
  unitPriceCurrency?: InputMaybe<CurrencyEnum>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type InvoiceItemType = {
  __typename?: 'InvoiceItemType';
  /** Date when the invoice was sent to the customer */
  dateSent?: Maybe<Scalars['Date']['output']>;
  description: Scalars['String']['output'];
  /** Boolean indicating if this invoice item is a fixed cost or not. For example monthly recurring invoices are fixed */
  isFixedCost: Scalars['Boolean']['output'];
  /** Number of minutes allocated to the customer for this invoice item */
  minutesAllocated?: Maybe<Scalars['Int']['output']>;
  unitPrice?: Maybe<Scalars['Int']['output']>;
  unitPriceCurrency?: Maybe<CurrencyEnum>;
  uuid: Scalars['String']['output'];
};

/**
 * Authentication mutation. Post the email and password, and get a token
 * you can use for subsequent requests.
 */
export type LoginUser = {
  __typename?: 'LoginUser';
  error?: Maybe<ErrorType>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

/** Logs out the user */
export type LogoutUser = {
  __typename?: 'LogoutUser';
  error?: Maybe<ErrorType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Log the user in with email and password. */
  login?: Maybe<LoginUser>;
  /** Log out user. */
  logout?: Maybe<LogoutUser>;
  /** Create a new customer organization */
  updateCustomerOrganization?: Maybe<UpdateCustomerOrganization>;
  /** Create a new customer organization invoice items */
  updateCustomerOrganizationInvoiceItem?: Maybe<UpdateCustomerOrganizationInvoiceItem>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateCustomerOrganizationArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber1?: InputMaybe<Scalars['String']['input']>;
  phoneNumber2?: InputMaybe<Scalars['String']['input']>;
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCustomerOrganizationInvoiceItemArgs = {
  customerOrganizationUuid: Scalars['String']['input'];
  invoiceItem: InvoiceItemInput;
};

export type Query = {
  __typename?: 'Query';
  currentUser: UserType;
  /** Get an individual Customer Organization */
  customerOrganization: CustomerOrganizationType;
  /** List all Customer Organization */
  customerOrganizations: Array<CustomerOrganizationType>;
  /** List all users */
  users: Array<UserType>;
};


export type QueryCustomerOrganizationArgs = {
  uuid: Scalars['String']['input'];
};

/** Update or Create a new customer organization */
export type UpdateCustomerOrganization = {
  __typename?: 'UpdateCustomerOrganization';
  error?: Maybe<ErrorType>;
};

export type UpdateCustomerOrganizationInvoiceItem = {
  __typename?: 'UpdateCustomerOrganizationInvoiceItem';
  error?: Maybe<ErrorType>;
};

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type UserFragment = { __typename?: 'UserType', uuid: string, email: string, name: string };

export type ErrorFragment = { __typename?: 'ErrorType', field?: string | null, message: string };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginUser', token?: string | null, error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'UserType', uuid: string, email: string, name: string } | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: { __typename?: 'LogoutUser', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type UpdateCustomerOrganizationMutationVariables = Exact<{
  uuid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  phoneNumber1?: InputMaybe<Scalars['String']['input']>;
  phoneNumber2?: InputMaybe<Scalars['String']['input']>;
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateCustomerOrganizationMutation = { __typename?: 'Mutation', updateCustomerOrganization?: { __typename?: 'UpdateCustomerOrganization', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type UpdateCustomerOrganizationInvoiceItemMutationVariables = Exact<{
  customerOrganizationUuid: Scalars['String']['input'];
  invoiceItem: InvoiceItemInput;
}>;


export type UpdateCustomerOrganizationInvoiceItemMutation = { __typename?: 'Mutation', updateCustomerOrganizationInvoiceItem?: { __typename?: 'UpdateCustomerOrganizationInvoiceItem', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'UserType', uuid: string, email: string, name: string } };

export type CustomerOrganizationInvoiceItemsQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type CustomerOrganizationInvoiceItemsQuery = { __typename?: 'Query', customerOrganization: { __typename?: 'CustomerOrganizationType', uuid: string, invoiceItems: Array<{ __typename?: 'InvoiceItemType', uuid: string, description: string, unitPrice?: number | null, unitPriceCurrency?: CurrencyEnum | null, dateSent?: DateString | null, minutesAllocated?: number | null, isFixedCost: boolean }> } };

export type CustomerOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomerOrganizationsQuery = { __typename?: 'Query', customerOrganizations: Array<{ __typename?: 'CustomerOrganizationType', uuid: string, name: string, description?: string | null, phoneNumber1: string, phoneNumber2: string, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null }> };

export const UserFragmentDoc = gql`
    fragment User on UserType {
  uuid
  email
  name
}
    `;
export const ErrorFragmentDoc = gql`
    fragment Error on ErrorType {
  field
  message
}
    `;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    error {
      ...Error
    }
    token
    user {
      ...User
    }
  }
}
    ${ErrorFragmentDoc}
${UserFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const UpdateCustomerOrganizationDocument = gql`
    mutation UpdateCustomerOrganization($uuid: String, $name: String!, $description: String, $phoneNumber1: String, $phoneNumber2: String, $programManagerUuid: String) {
  updateCustomerOrganization(
    uuid: $uuid
    name: $name
    phoneNumber1: $phoneNumber1
    phoneNumber2: $phoneNumber2
    programManagerUuid: $programManagerUuid
  ) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type UpdateCustomerOrganizationMutationFn = Apollo.MutationFunction<UpdateCustomerOrganizationMutation, UpdateCustomerOrganizationMutationVariables>;

/**
 * __useUpdateCustomerOrganizationMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerOrganizationMutation, { data, loading, error }] = useUpdateCustomerOrganizationMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      phoneNumber1: // value for 'phoneNumber1'
 *      phoneNumber2: // value for 'phoneNumber2'
 *      programManagerUuid: // value for 'programManagerUuid'
 *   },
 * });
 */
export function useUpdateCustomerOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerOrganizationMutation, UpdateCustomerOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerOrganizationMutation, UpdateCustomerOrganizationMutationVariables>(UpdateCustomerOrganizationDocument, options);
      }
export type UpdateCustomerOrganizationMutationHookResult = ReturnType<typeof useUpdateCustomerOrganizationMutation>;
export type UpdateCustomerOrganizationMutationResult = Apollo.MutationResult<UpdateCustomerOrganizationMutation>;
export type UpdateCustomerOrganizationMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerOrganizationMutation, UpdateCustomerOrganizationMutationVariables>;
export const UpdateCustomerOrganizationInvoiceItemDocument = gql`
    mutation UpdateCustomerOrganizationInvoiceItem($customerOrganizationUuid: String!, $invoiceItem: InvoiceItemInput!) {
  updateCustomerOrganizationInvoiceItem(
    customerOrganizationUuid: $customerOrganizationUuid
    invoiceItem: $invoiceItem
  ) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type UpdateCustomerOrganizationInvoiceItemMutationFn = Apollo.MutationFunction<UpdateCustomerOrganizationInvoiceItemMutation, UpdateCustomerOrganizationInvoiceItemMutationVariables>;

/**
 * __useUpdateCustomerOrganizationInvoiceItemMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerOrganizationInvoiceItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerOrganizationInvoiceItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerOrganizationInvoiceItemMutation, { data, loading, error }] = useUpdateCustomerOrganizationInvoiceItemMutation({
 *   variables: {
 *      customerOrganizationUuid: // value for 'customerOrganizationUuid'
 *      invoiceItem: // value for 'invoiceItem'
 *   },
 * });
 */
export function useUpdateCustomerOrganizationInvoiceItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerOrganizationInvoiceItemMutation, UpdateCustomerOrganizationInvoiceItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerOrganizationInvoiceItemMutation, UpdateCustomerOrganizationInvoiceItemMutationVariables>(UpdateCustomerOrganizationInvoiceItemDocument, options);
      }
export type UpdateCustomerOrganizationInvoiceItemMutationHookResult = ReturnType<typeof useUpdateCustomerOrganizationInvoiceItemMutation>;
export type UpdateCustomerOrganizationInvoiceItemMutationResult = Apollo.MutationResult<UpdateCustomerOrganizationInvoiceItemMutation>;
export type UpdateCustomerOrganizationInvoiceItemMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerOrganizationInvoiceItemMutation, UpdateCustomerOrganizationInvoiceItemMutationVariables>;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    ...User
  }
}
    ${UserFragmentDoc}`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export function useCurrentUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserSuspenseQueryHookResult = ReturnType<typeof useCurrentUserSuspenseQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const CustomerOrganizationInvoiceItemsDocument = gql`
    query CustomerOrganizationInvoiceItems($uuid: String!) {
  customerOrganization(uuid: $uuid) {
    uuid
    invoiceItems {
      uuid
      description
      unitPrice
      unitPriceCurrency
      dateSent
      minutesAllocated
      isFixedCost
    }
  }
}
    `;

/**
 * __useCustomerOrganizationInvoiceItemsQuery__
 *
 * To run a query within a React component, call `useCustomerOrganizationInvoiceItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerOrganizationInvoiceItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerOrganizationInvoiceItemsQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useCustomerOrganizationInvoiceItemsQuery(baseOptions: Apollo.QueryHookOptions<CustomerOrganizationInvoiceItemsQuery, CustomerOrganizationInvoiceItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomerOrganizationInvoiceItemsQuery, CustomerOrganizationInvoiceItemsQueryVariables>(CustomerOrganizationInvoiceItemsDocument, options);
      }
export function useCustomerOrganizationInvoiceItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomerOrganizationInvoiceItemsQuery, CustomerOrganizationInvoiceItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomerOrganizationInvoiceItemsQuery, CustomerOrganizationInvoiceItemsQueryVariables>(CustomerOrganizationInvoiceItemsDocument, options);
        }
export function useCustomerOrganizationInvoiceItemsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CustomerOrganizationInvoiceItemsQuery, CustomerOrganizationInvoiceItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CustomerOrganizationInvoiceItemsQuery, CustomerOrganizationInvoiceItemsQueryVariables>(CustomerOrganizationInvoiceItemsDocument, options);
        }
export type CustomerOrganizationInvoiceItemsQueryHookResult = ReturnType<typeof useCustomerOrganizationInvoiceItemsQuery>;
export type CustomerOrganizationInvoiceItemsLazyQueryHookResult = ReturnType<typeof useCustomerOrganizationInvoiceItemsLazyQuery>;
export type CustomerOrganizationInvoiceItemsSuspenseQueryHookResult = ReturnType<typeof useCustomerOrganizationInvoiceItemsSuspenseQuery>;
export type CustomerOrganizationInvoiceItemsQueryResult = Apollo.QueryResult<CustomerOrganizationInvoiceItemsQuery, CustomerOrganizationInvoiceItemsQueryVariables>;
export const CustomerOrganizationsDocument = gql`
    query CustomerOrganizations {
  customerOrganizations {
    uuid
    name
    description
    phoneNumber1
    phoneNumber2
    programManager {
      uuid
      name
    }
  }
}
    `;

/**
 * __useCustomerOrganizationsQuery__
 *
 * To run a query within a React component, call `useCustomerOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCustomerOrganizationsQuery(baseOptions?: Apollo.QueryHookOptions<CustomerOrganizationsQuery, CustomerOrganizationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomerOrganizationsQuery, CustomerOrganizationsQueryVariables>(CustomerOrganizationsDocument, options);
      }
export function useCustomerOrganizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomerOrganizationsQuery, CustomerOrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomerOrganizationsQuery, CustomerOrganizationsQueryVariables>(CustomerOrganizationsDocument, options);
        }
export function useCustomerOrganizationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CustomerOrganizationsQuery, CustomerOrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CustomerOrganizationsQuery, CustomerOrganizationsQueryVariables>(CustomerOrganizationsDocument, options);
        }
export type CustomerOrganizationsQueryHookResult = ReturnType<typeof useCustomerOrganizationsQuery>;
export type CustomerOrganizationsLazyQueryHookResult = ReturnType<typeof useCustomerOrganizationsLazyQuery>;
export type CustomerOrganizationsSuspenseQueryHookResult = ReturnType<typeof useCustomerOrganizationsSuspenseQuery>;
export type CustomerOrganizationsQueryResult = Apollo.QueryResult<CustomerOrganizationsQuery, CustomerOrganizationsQueryVariables>;