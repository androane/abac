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

export type ActivityCategoryType = {
  __typename?: 'ActivityCategoryType';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type ActivityInput = {
  categoryCode: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  unitCost?: InputMaybe<Scalars['Int']['input']>;
  unitCostCurrency: CurrencyEnum;
  unitCostType: UnitCostTypeEnum;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type ActivityType = {
  __typename?: 'ActivityType';
  category: ActivityCategoryType;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  /** Cost of the Activity per unit type */
  unitCost?: Maybe<Scalars['Int']['output']>;
  unitCostCurrency: CurrencyEnum;
  unitCostType: UnitCostTypeEnum;
  uuid: Scalars['String']['output'];
};

export type ChangePassword = {
  __typename?: 'ChangePassword';
  error?: Maybe<ErrorType>;
  token?: Maybe<Scalars['String']['output']>;
};

export type ClientActivityInput = {
  isExecuted: Scalars['Boolean']['input'];
  month: Scalars['Int']['input'];
  uuid?: InputMaybe<Scalars['String']['input']>;
  year: Scalars['Int']['input'];
};

export type ClientActivityLogType = {
  __typename?: 'ClientActivityLogType';
  /** Date when the activity was executed */
  date?: Maybe<Scalars['Date']['output']>;
  /** Optional explanation for the log */
  description?: Maybe<Scalars['String']['output']>;
  /** Number of minutes allocated to the customer for this activity */
  minutesAllocated?: Maybe<Scalars['Int']['output']>;
  /** How many of these activities */
  quantity: Scalars['Int']['output'];
  uuid: Scalars['String']['output'];
};

export type ClientActivityType = {
  __typename?: 'ClientActivityType';
  activity: ActivityType;
  /** Is the activity executed? */
  isExecuted: Scalars['Boolean']['output'];
  logs: Array<ClientActivityLogType>;
  /** Month of the Activity */
  month: Scalars['Int']['output'];
  uuid: Scalars['String']['output'];
  /** Year of the Activity */
  year: Scalars['Int']['output'];
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

export type ClientInput = {
  clientSolutions: Array<ClientSolutionInput>;
  cui?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
  spvPassword?: InputMaybe<Scalars['String']['input']>;
  spvUsername?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type ClientSolutionInput = {
  solutionUuid: Scalars['String']['input'];
  unitCost?: InputMaybe<Scalars['Int']['input']>;
  unitCostCurrency: CurrencyEnum;
};

export type ClientType = {
  __typename?: 'ClientType';
  activities: Array<ClientActivityType>;
  /** CUI - Cod Unic de Identificare */
  cui?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  files: Array<ClientFileType>;
  name: Scalars['String']['output'];
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

export type DeleteClientActivity = {
  __typename?: 'DeleteClientActivity';
  error?: Maybe<ErrorType>;
};

export type DeleteClientFile = {
  __typename?: 'DeleteClientFile';
  error?: Maybe<ErrorType>;
};

export type DeleteClientUser = {
  __typename?: 'DeleteClientUser';
  error?: Maybe<ErrorType>;
};

export type DeleteOrganizationActivity = {
  __typename?: 'DeleteOrganizationActivity';
  error?: Maybe<ErrorType>;
};

export type DeleteOrganizationSolution = {
  __typename?: 'DeleteOrganizationSolution';
  error?: Maybe<ErrorType>;
};

export type ErrorType = {
  __typename?: 'ErrorType';
  field?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type InvoiceItemType = {
  __typename?: 'InvoiceItemType';
  created: Scalars['DateTime']['output'];
  deleted?: Maybe<Scalars['DateTime']['output']>;
  deletedByCascade: Scalars['Boolean']['output'];
  /** Optional explanation for the invoice item */
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoice: InvoiceType;
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
  /** Price of the invoice item per unit type */
  unitPrice: Scalars['Int']['output'];
  unitPriceCurrency: OrganizationInvoiceItemUnitPriceCurrencyChoices;
  /** The type of the invoice item can be fixed, per hour etc */
  unitPriceType: OrganizationInvoiceItemUnitPriceTypeChoices;
  updated: Scalars['DateTime']['output'];
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
  /** Delete a Client Activity */
  deleteClientActivity?: Maybe<DeleteClientActivity>;
  /** Delete a Client File */
  deleteClientFile?: Maybe<DeleteClientFile>;
  /** Delete a Client User */
  deleteClientUser?: Maybe<DeleteClientUser>;
  /** Delete an Organization Activity */
  deleteOrganizationActivity?: Maybe<DeleteOrganizationActivity>;
  /** Delete an Organization Solution */
  deleteOrganizationSolution?: Maybe<DeleteOrganizationSolution>;
  /** Log the user in with email and password. */
  login?: Maybe<LoginUser>;
  /** Log out user. */
  logout?: Maybe<LogoutUser>;
  /** Toggle Client Activity Executed Status */
  toggleClientActivity?: Maybe<ToggleClientActivity>;
  /** Update or Create a New Client */
  updateClient?: Maybe<UpdateClient>;
  /** Update or Create a New Client Activity */
  updateClientActivity?: Maybe<UpdateClientActivity>;
  /** Update Client Invoice Status */
  updateClientInvoiceStatus?: Maybe<UpdateClientInvoiceStatus>;
  /** Update or Create a New Client User */
  updateClientUser?: Maybe<UpdateClientUser>;
  /** Update or Create a New Activity */
  updateOrganizationActivity?: Maybe<UpdateOrganizationActivity>;
  /** Update or Create a New Solution */
  updateOrganizationSolution?: Maybe<UpdateOrganizationSolution>;
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


export type MutationDeleteClientActivityArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteClientFileArgs = {
  fileUuid: Scalars['String']['input'];
};


export type MutationDeleteClientUserArgs = {
  userUuid: Scalars['String']['input'];
};


export type MutationDeleteOrganizationActivityArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteOrganizationSolutionArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationToggleClientActivityArgs = {
  activityUuid: Scalars['String']['input'];
  clientActivityInput: ClientActivityInput;
  clientUuid: Scalars['String']['input'];
};


export type MutationUpdateClientArgs = {
  clientInput: ClientInput;
};


export type MutationUpdateClientActivityArgs = {
  activityInput: ActivityInput;
  clientActivityInput: ClientActivityInput;
  clientUuid: Scalars['String']['input'];
};


export type MutationUpdateClientInvoiceStatusArgs = {
  invoiceUuid: Scalars['String']['input'];
  status: InvoiceStatusEnum;
};


export type MutationUpdateClientUserArgs = {
  clientUserInput: ClientUserInput;
  clientUuid: Scalars['String']['input'];
};


export type MutationUpdateOrganizationActivityArgs = {
  activityInput: ActivityInput;
};


export type MutationUpdateOrganizationSolutionArgs = {
  solutionInput: SolutionInput;
};

/** An enumeration. */
export enum OrganizationInvoiceItemUnitPriceCurrencyChoices {
  /** Eur */
  EUR = 'EUR',
  /** Ron */
  RON = 'RON',
  /** Usd */
  USD = 'USD'
}

/** An enumeration. */
export enum OrganizationInvoiceItemUnitPriceTypeChoices {
  /** Fixed */
  FIXED = 'FIXED',
  /** Hourly */
  HOURLY = 'HOURLY'
}

export type OrganizationType = {
  __typename?: 'OrganizationType';
  activities: Array<ActivityType>;
  logoUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  solutions: Array<SolutionType>;
  uuid: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get a Client */
  client: ClientType;
  /** List all Client Activities */
  clientActivities: Array<ClientActivityType>;
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
  /** Get an Organization */
  organization: OrganizationType;
  /** List all users */
  users: Array<UserType>;
};


export type QueryClientArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryClientActivitiesArgs = {
  clientUuid: Scalars['String']['input'];
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
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

export type SolutionInput = {
  activityUuids: Array<Scalars['String']['input']>;
  categoryCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type SolutionType = {
  __typename?: 'SolutionType';
  activities: Array<ActivityType>;
  category: ActivityCategoryType;
  name: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type ToggleClientActivity = {
  __typename?: 'ToggleClientActivity';
  clientActivityUuid: Scalars['String']['output'];
  error?: Maybe<ErrorType>;
};

export type TotalByCurrencyType = {
  __typename?: 'TotalByCurrencyType';
  currency: CurrencyEnum;
  total: Scalars['Float']['output'];
};

/** An enumeration. */
export enum UnitCostTypeEnum {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY'
}

export type UpdateClient = {
  __typename?: 'UpdateClient';
  client?: Maybe<ClientType>;
  error?: Maybe<ErrorType>;
};

export type UpdateClientActivity = {
  __typename?: 'UpdateClientActivity';
  clientActivity?: Maybe<ClientActivityType>;
  error?: Maybe<ErrorType>;
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

export type UpdateOrganizationActivity = {
  __typename?: 'UpdateOrganizationActivity';
  activity?: Maybe<ActivityType>;
  error?: Maybe<ErrorType>;
};

export type UpdateOrganizationSolution = {
  __typename?: 'UpdateOrganizationSolution';
  error?: Maybe<ErrorType>;
  solution?: Maybe<SolutionType>;
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

export type ActivityFragment = { __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'ActivityCategoryType', uuid: string, code: string, name: string } };

export type UserFragment = { __typename?: 'UserType', uuid: string, email: string, name: string, photoUrl: string, role: string, organization: { __typename?: 'OrganizationType', uuid: string, name: string, logoUrl: string } };

export type ClientFragment = { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null };

export type ClientActivityFragment = { __typename?: 'ClientActivityType', uuid: string, isExecuted: boolean };

export type ClientActivityLogFragment = { __typename?: 'ClientActivityLogType', uuid: string, date?: DateString | null, minutesAllocated?: number | null, quantity: number };

export type ClientUserFragment = { __typename?: 'UserType', uuid: string, email: string, firstName: string, lastName: string, clientProfile: { __typename?: 'ClientUserProfileType', ownershipPercentage?: number | null, role?: ClientUserRoleEnum | null, spvUsername?: string | null, spvPassword?: string | null, phoneNumber: string } };

export type ErrorFragment = { __typename?: 'ErrorType', field?: string | null, message: string };

export type FileFragment = { __typename?: 'ClientFileType', uuid: string, name: string, updated: DateTimeString, url: string, size: number };

export type InvoiceItemFragment = { __typename?: 'InvoiceItemType', uuid: string, name: string };

export type ProgramManagerFragment = { __typename?: 'UserType', uuid: string, name: string, email: string };

export type SolutionFragment = { __typename?: 'SolutionType', uuid: string, name: string, category: { __typename?: 'ActivityCategoryType', uuid: string, code: string }, activities: Array<{ __typename?: 'ActivityType', uuid: string, name: string }> };

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

export type DeleteClientActivityMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeleteClientActivityMutation = { __typename?: 'Mutation', deleteClientActivity?: { __typename?: 'DeleteClientActivity', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type DeleteClientFileMutationVariables = Exact<{
  fileUuid: Scalars['String']['input'];
}>;


export type DeleteClientFileMutation = { __typename?: 'Mutation', deleteClientFile?: { __typename?: 'DeleteClientFile', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type DeleteClientUserMutationVariables = Exact<{
  userUuid: Scalars['String']['input'];
}>;


export type DeleteClientUserMutation = { __typename?: 'Mutation', deleteClientUser?: { __typename?: 'DeleteClientUser', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type ToggleClientActivityMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  activityUuid: Scalars['String']['input'];
  clientActivityInput: ClientActivityInput;
}>;


export type ToggleClientActivityMutation = { __typename?: 'Mutation', toggleClientActivity?: { __typename?: 'ToggleClientActivity', clientActivityUuid: string, error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type UpdateClientMutationVariables = Exact<{
  clientInput: ClientInput;
}>;


export type UpdateClientMutation = { __typename?: 'Mutation', updateClient?: { __typename?: 'UpdateClient', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, client?: { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null } | null } | null };

export type UpdateClientActivityMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  activityInput: ActivityInput;
  clientActivityInput: ClientActivityInput;
}>;


export type UpdateClientActivityMutation = { __typename?: 'Mutation', updateClientActivity?: { __typename?: 'UpdateClientActivity', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, clientActivity?: { __typename?: 'ClientActivityType', uuid: string, isExecuted: boolean, activity: { __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'ActivityCategoryType', uuid: string, code: string, name: string } } } | null } | null };

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

export type DeleteOrganizationActivityMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeleteOrganizationActivityMutation = { __typename?: 'Mutation', deleteOrganizationActivity?: { __typename?: 'DeleteOrganizationActivity', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type DeleteOrganizationSolutionMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeleteOrganizationSolutionMutation = { __typename?: 'Mutation', deleteOrganizationSolution?: { __typename?: 'DeleteOrganizationSolution', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type UpdateOrganizationActivityMutationVariables = Exact<{
  activityInput: ActivityInput;
}>;


export type UpdateOrganizationActivityMutation = { __typename?: 'Mutation', updateOrganizationActivity?: { __typename?: 'UpdateOrganizationActivity', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, activity?: { __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'ActivityCategoryType', uuid: string, code: string, name: string } } | null } | null };

export type UpdateOrganizationSolutionMutationVariables = Exact<{
  solutionInput: SolutionInput;
}>;


export type UpdateOrganizationSolutionMutation = { __typename?: 'Mutation', updateOrganizationSolution?: { __typename?: 'UpdateOrganizationSolution', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, solution?: { __typename?: 'SolutionType', uuid: string, name: string, category: { __typename?: 'ActivityCategoryType', uuid: string, code: string }, activities: Array<{ __typename?: 'ActivityType', uuid: string, name: string }> } | null } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'UserType', uuid: string, email: string, name: string, photoUrl: string, role: string, organization: { __typename?: 'OrganizationType', uuid: string, name: string, logoUrl: string } } };

export type ClientActivitiesQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ClientActivitiesQuery = { __typename?: 'Query', clientActivities: Array<{ __typename?: 'ClientActivityType', uuid: string, isExecuted: boolean, activity: { __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'ActivityCategoryType', uuid: string, code: string, name: string } }, logs: Array<{ __typename?: 'ClientActivityLogType', uuid: string, date?: DateString | null, minutesAllocated?: number | null, quantity: number }> }> };

export type ClientsQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientsQuery = { __typename?: 'Query', clients: Array<{ __typename?: 'ClientType', uuid: string, name: string, description?: string | null, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null }> };

export type ClientFilesQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
}>;


export type ClientFilesQuery = { __typename?: 'Query', client: { __typename?: 'ClientType', uuid: string, files: Array<{ __typename?: 'ClientFileType', uuid: string, name: string, updated: DateTimeString, url: string, size: number }> } };

export type ClientInvoiceQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ClientInvoiceQuery = { __typename?: 'Query', clientInvoice: { __typename?: 'InvoiceType', uuid: string, month: number, year: number, dateSent?: DateString | null, items: Array<{ __typename?: 'InvoiceItemType', uuid: string, name: string }>, totalsByCurrency: Array<{ __typename?: 'TotalByCurrencyType', currency: CurrencyEnum, total: number }> } };

export type ClientProgramManagersQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientProgramManagersQuery = { __typename?: 'Query', clientProgramManagers: Array<{ __typename?: 'UserType', uuid: string, name: string, email: string }> };

export type ClientUsersQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
}>;


export type ClientUsersQuery = { __typename?: 'Query', clientUsers: Array<{ __typename?: 'UserType', uuid: string, email: string, firstName: string, lastName: string, clientProfile: { __typename?: 'ClientUserProfileType', ownershipPercentage?: number | null, role?: ClientUserRoleEnum | null, spvUsername?: string | null, spvPassword?: string | null, phoneNumber: string } }> };

export type OrganizationActivitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationActivitiesQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationType', uuid: string, activities: Array<{ __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'ActivityCategoryType', uuid: string, code: string, name: string } }> } };

export type OrganizationSolutionsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationSolutionsQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationType', uuid: string, solutions: Array<{ __typename?: 'SolutionType', uuid: string, name: string, category: { __typename?: 'ActivityCategoryType', uuid: string, code: string }, activities: Array<{ __typename?: 'ActivityType', uuid: string, name: string }> }> } };

export const ActivityFragmentDoc = gql`
    fragment Activity on ActivityType {
  uuid
  name
  description
  unitCost
  unitCostCurrency
  unitCostType
  category {
    uuid
    code
    name
  }
}
    `;
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
  programManager {
    uuid
    name
  }
  cui
  spvUsername
  spvPassword
}
    `;
export const ClientActivityFragmentDoc = gql`
    fragment ClientActivity on ClientActivityType {
  uuid
  isExecuted
}
    `;
export const ClientActivityLogFragmentDoc = gql`
    fragment ClientActivityLog on ClientActivityLogType {
  uuid
  date
  minutesAllocated
  quantity
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
}
    `;
export const ProgramManagerFragmentDoc = gql`
    fragment ProgramManager on UserType {
  uuid
  name
  email
}
    `;
export const SolutionFragmentDoc = gql`
    fragment Solution on SolutionType {
  uuid
  name
  category {
    uuid
    code
  }
  activities {
    uuid
    name
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
export const DeleteClientActivityDocument = gql`
    mutation DeleteClientActivity($uuid: String!) {
  deleteClientActivity(uuid: $uuid) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteClientActivityMutationFn = Apollo.MutationFunction<DeleteClientActivityMutation, DeleteClientActivityMutationVariables>;

/**
 * __useDeleteClientActivityMutation__
 *
 * To run a mutation, you first call `useDeleteClientActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClientActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClientActivityMutation, { data, loading, error }] = useDeleteClientActivityMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteClientActivityMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClientActivityMutation, DeleteClientActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteClientActivityMutation, DeleteClientActivityMutationVariables>(DeleteClientActivityDocument, options);
      }
export type DeleteClientActivityMutationHookResult = ReturnType<typeof useDeleteClientActivityMutation>;
export type DeleteClientActivityMutationResult = Apollo.MutationResult<DeleteClientActivityMutation>;
export type DeleteClientActivityMutationOptions = Apollo.BaseMutationOptions<DeleteClientActivityMutation, DeleteClientActivityMutationVariables>;
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
export const ToggleClientActivityDocument = gql`
    mutation ToggleClientActivity($clientUuid: String!, $activityUuid: String!, $clientActivityInput: ClientActivityInput!) {
  toggleClientActivity(
    clientUuid: $clientUuid
    activityUuid: $activityUuid
    clientActivityInput: $clientActivityInput
  ) {
    error {
      ...Error
    }
    clientActivityUuid
  }
}
    ${ErrorFragmentDoc}`;
export type ToggleClientActivityMutationFn = Apollo.MutationFunction<ToggleClientActivityMutation, ToggleClientActivityMutationVariables>;

/**
 * __useToggleClientActivityMutation__
 *
 * To run a mutation, you first call `useToggleClientActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleClientActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleClientActivityMutation, { data, loading, error }] = useToggleClientActivityMutation({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *      activityUuid: // value for 'activityUuid'
 *      clientActivityInput: // value for 'clientActivityInput'
 *   },
 * });
 */
export function useToggleClientActivityMutation(baseOptions?: Apollo.MutationHookOptions<ToggleClientActivityMutation, ToggleClientActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleClientActivityMutation, ToggleClientActivityMutationVariables>(ToggleClientActivityDocument, options);
      }
export type ToggleClientActivityMutationHookResult = ReturnType<typeof useToggleClientActivityMutation>;
export type ToggleClientActivityMutationResult = Apollo.MutationResult<ToggleClientActivityMutation>;
export type ToggleClientActivityMutationOptions = Apollo.BaseMutationOptions<ToggleClientActivityMutation, ToggleClientActivityMutationVariables>;
export const UpdateClientDocument = gql`
    mutation UpdateClient($clientInput: ClientInput!) {
  updateClient(clientInput: $clientInput) {
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
 *      clientInput: // value for 'clientInput'
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
export const UpdateClientActivityDocument = gql`
    mutation UpdateClientActivity($clientUuid: String!, $activityInput: ActivityInput!, $clientActivityInput: ClientActivityInput!) {
  updateClientActivity(
    clientUuid: $clientUuid
    activityInput: $activityInput
    clientActivityInput: $clientActivityInput
  ) {
    error {
      ...Error
    }
    clientActivity {
      ...ClientActivity
      activity {
        ...Activity
      }
    }
  }
}
    ${ErrorFragmentDoc}
${ClientActivityFragmentDoc}
${ActivityFragmentDoc}`;
export type UpdateClientActivityMutationFn = Apollo.MutationFunction<UpdateClientActivityMutation, UpdateClientActivityMutationVariables>;

/**
 * __useUpdateClientActivityMutation__
 *
 * To run a mutation, you first call `useUpdateClientActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientActivityMutation, { data, loading, error }] = useUpdateClientActivityMutation({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *      activityInput: // value for 'activityInput'
 *      clientActivityInput: // value for 'clientActivityInput'
 *   },
 * });
 */
export function useUpdateClientActivityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientActivityMutation, UpdateClientActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientActivityMutation, UpdateClientActivityMutationVariables>(UpdateClientActivityDocument, options);
      }
export type UpdateClientActivityMutationHookResult = ReturnType<typeof useUpdateClientActivityMutation>;
export type UpdateClientActivityMutationResult = Apollo.MutationResult<UpdateClientActivityMutation>;
export type UpdateClientActivityMutationOptions = Apollo.BaseMutationOptions<UpdateClientActivityMutation, UpdateClientActivityMutationVariables>;
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
export const DeleteOrganizationActivityDocument = gql`
    mutation DeleteOrganizationActivity($uuid: String!) {
  deleteOrganizationActivity(uuid: $uuid) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteOrganizationActivityMutationFn = Apollo.MutationFunction<DeleteOrganizationActivityMutation, DeleteOrganizationActivityMutationVariables>;

/**
 * __useDeleteOrganizationActivityMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationActivityMutation, { data, loading, error }] = useDeleteOrganizationActivityMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteOrganizationActivityMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationActivityMutation, DeleteOrganizationActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganizationActivityMutation, DeleteOrganizationActivityMutationVariables>(DeleteOrganizationActivityDocument, options);
      }
export type DeleteOrganizationActivityMutationHookResult = ReturnType<typeof useDeleteOrganizationActivityMutation>;
export type DeleteOrganizationActivityMutationResult = Apollo.MutationResult<DeleteOrganizationActivityMutation>;
export type DeleteOrganizationActivityMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationActivityMutation, DeleteOrganizationActivityMutationVariables>;
export const DeleteOrganizationSolutionDocument = gql`
    mutation DeleteOrganizationSolution($uuid: String!) {
  deleteOrganizationSolution(uuid: $uuid) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteOrganizationSolutionMutationFn = Apollo.MutationFunction<DeleteOrganizationSolutionMutation, DeleteOrganizationSolutionMutationVariables>;

/**
 * __useDeleteOrganizationSolutionMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationSolutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationSolutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationSolutionMutation, { data, loading, error }] = useDeleteOrganizationSolutionMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteOrganizationSolutionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationSolutionMutation, DeleteOrganizationSolutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganizationSolutionMutation, DeleteOrganizationSolutionMutationVariables>(DeleteOrganizationSolutionDocument, options);
      }
export type DeleteOrganizationSolutionMutationHookResult = ReturnType<typeof useDeleteOrganizationSolutionMutation>;
export type DeleteOrganizationSolutionMutationResult = Apollo.MutationResult<DeleteOrganizationSolutionMutation>;
export type DeleteOrganizationSolutionMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationSolutionMutation, DeleteOrganizationSolutionMutationVariables>;
export const UpdateOrganizationActivityDocument = gql`
    mutation UpdateOrganizationActivity($activityInput: ActivityInput!) {
  updateOrganizationActivity(activityInput: $activityInput) {
    error {
      ...Error
    }
    activity {
      ...Activity
    }
  }
}
    ${ErrorFragmentDoc}
${ActivityFragmentDoc}`;
export type UpdateOrganizationActivityMutationFn = Apollo.MutationFunction<UpdateOrganizationActivityMutation, UpdateOrganizationActivityMutationVariables>;

/**
 * __useUpdateOrganizationActivityMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationActivityMutation, { data, loading, error }] = useUpdateOrganizationActivityMutation({
 *   variables: {
 *      activityInput: // value for 'activityInput'
 *   },
 * });
 */
export function useUpdateOrganizationActivityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrganizationActivityMutation, UpdateOrganizationActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrganizationActivityMutation, UpdateOrganizationActivityMutationVariables>(UpdateOrganizationActivityDocument, options);
      }
export type UpdateOrganizationActivityMutationHookResult = ReturnType<typeof useUpdateOrganizationActivityMutation>;
export type UpdateOrganizationActivityMutationResult = Apollo.MutationResult<UpdateOrganizationActivityMutation>;
export type UpdateOrganizationActivityMutationOptions = Apollo.BaseMutationOptions<UpdateOrganizationActivityMutation, UpdateOrganizationActivityMutationVariables>;
export const UpdateOrganizationSolutionDocument = gql`
    mutation UpdateOrganizationSolution($solutionInput: SolutionInput!) {
  updateOrganizationSolution(solutionInput: $solutionInput) {
    error {
      ...Error
    }
    solution {
      ...Solution
    }
  }
}
    ${ErrorFragmentDoc}
${SolutionFragmentDoc}`;
export type UpdateOrganizationSolutionMutationFn = Apollo.MutationFunction<UpdateOrganizationSolutionMutation, UpdateOrganizationSolutionMutationVariables>;

/**
 * __useUpdateOrganizationSolutionMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationSolutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationSolutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationSolutionMutation, { data, loading, error }] = useUpdateOrganizationSolutionMutation({
 *   variables: {
 *      solutionInput: // value for 'solutionInput'
 *   },
 * });
 */
export function useUpdateOrganizationSolutionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrganizationSolutionMutation, UpdateOrganizationSolutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrganizationSolutionMutation, UpdateOrganizationSolutionMutationVariables>(UpdateOrganizationSolutionDocument, options);
      }
export type UpdateOrganizationSolutionMutationHookResult = ReturnType<typeof useUpdateOrganizationSolutionMutation>;
export type UpdateOrganizationSolutionMutationResult = Apollo.MutationResult<UpdateOrganizationSolutionMutation>;
export type UpdateOrganizationSolutionMutationOptions = Apollo.BaseMutationOptions<UpdateOrganizationSolutionMutation, UpdateOrganizationSolutionMutationVariables>;
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
export const ClientActivitiesDocument = gql`
    query ClientActivities($clientUuid: String!, $year: Int, $month: Int) {
  clientActivities(clientUuid: $clientUuid, year: $year, month: $month) {
    ...ClientActivity
    activity {
      ...Activity
    }
    logs {
      ...ClientActivityLog
    }
  }
}
    ${ClientActivityFragmentDoc}
${ActivityFragmentDoc}
${ClientActivityLogFragmentDoc}`;

/**
 * __useClientActivitiesQuery__
 *
 * To run a query within a React component, call `useClientActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientActivitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientActivitiesQuery({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *      year: // value for 'year'
 *      month: // value for 'month'
 *   },
 * });
 */
export function useClientActivitiesQuery(baseOptions: Apollo.QueryHookOptions<ClientActivitiesQuery, ClientActivitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientActivitiesQuery, ClientActivitiesQueryVariables>(ClientActivitiesDocument, options);
      }
export function useClientActivitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientActivitiesQuery, ClientActivitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientActivitiesQuery, ClientActivitiesQueryVariables>(ClientActivitiesDocument, options);
        }
export function useClientActivitiesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientActivitiesQuery, ClientActivitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientActivitiesQuery, ClientActivitiesQueryVariables>(ClientActivitiesDocument, options);
        }
export type ClientActivitiesQueryHookResult = ReturnType<typeof useClientActivitiesQuery>;
export type ClientActivitiesLazyQueryHookResult = ReturnType<typeof useClientActivitiesLazyQuery>;
export type ClientActivitiesSuspenseQueryHookResult = ReturnType<typeof useClientActivitiesSuspenseQuery>;
export type ClientActivitiesQueryResult = Apollo.QueryResult<ClientActivitiesQuery, ClientActivitiesQueryVariables>;
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
export const OrganizationActivitiesDocument = gql`
    query OrganizationActivities {
  organization {
    uuid
    activities {
      ...Activity
    }
  }
}
    ${ActivityFragmentDoc}`;

/**
 * __useOrganizationActivitiesQuery__
 *
 * To run a query within a React component, call `useOrganizationActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationActivitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationActivitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationActivitiesQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationActivitiesQuery, OrganizationActivitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationActivitiesQuery, OrganizationActivitiesQueryVariables>(OrganizationActivitiesDocument, options);
      }
export function useOrganizationActivitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationActivitiesQuery, OrganizationActivitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationActivitiesQuery, OrganizationActivitiesQueryVariables>(OrganizationActivitiesDocument, options);
        }
export function useOrganizationActivitiesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationActivitiesQuery, OrganizationActivitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationActivitiesQuery, OrganizationActivitiesQueryVariables>(OrganizationActivitiesDocument, options);
        }
export type OrganizationActivitiesQueryHookResult = ReturnType<typeof useOrganizationActivitiesQuery>;
export type OrganizationActivitiesLazyQueryHookResult = ReturnType<typeof useOrganizationActivitiesLazyQuery>;
export type OrganizationActivitiesSuspenseQueryHookResult = ReturnType<typeof useOrganizationActivitiesSuspenseQuery>;
export type OrganizationActivitiesQueryResult = Apollo.QueryResult<OrganizationActivitiesQuery, OrganizationActivitiesQueryVariables>;
export const OrganizationSolutionsDocument = gql`
    query OrganizationSolutions {
  organization {
    uuid
    solutions {
      ...Solution
    }
  }
}
    ${SolutionFragmentDoc}`;

/**
 * __useOrganizationSolutionsQuery__
 *
 * To run a query within a React component, call `useOrganizationSolutionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationSolutionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationSolutionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationSolutionsQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationSolutionsQuery, OrganizationSolutionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationSolutionsQuery, OrganizationSolutionsQueryVariables>(OrganizationSolutionsDocument, options);
      }
export function useOrganizationSolutionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationSolutionsQuery, OrganizationSolutionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationSolutionsQuery, OrganizationSolutionsQueryVariables>(OrganizationSolutionsDocument, options);
        }
export function useOrganizationSolutionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationSolutionsQuery, OrganizationSolutionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationSolutionsQuery, OrganizationSolutionsQueryVariables>(OrganizationSolutionsDocument, options);
        }
export type OrganizationSolutionsQueryHookResult = ReturnType<typeof useOrganizationSolutionsQuery>;
export type OrganizationSolutionsLazyQueryHookResult = ReturnType<typeof useOrganizationSolutionsLazyQuery>;
export type OrganizationSolutionsSuspenseQueryHookResult = ReturnType<typeof useOrganizationSolutionsSuspenseQuery>;
export type OrganizationSolutionsQueryResult = Apollo.QueryResult<OrganizationSolutionsQuery, OrganizationSolutionsQueryVariables>;