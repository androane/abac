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
  Upload: { input: any; output: any; }
};

export type ChangePassword = {
  __typename?: 'ChangePassword';
  error?: Maybe<ErrorType>;
  token?: Maybe<Scalars['String']['output']>;
};

export type ClientFileInput = {
  file: Scalars['Upload']['input'];
};

export type ClientFileType = {
  __typename?: 'ClientFileType';
  name: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  updated: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type ClientType = {
  __typename?: 'ClientType';
  /** CUI - Cod Unic de Identificare */
  cui?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  files: Array<ClientFileType>;
  name: Scalars['String']['output'];
  phoneNumber1: Scalars['String']['output'];
  phoneNumber2: Scalars['String']['output'];
  programManager?: Maybe<UserType>;
  /** SPV Password */
  spvPassword?: Maybe<Scalars['String']['output']>;
  /** SPV Username */
  spvUsername?: Maybe<Scalars['String']['output']>;
  users: Array<UserType>;
  uuid: Scalars['String']['output'];
};

export type ClientUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  ownershipPercentage?: InputMaybe<Scalars['Int']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<ClientUserRoleEnum>;
  spvPassword?: InputMaybe<Scalars['String']['input']>;
  spvUsername?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type ClientUserProfileType = {
  __typename?: 'ClientUserProfileType';
  /** What percentage of the organization does this user own? */
  ownershipPercentage?: Maybe<Scalars['Int']['output']>;
  phoneNumber: Scalars['String']['output'];
  role?: Maybe<ClientUserRoleEnum>;
  /** SPV Password */
  spvPassword?: Maybe<Scalars['String']['output']>;
  /** SPV Username */
  spvUsername?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['String']['output'];
};

/** An enumeration. */
export enum ClientUserRoleEnum {
  ADMINSTRATOR = 'ADMINSTRATOR',
  ASSOCIATE = 'ASSOCIATE',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER'
}

export type CreateClientFiles = {
  __typename?: 'CreateClientFiles';
  client?: Maybe<ClientType>;
  error?: Maybe<ErrorType>;
};

/** An enumeration. */
export enum CurrencyEnum {
  EUR = 'EUR',
  RON = 'RON',
  USD = 'USD'
}

export type DeleteClient = {
  __typename?: 'DeleteClient';
  error?: Maybe<ErrorType>;
};

export type DeleteClientFile = {
  __typename?: 'DeleteClientFile';
  error?: Maybe<ErrorType>;
};

export type DeleteClientInvoiceItem = {
  __typename?: 'DeleteClientInvoiceItem';
  error?: Maybe<ErrorType>;
  invoice?: Maybe<InvoiceType>;
};

export type DeleteClientUser = {
  __typename?: 'DeleteClientUser';
  error?: Maybe<ErrorType>;
};

export type DeleteOrganizationService = {
  __typename?: 'DeleteOrganizationService';
  error?: Maybe<ErrorType>;
};

export type ErrorType = {
  __typename?: 'ErrorType';
  field?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type InvoiceItemInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  itemDate?: InputMaybe<Scalars['Date']['input']>;
  minutesAllocated?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  standardServiceUuid?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['Int']['input']>;
  unitPriceCurrency?: InputMaybe<CurrencyEnum>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type InvoiceItemType = {
  __typename?: 'InvoiceItemType';
  /** Optional explanation for the invoice item */
  description?: Maybe<Scalars['String']['output']>;
  /** Boolean indicating if this invoice item is a recurring item every month */
  isRecurring: Scalars['Boolean']['output'];
  /** Date when the invoice item was executed */
  itemDate?: Maybe<Scalars['Date']['output']>;
  /** Number of minutes allocated to the customer for this invoice item */
  minutesAllocated?: Maybe<Scalars['Int']['output']>;
  /** Name of the invoice item */
  name: Scalars['String']['output'];
  /** How many of these items are on the invoice */
  quantity: Scalars['Int']['output'];
  /** Connection to the initial standard invoice item. When provided, it copies the attributes from the standard invoice item. */
  standardInvoiceItem?: Maybe<StandardInvoiceItemType>;
  total: Scalars['Float']['output'];
  /** Price of the invoice item per unit type */
  unitPrice: Scalars['Int']['output'];
  unitPriceCurrency?: Maybe<CurrencyEnum>;
  unitPriceType?: Maybe<UnitPriceTypeEnum>;
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
  totalsByCurrency: Array<TotalByCurrencyType>;
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

export type LogoutUser = {
  __typename?: 'LogoutUser';
  error?: Maybe<ErrorType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Change password for a user */
  changePassword?: Maybe<ChangePassword>;
  /** Create new Client Files */
  createClientFiles?: Maybe<CreateClientFiles>;
  /** Delete a Client */
  deleteClient?: Maybe<DeleteClient>;
  /** Delete a Client File */
  deleteClientFile?: Maybe<DeleteClientFile>;
  /** Delete a Client Invoice Item */
  deleteClientInvoiceItem?: Maybe<DeleteClientInvoiceItem>;
  /** Delete a Client User */
  deleteClientUser?: Maybe<DeleteClientUser>;
  /** Delete an Organization Service (Standard Invoice Item) */
  deleteOrganizationService?: Maybe<DeleteOrganizationService>;
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
  /** Update or Create a New Client User */
  updateClientUser?: Maybe<UpdateClientUser>;
  /** Update or Create a New Service (Standard Invoice Item) */
  updateOrganizationService?: Maybe<UpdateOrganizationService>;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationCreateClientFilesArgs = {
  clientFilesInput?: InputMaybe<Array<ClientFileInput>>;
  clientUuid: Scalars['String']['input'];
};


export type MutationDeleteClientArgs = {
  clientUuid: Scalars['String']['input'];
};


export type MutationDeleteClientFileArgs = {
  fileUuid: Scalars['String']['input'];
};


export type MutationDeleteClientInvoiceItemArgs = {
  invoiceItemUuid: Scalars['String']['input'];
};


export type MutationDeleteClientUserArgs = {
  userUuid: Scalars['String']['input'];
};


export type MutationDeleteOrganizationServiceArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateClientArgs = {
  cui?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber1?: InputMaybe<Scalars['String']['input']>;
  phoneNumber2?: InputMaybe<Scalars['String']['input']>;
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
  spvPassword?: InputMaybe<Scalars['String']['input']>;
  spvUsername?: InputMaybe<Scalars['String']['input']>;
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


export type MutationUpdateClientUserArgs = {
  clientUserInput: ClientUserInput;
  clientUuid: Scalars['String']['input'];
};


export type MutationUpdateOrganizationServiceArgs = {
  standardInvoiceItemInput: StandardInvoiceItemInput;
};

export type OrganizationType = {
  __typename?: 'OrganizationType';
  logoUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  standardInvoiceItems: Array<StandardInvoiceItemType>;
  uuid: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get an individual Client */
  client: ClientType;
  /** List all files of a Client */
  clientFiles: Array<ClientFileType>;
  clientInvoice: InvoiceType;
  /** List all Program Managers */
  clientProgramManagers: Array<UserType>;
  /** List all Client Users */
  clientUsers: Array<UserType>;
  /** List all Clients */
  clients: Array<ClientType>;
  currentUser: UserType;
  /** List all Services (Standard Invoice Items) for an organization */
  organizationServices: Array<StandardInvoiceItemType>;
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


export type QueryClientUsersArgs = {
  clientUuid: Scalars['String']['input'];
};

export type StandardInvoiceItemCategoryType = {
  __typename?: 'StandardInvoiceItemCategoryType';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type StandardInvoiceItemInput = {
  categoryCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  unitPrice: Scalars['Int']['input'];
  unitPriceCurrency: CurrencyEnum;
  unitPriceType: UnitPriceTypeEnum;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type StandardInvoiceItemType = {
  __typename?: 'StandardInvoiceItemType';
  category?: Maybe<StandardInvoiceItemCategoryType>;
  /** Name of the invoice item */
  name: Scalars['String']['output'];
  /** Price of the invoice item per unit type */
  unitPrice: Scalars['Int']['output'];
  unitPriceCurrency?: Maybe<CurrencyEnum>;
  unitPriceType?: Maybe<UnitPriceTypeEnum>;
  uuid: Scalars['String']['output'];
};

export type TotalByCurrencyType = {
  __typename?: 'TotalByCurrencyType';
  currency: CurrencyEnum;
  total: Scalars['Float']['output'];
};

/** An enumeration. */
export enum UnitPriceTypeEnum {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY'
}

export type UpdateClient = {
  __typename?: 'UpdateClient';
  client?: Maybe<ClientType>;
  error?: Maybe<ErrorType>;
};

export type UpdateClientInvoiceItem = {
  __typename?: 'UpdateClientInvoiceItem';
  error?: Maybe<ErrorType>;
  invoice?: Maybe<InvoiceType>;
};

export type UpdateClientInvoiceStatus = {
  __typename?: 'UpdateClientInvoiceStatus';
  error?: Maybe<ErrorType>;
  invoice?: Maybe<InvoiceType>;
};

export type UpdateClientUser = {
  __typename?: 'UpdateClientUser';
  clientUser?: Maybe<UserType>;
  error?: Maybe<ErrorType>;
};

export type UpdateOrganizationService = {
  __typename?: 'UpdateOrganizationService';
  error?: Maybe<ErrorType>;
  service?: Maybe<StandardInvoiceItemType>;
};

export type UserType = {
  __typename?: 'UserType';
  clientProfile: ClientUserProfileType;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organization: OrganizationType;
  photoUrl: Scalars['String']['output'];
  role: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type UserFragment = { __typename?: 'UserType', uuid: string, email: string, name: string, photoUrl: string, role: string, organization: { __typename?: 'OrganizationType', uuid: string, name: string, logoUrl: string } };

export type ClientFragment = { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, phoneNumber1: string, phoneNumber2: string, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null };

export type ClientUserFragment = { __typename?: 'UserType', uuid: string, email: string, firstName: string, lastName: string, clientProfile: { __typename?: 'ClientUserProfileType', ownershipPercentage?: number | null, role?: ClientUserRoleEnum | null, spvUsername?: string | null, spvPassword?: string | null, phoneNumber: string } };

export type ErrorFragment = { __typename?: 'ErrorType', field?: string | null, message: string };

export type FileFragment = { __typename?: 'ClientFileType', uuid: string, name: string, updated: DateTimeString, url: string, size: number };

export type InvoiceItemFragment = { __typename?: 'InvoiceItemType', uuid: string, name: string, unitPrice: number, unitPriceCurrency?: CurrencyEnum | null, unitPriceType?: UnitPriceTypeEnum | null, quantity: number, itemDate?: DateString | null, description?: string | null, minutesAllocated?: number | null, isRecurring: boolean, total: number, standardInvoiceItem?: { __typename?: 'StandardInvoiceItemType', uuid: string } | null };

export type ProgramManagerFragment = { __typename?: 'UserType', uuid: string, name: string, email: string };

export type StandardInvoiceItemFragment = { __typename?: 'StandardInvoiceItemType', uuid: string, name: string, unitPrice: number, unitPriceCurrency?: CurrencyEnum | null, unitPriceType?: UnitPriceTypeEnum | null, category?: { __typename?: 'StandardInvoiceItemCategoryType', uuid: string, code: string } | null };

export type ChangePasswordMutationVariables = Exact<{
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword?: { __typename?: 'ChangePassword', token?: string | null, error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginUser', token?: string | null, error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'UserType', uuid: string, email: string, name: string, photoUrl: string, role: string, organization: { __typename?: 'OrganizationType', uuid: string, name: string, logoUrl: string } } | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: { __typename?: 'LogoutUser', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type CreateClientFilesMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  clientFilesInput: Array<ClientFileInput> | ClientFileInput;
}>;


export type CreateClientFilesMutation = { __typename?: 'Mutation', createClientFiles?: { __typename?: 'CreateClientFiles', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, client?: { __typename?: 'ClientType', uuid: string, files: Array<{ __typename?: 'ClientFileType', uuid: string, name: string, updated: DateTimeString, url: string, size: number }> } | null } | null };

export type DeleteClientMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
}>;


export type DeleteClientMutation = { __typename?: 'Mutation', deleteClient?: { __typename?: 'DeleteClient', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type DeleteClientFileMutationVariables = Exact<{
  fileUuid: Scalars['String']['input'];
}>;


export type DeleteClientFileMutation = { __typename?: 'Mutation', deleteClientFile?: { __typename?: 'DeleteClientFile', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type DeleteClientInvoiceItemMutationVariables = Exact<{
  invoiceItemUuid: Scalars['String']['input'];
}>;


export type DeleteClientInvoiceItemMutation = { __typename?: 'Mutation', deleteClientInvoiceItem?: { __typename?: 'DeleteClientInvoiceItem', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type DeleteClientUserMutationVariables = Exact<{
  userUuid: Scalars['String']['input'];
}>;


export type DeleteClientUserMutation = { __typename?: 'Mutation', deleteClientUser?: { __typename?: 'DeleteClientUser', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type UpdateClientMutationVariables = Exact<{
  uuid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  phoneNumber1?: InputMaybe<Scalars['String']['input']>;
  phoneNumber2?: InputMaybe<Scalars['String']['input']>;
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
  spvUsername?: InputMaybe<Scalars['String']['input']>;
  spvPassword?: InputMaybe<Scalars['String']['input']>;
  cui?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateClientMutation = { __typename?: 'Mutation', updateClient?: { __typename?: 'UpdateClient', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, client?: { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, phoneNumber1: string, phoneNumber2: string, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null } | null } | null };

export type UpdateClientInvoiceItemMutationVariables = Exact<{
  invoiceUuid: Scalars['String']['input'];
  invoiceItemInput: InvoiceItemInput;
}>;


export type UpdateClientInvoiceItemMutation = { __typename?: 'Mutation', updateClientInvoiceItem?: { __typename?: 'UpdateClientInvoiceItem', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, invoice?: { __typename?: 'InvoiceType', uuid: string, items: Array<{ __typename?: 'InvoiceItemType', uuid: string, name: string, unitPrice: number, unitPriceCurrency?: CurrencyEnum | null, unitPriceType?: UnitPriceTypeEnum | null, quantity: number, itemDate?: DateString | null, description?: string | null, minutesAllocated?: number | null, isRecurring: boolean, total: number, standardInvoiceItem?: { __typename?: 'StandardInvoiceItemType', uuid: string } | null }> } | null } | null };

export type UpdateClientInvoiceStatusMutationVariables = Exact<{
  invoiceUuid: Scalars['String']['input'];
  status: InvoiceStatusEnum;
}>;


export type UpdateClientInvoiceStatusMutation = { __typename?: 'Mutation', updateClientInvoiceStatus?: { __typename?: 'UpdateClientInvoiceStatus', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, invoice?: { __typename?: 'InvoiceType', uuid: string, dateSent?: DateString | null } | null } | null };

export type UpdateClientUserMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  clientUserInput: ClientUserInput;
}>;


export type UpdateClientUserMutation = { __typename?: 'Mutation', updateClientUser?: { __typename?: 'UpdateClientUser', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, clientUser?: { __typename?: 'UserType', uuid: string, email: string, firstName: string, lastName: string, clientProfile: { __typename?: 'ClientUserProfileType', ownershipPercentage?: number | null, role?: ClientUserRoleEnum | null, spvUsername?: string | null, spvPassword?: string | null, phoneNumber: string } } | null } | null };

export type DeleteOrganizationServiceMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeleteOrganizationServiceMutation = { __typename?: 'Mutation', deleteOrganizationService?: { __typename?: 'DeleteOrganizationService', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type UpdateOrganizationServiceMutationVariables = Exact<{
  standardInvoiceItemInput: StandardInvoiceItemInput;
}>;


export type UpdateOrganizationServiceMutation = { __typename?: 'Mutation', updateOrganizationService?: { __typename?: 'UpdateOrganizationService', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, service?: { __typename?: 'StandardInvoiceItemType', uuid: string, name: string, unitPrice: number, unitPriceCurrency?: CurrencyEnum | null, unitPriceType?: UnitPriceTypeEnum | null, category?: { __typename?: 'StandardInvoiceItemCategoryType', uuid: string, code: string } | null } | null } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'UserType', uuid: string, email: string, name: string, photoUrl: string, role: string, organization: { __typename?: 'OrganizationType', uuid: string, name: string, logoUrl: string } } };

export type ClientsQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientsQuery = { __typename?: 'Query', clients: Array<{ __typename?: 'ClientType', uuid: string, name: string, description?: string | null, phoneNumber1: string, phoneNumber2: string, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null }> };

export type ClientFilesQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
}>;


export type ClientFilesQuery = { __typename?: 'Query', client: { __typename?: 'ClientType', uuid: string, files: Array<{ __typename?: 'ClientFileType', uuid: string, name: string, updated: DateTimeString, url: string, size: number }> } };

export type ClientInvoiceQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ClientInvoiceQuery = { __typename?: 'Query', clientInvoice: { __typename?: 'InvoiceType', uuid: string, month: number, year: number, dateSent?: DateString | null, items: Array<{ __typename?: 'InvoiceItemType', uuid: string, name: string, unitPrice: number, unitPriceCurrency?: CurrencyEnum | null, unitPriceType?: UnitPriceTypeEnum | null, quantity: number, itemDate?: DateString | null, description?: string | null, minutesAllocated?: number | null, isRecurring: boolean, total: number, standardInvoiceItem?: { __typename?: 'StandardInvoiceItemType', uuid: string } | null }>, totalsByCurrency: Array<{ __typename?: 'TotalByCurrencyType', currency: CurrencyEnum, total: number }> } };

export type ClientProgramManagersQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientProgramManagersQuery = { __typename?: 'Query', clientProgramManagers: Array<{ __typename?: 'UserType', uuid: string, name: string, email: string }> };

export type ClientUsersQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
}>;


export type ClientUsersQuery = { __typename?: 'Query', clientUsers: Array<{ __typename?: 'UserType', uuid: string, email: string, firstName: string, lastName: string, clientProfile: { __typename?: 'ClientUserProfileType', ownershipPercentage?: number | null, role?: ClientUserRoleEnum | null, spvUsername?: string | null, spvPassword?: string | null, phoneNumber: string } }> };

export type OrganizationServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationServicesQuery = { __typename?: 'Query', organizationServices: Array<{ __typename?: 'StandardInvoiceItemType', uuid: string, name: string, unitPrice: number, unitPriceCurrency?: CurrencyEnum | null, unitPriceType?: UnitPriceTypeEnum | null, category?: { __typename?: 'StandardInvoiceItemCategoryType', uuid: string, code: string } | null }> };

export const UserFragmentDoc = gql`
    fragment User on UserType {
  uuid
  email
  name
  photoUrl
  role
  organization {
    uuid
    name
    logoUrl
  }
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
  cui
  spvUsername
  spvPassword
}
    `;
export const ClientUserFragmentDoc = gql`
    fragment ClientUser on UserType {
  uuid
  email
  firstName
  lastName
  clientProfile {
    ownershipPercentage
    role
    spvUsername
    spvPassword
    phoneNumber
  }
}
    `;
export const ErrorFragmentDoc = gql`
    fragment Error on ErrorType {
  field
  message
}
    `;
export const FileFragmentDoc = gql`
    fragment File on ClientFileType {
  uuid
  name
  updated
  url
  size
}
    `;
export const InvoiceItemFragmentDoc = gql`
    fragment InvoiceItem on InvoiceItemType {
  uuid
  name
  unitPrice
  unitPriceCurrency
  unitPriceType
  quantity
  itemDate
  description
  minutesAllocated
  isRecurring
  total
  standardInvoiceItem {
    uuid
  }
}
    `;
export const ProgramManagerFragmentDoc = gql`
    fragment ProgramManager on UserType {
  uuid
  name
  email
}
    `;
export const StandardInvoiceItemFragmentDoc = gql`
    fragment StandardInvoiceItem on StandardInvoiceItemType {
  uuid
  name
  unitPrice
  unitPriceCurrency
  unitPriceType
  category {
    uuid
    code
  }
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
  changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
    error {
      ...Error
    }
    token
  }
}
    ${ErrorFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      currentPassword: // value for 'currentPassword'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
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
export const CreateClientFilesDocument = gql`
    mutation CreateClientFiles($clientUuid: String!, $clientFilesInput: [ClientFileInput!]!) {
  createClientFiles(clientUuid: $clientUuid, clientFilesInput: $clientFilesInput) {
    error {
      ...Error
    }
    client {
      uuid
      files {
        ...File
      }
    }
  }
}
    ${ErrorFragmentDoc}
${FileFragmentDoc}`;
export type CreateClientFilesMutationFn = Apollo.MutationFunction<CreateClientFilesMutation, CreateClientFilesMutationVariables>;

/**
 * __useCreateClientFilesMutation__
 *
 * To run a mutation, you first call `useCreateClientFilesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClientFilesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClientFilesMutation, { data, loading, error }] = useCreateClientFilesMutation({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *      clientFilesInput: // value for 'clientFilesInput'
 *   },
 * });
 */
export function useCreateClientFilesMutation(baseOptions?: Apollo.MutationHookOptions<CreateClientFilesMutation, CreateClientFilesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateClientFilesMutation, CreateClientFilesMutationVariables>(CreateClientFilesDocument, options);
      }
export type CreateClientFilesMutationHookResult = ReturnType<typeof useCreateClientFilesMutation>;
export type CreateClientFilesMutationResult = Apollo.MutationResult<CreateClientFilesMutation>;
export type CreateClientFilesMutationOptions = Apollo.BaseMutationOptions<CreateClientFilesMutation, CreateClientFilesMutationVariables>;
export const DeleteClientDocument = gql`
    mutation DeleteClient($clientUuid: String!) {
  deleteClient(clientUuid: $clientUuid) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteClientMutationFn = Apollo.MutationFunction<DeleteClientMutation, DeleteClientMutationVariables>;

/**
 * __useDeleteClientMutation__
 *
 * To run a mutation, you first call `useDeleteClientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClientMutation, { data, loading, error }] = useDeleteClientMutation({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *   },
 * });
 */
export function useDeleteClientMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClientMutation, DeleteClientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteClientMutation, DeleteClientMutationVariables>(DeleteClientDocument, options);
      }
export type DeleteClientMutationHookResult = ReturnType<typeof useDeleteClientMutation>;
export type DeleteClientMutationResult = Apollo.MutationResult<DeleteClientMutation>;
export type DeleteClientMutationOptions = Apollo.BaseMutationOptions<DeleteClientMutation, DeleteClientMutationVariables>;
export const DeleteClientFileDocument = gql`
    mutation DeleteClientFile($fileUuid: String!) {
  deleteClientFile(fileUuid: $fileUuid) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteClientFileMutationFn = Apollo.MutationFunction<DeleteClientFileMutation, DeleteClientFileMutationVariables>;

/**
 * __useDeleteClientFileMutation__
 *
 * To run a mutation, you first call `useDeleteClientFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClientFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClientFileMutation, { data, loading, error }] = useDeleteClientFileMutation({
 *   variables: {
 *      fileUuid: // value for 'fileUuid'
 *   },
 * });
 */
export function useDeleteClientFileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClientFileMutation, DeleteClientFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteClientFileMutation, DeleteClientFileMutationVariables>(DeleteClientFileDocument, options);
      }
export type DeleteClientFileMutationHookResult = ReturnType<typeof useDeleteClientFileMutation>;
export type DeleteClientFileMutationResult = Apollo.MutationResult<DeleteClientFileMutation>;
export type DeleteClientFileMutationOptions = Apollo.BaseMutationOptions<DeleteClientFileMutation, DeleteClientFileMutationVariables>;
export const DeleteClientInvoiceItemDocument = gql`
    mutation DeleteClientInvoiceItem($invoiceItemUuid: String!) {
  deleteClientInvoiceItem(invoiceItemUuid: $invoiceItemUuid) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteClientInvoiceItemMutationFn = Apollo.MutationFunction<DeleteClientInvoiceItemMutation, DeleteClientInvoiceItemMutationVariables>;

/**
 * __useDeleteClientInvoiceItemMutation__
 *
 * To run a mutation, you first call `useDeleteClientInvoiceItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClientInvoiceItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClientInvoiceItemMutation, { data, loading, error }] = useDeleteClientInvoiceItemMutation({
 *   variables: {
 *      invoiceItemUuid: // value for 'invoiceItemUuid'
 *   },
 * });
 */
export function useDeleteClientInvoiceItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClientInvoiceItemMutation, DeleteClientInvoiceItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteClientInvoiceItemMutation, DeleteClientInvoiceItemMutationVariables>(DeleteClientInvoiceItemDocument, options);
      }
export type DeleteClientInvoiceItemMutationHookResult = ReturnType<typeof useDeleteClientInvoiceItemMutation>;
export type DeleteClientInvoiceItemMutationResult = Apollo.MutationResult<DeleteClientInvoiceItemMutation>;
export type DeleteClientInvoiceItemMutationOptions = Apollo.BaseMutationOptions<DeleteClientInvoiceItemMutation, DeleteClientInvoiceItemMutationVariables>;
export const DeleteClientUserDocument = gql`
    mutation DeleteClientUser($userUuid: String!) {
  deleteClientUser(userUuid: $userUuid) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteClientUserMutationFn = Apollo.MutationFunction<DeleteClientUserMutation, DeleteClientUserMutationVariables>;

/**
 * __useDeleteClientUserMutation__
 *
 * To run a mutation, you first call `useDeleteClientUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClientUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClientUserMutation, { data, loading, error }] = useDeleteClientUserMutation({
 *   variables: {
 *      userUuid: // value for 'userUuid'
 *   },
 * });
 */
export function useDeleteClientUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClientUserMutation, DeleteClientUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteClientUserMutation, DeleteClientUserMutationVariables>(DeleteClientUserDocument, options);
      }
export type DeleteClientUserMutationHookResult = ReturnType<typeof useDeleteClientUserMutation>;
export type DeleteClientUserMutationResult = Apollo.MutationResult<DeleteClientUserMutation>;
export type DeleteClientUserMutationOptions = Apollo.BaseMutationOptions<DeleteClientUserMutation, DeleteClientUserMutationVariables>;
export const UpdateClientDocument = gql`
    mutation UpdateClient($uuid: String, $name: String!, $description: String, $phoneNumber1: String, $phoneNumber2: String, $programManagerUuid: String, $spvUsername: String, $spvPassword: String, $cui: String) {
  updateClient(
    uuid: $uuid
    name: $name
    description: $description
    phoneNumber1: $phoneNumber1
    phoneNumber2: $phoneNumber2
    programManagerUuid: $programManagerUuid
    spvPassword: $spvPassword
    spvUsername: $spvUsername
    cui: $cui
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
 *      spvUsername: // value for 'spvUsername'
 *      spvPassword: // value for 'spvPassword'
 *      cui: // value for 'cui'
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
    invoice {
      uuid
      items {
        ...InvoiceItem
      }
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
export const UpdateClientUserDocument = gql`
    mutation UpdateClientUser($clientUuid: String!, $clientUserInput: ClientUserInput!) {
  updateClientUser(clientUuid: $clientUuid, clientUserInput: $clientUserInput) {
    error {
      ...Error
    }
    clientUser {
      ...ClientUser
    }
  }
}
    ${ErrorFragmentDoc}
${ClientUserFragmentDoc}`;
export type UpdateClientUserMutationFn = Apollo.MutationFunction<UpdateClientUserMutation, UpdateClientUserMutationVariables>;

/**
 * __useUpdateClientUserMutation__
 *
 * To run a mutation, you first call `useUpdateClientUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientUserMutation, { data, loading, error }] = useUpdateClientUserMutation({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *      clientUserInput: // value for 'clientUserInput'
 *   },
 * });
 */
export function useUpdateClientUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientUserMutation, UpdateClientUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientUserMutation, UpdateClientUserMutationVariables>(UpdateClientUserDocument, options);
      }
export type UpdateClientUserMutationHookResult = ReturnType<typeof useUpdateClientUserMutation>;
export type UpdateClientUserMutationResult = Apollo.MutationResult<UpdateClientUserMutation>;
export type UpdateClientUserMutationOptions = Apollo.BaseMutationOptions<UpdateClientUserMutation, UpdateClientUserMutationVariables>;
export const DeleteOrganizationServiceDocument = gql`
    mutation DeleteOrganizationService($uuid: String!) {
  deleteOrganizationService(uuid: $uuid) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteOrganizationServiceMutationFn = Apollo.MutationFunction<DeleteOrganizationServiceMutation, DeleteOrganizationServiceMutationVariables>;

/**
 * __useDeleteOrganizationServiceMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationServiceMutation, { data, loading, error }] = useDeleteOrganizationServiceMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteOrganizationServiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationServiceMutation, DeleteOrganizationServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganizationServiceMutation, DeleteOrganizationServiceMutationVariables>(DeleteOrganizationServiceDocument, options);
      }
export type DeleteOrganizationServiceMutationHookResult = ReturnType<typeof useDeleteOrganizationServiceMutation>;
export type DeleteOrganizationServiceMutationResult = Apollo.MutationResult<DeleteOrganizationServiceMutation>;
export type DeleteOrganizationServiceMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationServiceMutation, DeleteOrganizationServiceMutationVariables>;
export const UpdateOrganizationServiceDocument = gql`
    mutation UpdateOrganizationService($standardInvoiceItemInput: StandardInvoiceItemInput!) {
  updateOrganizationService(standardInvoiceItemInput: $standardInvoiceItemInput) {
    error {
      ...Error
    }
    service {
      ...StandardInvoiceItem
    }
  }
}
    ${ErrorFragmentDoc}
${StandardInvoiceItemFragmentDoc}`;
export type UpdateOrganizationServiceMutationFn = Apollo.MutationFunction<UpdateOrganizationServiceMutation, UpdateOrganizationServiceMutationVariables>;

/**
 * __useUpdateOrganizationServiceMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationServiceMutation, { data, loading, error }] = useUpdateOrganizationServiceMutation({
 *   variables: {
 *      standardInvoiceItemInput: // value for 'standardInvoiceItemInput'
 *   },
 * });
 */
export function useUpdateOrganizationServiceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrganizationServiceMutation, UpdateOrganizationServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrganizationServiceMutation, UpdateOrganizationServiceMutationVariables>(UpdateOrganizationServiceDocument, options);
      }
export type UpdateOrganizationServiceMutationHookResult = ReturnType<typeof useUpdateOrganizationServiceMutation>;
export type UpdateOrganizationServiceMutationResult = Apollo.MutationResult<UpdateOrganizationServiceMutation>;
export type UpdateOrganizationServiceMutationOptions = Apollo.BaseMutationOptions<UpdateOrganizationServiceMutation, UpdateOrganizationServiceMutationVariables>;
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
  client(uuid: $clientUuid) {
    uuid
    files {
      ...File
    }
  }
}
    ${FileFragmentDoc}`;

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
    totalsByCurrency {
      currency
      total
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
export const ClientProgramManagersDocument = gql`
    query ClientProgramManagers {
  clientProgramManagers {
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
export const ClientUsersDocument = gql`
    query ClientUsers($clientUuid: String!) {
  clientUsers(clientUuid: $clientUuid) {
    ...ClientUser
  }
}
    ${ClientUserFragmentDoc}`;

/**
 * __useClientUsersQuery__
 *
 * To run a query within a React component, call `useClientUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientUsersQuery({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *   },
 * });
 */
export function useClientUsersQuery(baseOptions: Apollo.QueryHookOptions<ClientUsersQuery, ClientUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientUsersQuery, ClientUsersQueryVariables>(ClientUsersDocument, options);
      }
export function useClientUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientUsersQuery, ClientUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientUsersQuery, ClientUsersQueryVariables>(ClientUsersDocument, options);
        }
export function useClientUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientUsersQuery, ClientUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientUsersQuery, ClientUsersQueryVariables>(ClientUsersDocument, options);
        }
export type ClientUsersQueryHookResult = ReturnType<typeof useClientUsersQuery>;
export type ClientUsersLazyQueryHookResult = ReturnType<typeof useClientUsersLazyQuery>;
export type ClientUsersSuspenseQueryHookResult = ReturnType<typeof useClientUsersSuspenseQuery>;
export type ClientUsersQueryResult = Apollo.QueryResult<ClientUsersQuery, ClientUsersQueryVariables>;
export const OrganizationServicesDocument = gql`
    query OrganizationServices {
  organizationServices {
    ...StandardInvoiceItem
  }
}
    ${StandardInvoiceItemFragmentDoc}`;

/**
 * __useOrganizationServicesQuery__
 *
 * To run a query within a React component, call `useOrganizationServicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationServicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationServicesQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationServicesQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationServicesQuery, OrganizationServicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationServicesQuery, OrganizationServicesQueryVariables>(OrganizationServicesDocument, options);
      }
export function useOrganizationServicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationServicesQuery, OrganizationServicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationServicesQuery, OrganizationServicesQueryVariables>(OrganizationServicesDocument, options);
        }
export function useOrganizationServicesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationServicesQuery, OrganizationServicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationServicesQuery, OrganizationServicesQueryVariables>(OrganizationServicesDocument, options);
        }
export type OrganizationServicesQueryHookResult = ReturnType<typeof useOrganizationServicesQuery>;
export type OrganizationServicesLazyQueryHookResult = ReturnType<typeof useOrganizationServicesLazyQuery>;
export type OrganizationServicesSuspenseQueryHookResult = ReturnType<typeof useOrganizationServicesSuspenseQuery>;
export type OrganizationServicesQueryResult = Apollo.QueryResult<OrganizationServicesQuery, OrganizationServicesQueryVariables>;