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
};

/** Create a new customer organization */
export type CreateCustomerOrganization = {
  __typename?: 'CreateCustomerOrganization';
  error?: Maybe<ErrorType>;
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
  monthlyInvoiceAmmount?: Maybe<Scalars['Int']['output']>;
  monthlyInvoiceCurrency?: Maybe<OrganizationCustomerOrganizationMonthlyInvoiceCurrencyChoices>;
  name: Scalars['String']['output'];
  programManager?: Maybe<UserType>;
  uuid: Scalars['String']['output'];
};

export type ErrorType = {
  __typename?: 'ErrorType';
  field?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
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
  /** Create a new customer organization */
  createCustomerOrganization?: Maybe<CreateCustomerOrganization>;
  /** Log the user in with email and password. */
  login?: Maybe<LoginUser>;
  /** Log out user. */
  logout?: Maybe<LogoutUser>;
};


export type MutationCreateCustomerOrganizationArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  monthlyInvoiceAmmount?: InputMaybe<Scalars['Int']['input']>;
  monthlyInvoiceCurrency?: InputMaybe<CurrencyEnum>;
  name: Scalars['String']['input'];
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** An enumeration. */
export enum OrganizationCustomerOrganizationMonthlyInvoiceCurrencyChoices {
  /** Eur */
  EUR = 'EUR',
  /** Ron */
  RON = 'RON',
  /** Usd */
  USD = 'USD'
}

export type Query = {
  __typename?: 'Query';
  currentUser: UserType;
  /** List all customers */
  customerOrganizations: Array<CustomerOrganizationType>;
  /** List all users */
  users: Array<UserType>;
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

export type CreateCustomerOrganizationMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  monthlyInvoiceAmmount?: InputMaybe<Scalars['Int']['input']>;
  monthlyInvoiceCurrency?: InputMaybe<CurrencyEnum>;
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateCustomerOrganizationMutation = { __typename?: 'Mutation', createCustomerOrganization?: { __typename?: 'CreateCustomerOrganization', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'UserType', uuid: string, email: string, name: string } };

export type CustomerOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomerOrganizationsQuery = { __typename?: 'Query', customerOrganizations: Array<{ __typename?: 'CustomerOrganizationType', uuid: string, name: string, description?: string | null, monthlyInvoiceAmmount?: number | null, monthlyInvoiceCurrency?: OrganizationCustomerOrganizationMonthlyInvoiceCurrencyChoices | null, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null }> };

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
export const CreateCustomerOrganizationDocument = gql`
    mutation CreateCustomerOrganization($name: String!, $description: String, $monthlyInvoiceAmmount: Int, $monthlyInvoiceCurrency: CurrencyEnum, $programManagerUuid: String) {
  createCustomerOrganization(
    name: $name
    description: $description
    monthlyInvoiceAmmount: $monthlyInvoiceAmmount
    monthlyInvoiceCurrency: $monthlyInvoiceCurrency
    programManagerUuid: $programManagerUuid
  ) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type CreateCustomerOrganizationMutationFn = Apollo.MutationFunction<CreateCustomerOrganizationMutation, CreateCustomerOrganizationMutationVariables>;

/**
 * __useCreateCustomerOrganizationMutation__
 *
 * To run a mutation, you first call `useCreateCustomerOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerOrganizationMutation, { data, loading, error }] = useCreateCustomerOrganizationMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      monthlyInvoiceAmmount: // value for 'monthlyInvoiceAmmount'
 *      monthlyInvoiceCurrency: // value for 'monthlyInvoiceCurrency'
 *      programManagerUuid: // value for 'programManagerUuid'
 *   },
 * });
 */
export function useCreateCustomerOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerOrganizationMutation, CreateCustomerOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerOrganizationMutation, CreateCustomerOrganizationMutationVariables>(CreateCustomerOrganizationDocument, options);
      }
export type CreateCustomerOrganizationMutationHookResult = ReturnType<typeof useCreateCustomerOrganizationMutation>;
export type CreateCustomerOrganizationMutationResult = Apollo.MutationResult<CreateCustomerOrganizationMutation>;
export type CreateCustomerOrganizationMutationOptions = Apollo.BaseMutationOptions<CreateCustomerOrganizationMutation, CreateCustomerOrganizationMutationVariables>;
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
export const CustomerOrganizationsDocument = gql`
    query CustomerOrganizations {
  customerOrganizations {
    uuid
    name
    description
    monthlyInvoiceAmmount
    monthlyInvoiceCurrency
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