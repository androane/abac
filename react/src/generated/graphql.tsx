import { DateString } from 'graphql/types';
import { DateTimeString } from 'graphql/types';
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
  DateTime: { input: DateTimeString; output: DateTimeString; }
};

export type ClientFileType = {
  __typename?: 'ClientFileType';
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  updated: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
};

export type ClientType = {
  __typename?: 'ClientType';
  /** CUI - Cod Unic de Identificare */
  cui?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phoneNumber1: Scalars['String']['output'];
  phoneNumber2: Scalars['String']['output'];
  programManager?: Maybe<UserType>;
  uuid: Scalars['String']['output'];
};

/** An enumeration. */
export enum CurrencyEnum {
  EUR = 'EUR',
  RON = 'RON',
  USD = 'USD'
}

export type ErrorType = {
  __typename?: 'ErrorType';
  field?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type InvoiceItemInput = {
  description: Scalars['String']['input'];
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  itemDate?: InputMaybe<Scalars['Date']['input']>;
  minutesAllocated?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['Int']['input']>;
  unitPriceCurrency?: InputMaybe<CurrencyEnum>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type InvoiceItemType = {
  __typename?: 'InvoiceItemType';
  description: Scalars['String']['output'];
  /** Boolean indicating if this invoice item is a recurring item every month */
  isRecurring: Scalars['Boolean']['output'];
  /** Date when the invoice item was executed */
  itemDate?: Maybe<Scalars['Date']['output']>;
  /** Number of minutes allocated to the customer for this invoice item */
  minutesAllocated?: Maybe<Scalars['Int']['output']>;
  unitPrice?: Maybe<Scalars['Int']['output']>;
  unitPriceCurrency?: Maybe<CurrencyEnum>;
  uuid: Scalars['String']['output'];
};

/** An enumeration. */
export enum InvoiceStatusEnum {
  DRAFT = 'DRAFT',
  SENT = 'SENT'
}

export type InvoiceType = {
  __typename?: 'InvoiceType';
  /** Date when the invoice was sent to the customer */
  dateSent?: Maybe<Scalars['Date']['output']>;
  items: Array<InvoiceItemType>;
  /** Month of the invoice */
  month: Scalars['Int']['output'];
  uuid: Scalars['String']['output'];
  /** Year of the invoice */
  year: Scalars['Int']['output'];
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
  /** Update or Create a New Client */
  updateClient?: Maybe<UpdateClient>;
  /** Update or Create a New Client Invoice Item */
  updateClientInvoiceItem?: Maybe<UpdateClientInvoiceItem>;
  /** Update Client Invoice Status */
  updateClientInvoiceStatus?: Maybe<UpdateClientInvoiceStatus>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateClientArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber1?: InputMaybe<Scalars['String']['input']>;
  phoneNumber2?: InputMaybe<Scalars['String']['input']>;
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateClientInvoiceItemArgs = {
  invoiceItemInput: InvoiceItemInput;
  invoiceUuid: Scalars['String']['input'];
};


export type MutationUpdateClientInvoiceStatusArgs = {
  invoiceUuid: Scalars['String']['input'];
  status: InvoiceStatusEnum;
};

export type Query = {
  __typename?: 'Query';
  /** Get an individual Client */
  client: ClientType;
  /** List all Documents of a Client */
  clientFiles: Array<ClientFileType>;
  clientInvoice: InvoiceType;
  /** List all Clients */
  clients: Array<ClientType>;
  currentUser: UserType;
  /** List all Program Managers */
  programManagers: Array<UserType>;
  /** List all users */
  users: Array<UserType>;
};


export type QueryClientArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryClientFilesArgs = {
  clientUuid: Scalars['String']['input'];
};


export type QueryClientInvoiceArgs = {
  clientUuid: Scalars['String']['input'];
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateClient = {
  __typename?: 'UpdateClient';
  client?: Maybe<ClientType>;
  error?: Maybe<ErrorType>;
};

export type UpdateClientInvoiceItem = {
  __typename?: 'UpdateClientInvoiceItem';
  error?: Maybe<ErrorType>;
  invoiceItem?: Maybe<InvoiceItemType>;
};

export type UpdateClientInvoiceStatus = {
  __typename?: 'UpdateClientInvoiceStatus';
  error?: Maybe<ErrorType>;
  invoice?: Maybe<InvoiceType>;
};

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type UserFragment = { __typename?: 'UserType', uuid: string, email: string, name: string };

export type ClientFragment = { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, phoneNumber1: string, phoneNumber2: string, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null };

export type InvoiceItemFragment = { __typename?: 'InvoiceItemType', uuid: string, description: string, unitPrice?: number | null, unitPriceCurrency?: CurrencyEnum | null, itemDate?: DateString | null, minutesAllocated?: number | null, isRecurring: boolean };

export type ErrorFragment = { __typename?: 'ErrorType', field?: string | null, message: string };

export type ProgramManagerFragment = { __typename?: 'UserType', uuid: string, name: string, email: string };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginUser', token?: string | null, error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'UserType', uuid: string, email: string, name: string } | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: { __typename?: 'LogoutUser', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type UpdateClientMutationVariables = Exact<{
  uuid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  phoneNumber1?: InputMaybe<Scalars['String']['input']>;
  phoneNumber2?: InputMaybe<Scalars['String']['input']>;
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateClientMutation = { __typename?: 'Mutation', updateClient?: { __typename?: 'UpdateClient', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, client?: { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, phoneNumber1: string, phoneNumber2: string, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null } | null } | null };

export type UpdateClientInvoiceItemMutationVariables = Exact<{
  invoiceUuid: Scalars['String']['input'];
  invoiceItemInput: InvoiceItemInput;
}>;


export type UpdateClientInvoiceItemMutation = { __typename?: 'Mutation', updateClientInvoiceItem?: { __typename?: 'UpdateClientInvoiceItem', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, invoiceItem?: { __typename?: 'InvoiceItemType', uuid: string, description: string, unitPrice?: number | null, unitPriceCurrency?: CurrencyEnum | null, itemDate?: DateString | null, minutesAllocated?: number | null, isRecurring: boolean } | null } | null };

export type UpdateClientInvoiceStatusMutationVariables = Exact<{
  invoiceUuid: Scalars['String']['input'];
  status: InvoiceStatusEnum;
}>;


export type UpdateClientInvoiceStatusMutation = { __typename?: 'Mutation', updateClientInvoiceStatus?: { __typename?: 'UpdateClientInvoiceStatus', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, invoice?: { __typename?: 'InvoiceType', uuid: string, dateSent?: DateString | null } | null } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'UserType', uuid: string, email: string, name: string } };

export type ClientProgramManagersQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientProgramManagersQuery = { __typename?: 'Query', programManagers: Array<{ __typename?: 'UserType', uuid: string, name: string, email: string }> };

export type ClientsQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientsQuery = { __typename?: 'Query', clients: Array<{ __typename?: 'ClientType', uuid: string, name: string, description?: string | null, phoneNumber1: string, phoneNumber2: string, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null }> };

export type ClientFilesQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
}>;


export type ClientFilesQuery = { __typename?: 'Query', clientFiles: Array<{ __typename?: 'ClientFileType', name: string, description?: string | null, updated: DateTimeString, url: string, size: number }> };

export type ClientInvoiceQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ClientInvoiceQuery = { __typename?: 'Query', clientInvoice: { __typename?: 'InvoiceType', uuid: string, month: number, year: number, dateSent?: DateString | null, items: Array<{ __typename?: 'InvoiceItemType', uuid: string, description: string, unitPrice?: number | null, unitPriceCurrency?: CurrencyEnum | null, itemDate?: DateString | null, minutesAllocated?: number | null, isRecurring: boolean }> } };

export const UserFragmentDoc = gql`
    fragment User on UserType {
  uuid
  email
  name
}
    `;
export const ClientFragmentDoc = gql`
    fragment Client on ClientType {
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
    `;
export const InvoiceItemFragmentDoc = gql`
    fragment InvoiceItem on InvoiceItemType {
  uuid
  description
  unitPrice
  unitPriceCurrency
  itemDate
  minutesAllocated
  isRecurring
}
    `;
export const ErrorFragmentDoc = gql`
    fragment Error on ErrorType {
  field
  message
}
    `;
export const ProgramManagerFragmentDoc = gql`
    fragment ProgramManager on UserType {
  uuid
  name
  email
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
export const UpdateClientDocument = gql`
    mutation UpdateClient($uuid: String, $name: String!, $description: String, $phoneNumber1: String, $phoneNumber2: String, $programManagerUuid: String) {
  updateClient(
    uuid: $uuid
    name: $name
    description: $description
    phoneNumber1: $phoneNumber1
    phoneNumber2: $phoneNumber2
    programManagerUuid: $programManagerUuid
  ) {
    error {
      ...Error
    }
    client {
      ...Client
    }
  }
}
    ${ErrorFragmentDoc}
${ClientFragmentDoc}`;
export type UpdateClientMutationFn = Apollo.MutationFunction<UpdateClientMutation, UpdateClientMutationVariables>;

/**
 * __useUpdateClientMutation__
 *
 * To run a mutation, you first call `useUpdateClientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientMutation, { data, loading, error }] = useUpdateClientMutation({
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
export function useUpdateClientMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientMutation, UpdateClientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientMutation, UpdateClientMutationVariables>(UpdateClientDocument, options);
      }
export type UpdateClientMutationHookResult = ReturnType<typeof useUpdateClientMutation>;
export type UpdateClientMutationResult = Apollo.MutationResult<UpdateClientMutation>;
export type UpdateClientMutationOptions = Apollo.BaseMutationOptions<UpdateClientMutation, UpdateClientMutationVariables>;
export const UpdateClientInvoiceItemDocument = gql`
    mutation UpdateClientInvoiceItem($invoiceUuid: String!, $invoiceItemInput: InvoiceItemInput!) {
  updateClientInvoiceItem(
    invoiceUuid: $invoiceUuid
    invoiceItemInput: $invoiceItemInput
  ) {
    error {
      ...Error
    }
    invoiceItem {
      ...InvoiceItem
    }
  }
}
    ${ErrorFragmentDoc}
${InvoiceItemFragmentDoc}`;
export type UpdateClientInvoiceItemMutationFn = Apollo.MutationFunction<UpdateClientInvoiceItemMutation, UpdateClientInvoiceItemMutationVariables>;

/**
 * __useUpdateClientInvoiceItemMutation__
 *
 * To run a mutation, you first call `useUpdateClientInvoiceItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientInvoiceItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientInvoiceItemMutation, { data, loading, error }] = useUpdateClientInvoiceItemMutation({
 *   variables: {
 *      invoiceUuid: // value for 'invoiceUuid'
 *      invoiceItemInput: // value for 'invoiceItemInput'
 *   },
 * });
 */
export function useUpdateClientInvoiceItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientInvoiceItemMutation, UpdateClientInvoiceItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientInvoiceItemMutation, UpdateClientInvoiceItemMutationVariables>(UpdateClientInvoiceItemDocument, options);
      }
export type UpdateClientInvoiceItemMutationHookResult = ReturnType<typeof useUpdateClientInvoiceItemMutation>;
export type UpdateClientInvoiceItemMutationResult = Apollo.MutationResult<UpdateClientInvoiceItemMutation>;
export type UpdateClientInvoiceItemMutationOptions = Apollo.BaseMutationOptions<UpdateClientInvoiceItemMutation, UpdateClientInvoiceItemMutationVariables>;
export const UpdateClientInvoiceStatusDocument = gql`
    mutation UpdateClientInvoiceStatus($invoiceUuid: String!, $status: InvoiceStatusEnum!) {
  updateClientInvoiceStatus(invoiceUuid: $invoiceUuid, status: $status) {
    error {
      ...Error
    }
    invoice {
      uuid
      dateSent
    }
  }
}
    ${ErrorFragmentDoc}`;
export type UpdateClientInvoiceStatusMutationFn = Apollo.MutationFunction<UpdateClientInvoiceStatusMutation, UpdateClientInvoiceStatusMutationVariables>;

/**
 * __useUpdateClientInvoiceStatusMutation__
 *
 * To run a mutation, you first call `useUpdateClientInvoiceStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientInvoiceStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientInvoiceStatusMutation, { data, loading, error }] = useUpdateClientInvoiceStatusMutation({
 *   variables: {
 *      invoiceUuid: // value for 'invoiceUuid'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdateClientInvoiceStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientInvoiceStatusMutation, UpdateClientInvoiceStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientInvoiceStatusMutation, UpdateClientInvoiceStatusMutationVariables>(UpdateClientInvoiceStatusDocument, options);
      }
export type UpdateClientInvoiceStatusMutationHookResult = ReturnType<typeof useUpdateClientInvoiceStatusMutation>;
export type UpdateClientInvoiceStatusMutationResult = Apollo.MutationResult<UpdateClientInvoiceStatusMutation>;
export type UpdateClientInvoiceStatusMutationOptions = Apollo.BaseMutationOptions<UpdateClientInvoiceStatusMutation, UpdateClientInvoiceStatusMutationVariables>;
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
export const ClientProgramManagersDocument = gql`
    query ClientProgramManagers {
  programManagers {
    ...ProgramManager
  }
}
    ${ProgramManagerFragmentDoc}`;

/**
 * __useClientProgramManagersQuery__
 *
 * To run a query within a React component, call `useClientProgramManagersQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientProgramManagersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientProgramManagersQuery({
 *   variables: {
 *   },
 * });
 */
export function useClientProgramManagersQuery(baseOptions?: Apollo.QueryHookOptions<ClientProgramManagersQuery, ClientProgramManagersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientProgramManagersQuery, ClientProgramManagersQueryVariables>(ClientProgramManagersDocument, options);
      }
export function useClientProgramManagersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientProgramManagersQuery, ClientProgramManagersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientProgramManagersQuery, ClientProgramManagersQueryVariables>(ClientProgramManagersDocument, options);
        }
export function useClientProgramManagersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientProgramManagersQuery, ClientProgramManagersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientProgramManagersQuery, ClientProgramManagersQueryVariables>(ClientProgramManagersDocument, options);
        }
export type ClientProgramManagersQueryHookResult = ReturnType<typeof useClientProgramManagersQuery>;
export type ClientProgramManagersLazyQueryHookResult = ReturnType<typeof useClientProgramManagersLazyQuery>;
export type ClientProgramManagersSuspenseQueryHookResult = ReturnType<typeof useClientProgramManagersSuspenseQuery>;
export type ClientProgramManagersQueryResult = Apollo.QueryResult<ClientProgramManagersQuery, ClientProgramManagersQueryVariables>;
export const ClientsDocument = gql`
    query Clients {
  clients {
    ...Client
  }
}
    ${ClientFragmentDoc}`;

/**
 * __useClientsQuery__
 *
 * To run a query within a React component, call `useClientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientsQuery({
 *   variables: {
 *   },
 * });
 */
export function useClientsQuery(baseOptions?: Apollo.QueryHookOptions<ClientsQuery, ClientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientsQuery, ClientsQueryVariables>(ClientsDocument, options);
      }
export function useClientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientsQuery, ClientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientsQuery, ClientsQueryVariables>(ClientsDocument, options);
        }
export function useClientsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientsQuery, ClientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientsQuery, ClientsQueryVariables>(ClientsDocument, options);
        }
export type ClientsQueryHookResult = ReturnType<typeof useClientsQuery>;
export type ClientsLazyQueryHookResult = ReturnType<typeof useClientsLazyQuery>;
export type ClientsSuspenseQueryHookResult = ReturnType<typeof useClientsSuspenseQuery>;
export type ClientsQueryResult = Apollo.QueryResult<ClientsQuery, ClientsQueryVariables>;
export const ClientFilesDocument = gql`
    query ClientFiles($clientUuid: String!) {
  clientFiles(clientUuid: $clientUuid) {
    name
    description
    updated
    url
    size
  }
}
    `;

/**
 * __useClientFilesQuery__
 *
 * To run a query within a React component, call `useClientFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientFilesQuery({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *   },
 * });
 */
export function useClientFilesQuery(baseOptions: Apollo.QueryHookOptions<ClientFilesQuery, ClientFilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientFilesQuery, ClientFilesQueryVariables>(ClientFilesDocument, options);
      }
export function useClientFilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientFilesQuery, ClientFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientFilesQuery, ClientFilesQueryVariables>(ClientFilesDocument, options);
        }
export function useClientFilesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientFilesQuery, ClientFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientFilesQuery, ClientFilesQueryVariables>(ClientFilesDocument, options);
        }
export type ClientFilesQueryHookResult = ReturnType<typeof useClientFilesQuery>;
export type ClientFilesLazyQueryHookResult = ReturnType<typeof useClientFilesLazyQuery>;
export type ClientFilesSuspenseQueryHookResult = ReturnType<typeof useClientFilesSuspenseQuery>;
export type ClientFilesQueryResult = Apollo.QueryResult<ClientFilesQuery, ClientFilesQueryVariables>;
export const ClientInvoiceDocument = gql`
    query ClientInvoice($clientUuid: String!, $year: Int, $month: Int) {
  clientInvoice(clientUuid: $clientUuid, year: $year, month: $month) {
    uuid
    month
    year
    dateSent
    items {
      ...InvoiceItem
    }
  }
}
    ${InvoiceItemFragmentDoc}`;

/**
 * __useClientInvoiceQuery__
 *
 * To run a query within a React component, call `useClientInvoiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientInvoiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientInvoiceQuery({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *      year: // value for 'year'
 *      month: // value for 'month'
 *   },
 * });
 */
export function useClientInvoiceQuery(baseOptions: Apollo.QueryHookOptions<ClientInvoiceQuery, ClientInvoiceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientInvoiceQuery, ClientInvoiceQueryVariables>(ClientInvoiceDocument, options);
      }
export function useClientInvoiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientInvoiceQuery, ClientInvoiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientInvoiceQuery, ClientInvoiceQueryVariables>(ClientInvoiceDocument, options);
        }
export function useClientInvoiceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientInvoiceQuery, ClientInvoiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientInvoiceQuery, ClientInvoiceQueryVariables>(ClientInvoiceDocument, options);
        }
export type ClientInvoiceQueryHookResult = ReturnType<typeof useClientInvoiceQuery>;
export type ClientInvoiceLazyQueryHookResult = ReturnType<typeof useClientInvoiceLazyQuery>;
export type ClientInvoiceSuspenseQueryHookResult = ReturnType<typeof useClientInvoiceSuspenseQuery>;
export type ClientInvoiceQueryResult = Apollo.QueryResult<ClientInvoiceQuery, ClientInvoiceQueryVariables>;