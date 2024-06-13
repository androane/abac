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
  category: CategoryType;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  /** Cost of the Activity per unit type */
  unitCost?: Maybe<Scalars['Int']['output']>;
  unitCostCurrency: CurrencyEnum;
  unitCostType: UnitCostTypeEnum;
  uuid: Scalars['String']['output'];
};

export type CategoryType = {
  __typename?: 'CategoryType';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type ChangePassword = {
  __typename?: 'ChangePassword';
  error?: Maybe<ErrorType>;
  token?: Maybe<Scalars['String']['output']>;
};

export type ClientActivityInput = {
  isRecurrent?: InputMaybe<Scalars['Boolean']['input']>;
  month: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  uuid?: InputMaybe<Scalars['String']['input']>;
  year: Scalars['Int']['input'];
};

export type ClientActivityLogType = {
  __typename?: 'ClientActivityLogType';
  /** Date when the activity was executed */
  date: Scalars['Date']['output'];
  /** Optional explanation for the log */
  description?: Maybe<Scalars['String']['output']>;
  /** Number of minutes allocated for this activity */
  minutesAllocated: Scalars['Int']['output'];
  uuid: Scalars['String']['output'];
};

export type ClientActivityType = {
  __typename?: 'ClientActivityType';
  activity: ActivityType;
  /** Is the activity executed? */
  isExecuted: Scalars['Boolean']['output'];
  /** Is the activity recurrent? */
  isRecurrent: Scalars['Boolean']['output'];
  logs: Array<ClientActivityLogType>;
  /** Month of the Activity */
  month: Scalars['Int']['output'];
  /** Quantity of the Activity */
  quantity: Scalars['Int']['output'];
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

export type ClientGroupInput = {
  clientUuids: Array<InputMaybe<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type ClientGroupType = {
  __typename?: 'ClientGroupType';
  clients: Array<ClientType>;
  name: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type ClientInput = {
  clientSolutions: Array<InputMaybe<ClientSolutionInput>>;
  cui?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  programManagerUuid?: InputMaybe<Scalars['String']['input']>;
  softwares?: InputMaybe<Array<ClientSoftwareInput>>;
  spvPassword?: InputMaybe<Scalars['String']['input']>;
  spvUsername?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type ClientSoftwareInput = {
  password?: InputMaybe<Scalars['String']['input']>;
  software: SoftwareEnum;
  username?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type ClientSoftwareType = {
  __typename?: 'ClientSoftwareType';
  password?: Maybe<Scalars['String']['output']>;
  software: SoftwareEnum;
  username?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['String']['output'];
};

export type ClientSolutionInput = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  solutionUuid?: InputMaybe<Scalars['String']['input']>;
  unitCost?: InputMaybe<Scalars['Int']['input']>;
  unitCostCurrency?: InputMaybe<CurrencyEnum>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type ClientSolutionLogType = {
  __typename?: 'ClientSolutionLogType';
  /** Date when the activity was executed */
  date: Scalars['Date']['output'];
  /** Optional explanation for the log */
  description?: Maybe<Scalars['String']['output']>;
  /** Number of minutes allocated for this activity */
  minutesAllocated: Scalars['Int']['output'];
  uuid: Scalars['String']['output'];
};

export type ClientSolutionType = {
  __typename?: 'ClientSolutionType';
  logs: Array<ClientSolutionLogType>;
  /** Quantity of the Activity */
  quantity: Scalars['Int']['output'];
  solution: SolutionType;
  unitCost?: Maybe<Scalars['Int']['output']>;
  unitCostCurrency: CurrencyEnum;
  uuid: Scalars['String']['output'];
};

export type ClientType = {
  __typename?: 'ClientType';
  activities: Array<ClientActivityType>;
  activity: ClientActivityType;
  /** CUI - Cod Unic de Identificare */
  cui?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  files: Array<ClientFileType>;
  /** Multiple Clients can be a part of the same group of clients */
  group?: Maybe<ClientGroupType>;
  invoice: InvoiceType;
  name: Scalars['String']['output'];
  programManager?: Maybe<UserType>;
  softwares: Array<ClientSoftwareType>;
  solution: ClientSolutionType;
  solutions: Array<ClientSolutionType>;
  /** SPV Password */
  spvPassword?: Maybe<Scalars['String']['output']>;
  /** SPV Username */
  spvUsername?: Maybe<Scalars['String']['output']>;
  users: Array<UserType>;
  uuid: Scalars['String']['output'];
};


export type ClientTypeActivitiesArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type ClientTypeActivityArgs = {
  uuid: Scalars['String']['input'];
};


export type ClientTypeInvoiceArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type ClientTypeSolutionArgs = {
  uuid: Scalars['String']['input'];
};


export type ClientTypeSolutionsArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type ClientUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  ownershipPercentage?: InputMaybe<Scalars['Int']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<ClientUserRoleEnum>;
  showInGroup?: InputMaybe<Scalars['Boolean']['input']>;
  spvEmail?: InputMaybe<Scalars['String']['input']>;
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
  /** If true, the user will show for all clients in the same group */
  showInGroup: Scalars['Boolean']['output'];
  /** SPV Email */
  spvEmail?: Maybe<Scalars['String']['output']>;
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

export type DeleteClientGroup = {
  __typename?: 'DeleteClientGroup';
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

export type GenerateReport = {
  __typename?: 'GenerateReport';
  downloadUrl: Scalars['String']['output'];
  error?: Maybe<ErrorType>;
};

export type InvoiceItemType = {
  __typename?: 'InvoiceItemType';
  category: CategoryType;
  cost: Scalars['Float']['output'];
  currency: CurrencyEnum;
  quantity: Scalars['Int']['output'];
  solutionName?: Maybe<Scalars['String']['output']>;
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

export type LogInput = {
  date: Scalars['Date']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  minutesAllocated: Scalars['Int']['input'];
  uuid?: InputMaybe<Scalars['String']['input']>;
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
  /** Delete a Client Group */
  deleteClientGroup?: Maybe<DeleteClientGroup>;
  /** Delete a Client User */
  deleteClientUser?: Maybe<DeleteClientUser>;
  /** Delete an Organization Activity */
  deleteOrganizationActivity?: Maybe<DeleteOrganizationActivity>;
  /** Delete an Organization Solution */
  deleteOrganizationSolution?: Maybe<DeleteOrganizationSolution>;
  /** Generate an excel report and get a download link */
  generateReport?: Maybe<GenerateReport>;
  /** Log the user in with email and password. */
  login?: Maybe<LoginUser>;
  /** Log out user. */
  logout?: Maybe<LogoutUser>;
  /** Toggle Client Activity Executed Status */
  toggleClientActivity?: Maybe<ToggleClientActivity>;
  /** Toggle User Category Permission */
  toggleUserCategoryPermission?: Maybe<ToggleUserCategoryPermission>;
  /** Toggle User Client Permission */
  toggleUserClientPermission?: Maybe<ToggleUserClientPermission>;
  /** Toggle a permission for a given User */
  toggleUserPermission?: Maybe<ToggleUserPermission>;
  /** Update or Create a New Client */
  updateClient?: Maybe<UpdateClient>;
  /** Update or Create a New Client Activity */
  updateClientActivity?: Maybe<UpdateClientActivity>;
  /** Update Client Activity Logs */
  updateClientActivityLogs?: Maybe<UpdateClientActivityLogs>;
  /** Update or Create a New Client Group */
  updateClientGroup?: Maybe<UpdateClientGroup>;
  /** Update Client Invoice Status */
  updateClientInvoiceStatus?: Maybe<UpdateClientInvoiceStatus>;
  /** Update an existing Client Solution */
  updateClientSolution?: Maybe<UpdateClientSolution>;
  /** Update Client Solution Logs */
  updateClientSolutionLogs?: Maybe<UpdateClientSolutionLogs>;
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
  uuid: Scalars['String']['input'];
};


export type MutationDeleteClientActivityArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteClientFileArgs = {
  fileUuid: Scalars['String']['input'];
};


export type MutationDeleteClientGroupArgs = {
  uuid: Scalars['String']['input'];
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


export type MutationGenerateReportArgs = {
  activityUuids: Array<Scalars['String']['input']>;
  categoryCodes: Array<Scalars['String']['input']>;
  costMax?: InputMaybe<Scalars['Int']['input']>;
  costMin?: InputMaybe<Scalars['Int']['input']>;
  month: Scalars['Int']['input'];
  solutionUuids: Array<Scalars['String']['input']>;
  userUuids: Array<Scalars['String']['input']>;
  year: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationToggleClientActivityArgs = {
  clientActivityUuid: Scalars['String']['input'];
  clientUuid: Scalars['String']['input'];
};


export type MutationToggleUserCategoryPermissionArgs = {
  categoryUuid: Scalars['String']['input'];
  userUuid: Scalars['String']['input'];
};


export type MutationToggleUserClientPermissionArgs = {
  clientUuid: Scalars['String']['input'];
  userUuid: Scalars['String']['input'];
};


export type MutationToggleUserPermissionArgs = {
  permission: UserPermissionsEnum;
  userUuid: Scalars['String']['input'];
};


export type MutationUpdateClientArgs = {
  clientInput: ClientInput;
};


export type MutationUpdateClientActivityArgs = {
  activityInput: ActivityInput;
  clientActivityInput: ClientActivityInput;
  clientUuid: Scalars['String']['input'];
};


export type MutationUpdateClientActivityLogsArgs = {
  clientActivityUuid: Scalars['String']['input'];
  logsInput: Array<LogInput>;
};


export type MutationUpdateClientGroupArgs = {
  clientGroupInput: ClientGroupInput;
};


export type MutationUpdateClientInvoiceStatusArgs = {
  invoiceUuid: Scalars['String']['input'];
  status: InvoiceStatusEnum;
};


export type MutationUpdateClientSolutionArgs = {
  clientSolutionInput: ClientSolutionInput;
  clientUuid: Scalars['String']['input'];
};


export type MutationUpdateClientSolutionLogsArgs = {
  clientSolutionUuid: Scalars['String']['input'];
  logsInput: Array<LogInput>;
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

export type OrganizationType = {
  __typename?: 'OrganizationType';
  activities: Array<ActivityType>;
  categories: Array<CategoryType>;
  clientGroups: Array<ClientGroupType>;
  clients: Array<ClientType>;
  logoUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  solutions: Array<SolutionType>;
  user: UserType;
  users: Array<UserType>;
  uuid: Scalars['String']['output'];
};


export type OrganizationTypeActivitiesArgs = {
  excludeSolutionActivities?: InputMaybe<Scalars['Boolean']['input']>;
};


export type OrganizationTypeUserArgs = {
  uuid: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** Get a Client */
  client: ClientType;
  currentUser: UserType;
  /** Get an Organization */
  organization: OrganizationType;
  /** List all users */
  users: Array<UserType>;
};


export type QueryClientArgs = {
  uuid: Scalars['String']['input'];
};

/** An enumeration. */
export enum SoftwareEnum {
  FGO = 'FGO',
  GESTSEL = 'GESTSEL',
  NEOMANAGER = 'NEOMANAGER',
  NEXTUP = 'NEXTUP',
  NEXUS = 'NEXUS',
  OBLIO = 'OBLIO',
  ONE_C = 'ONE_C',
  ONE_C_ALIN = 'ONE_C_ALIN',
  REGES = 'REGES',
  SAGA = 'SAGA',
  SENIOR_ERP = 'SENIOR_ERP',
  SENIOR_ERP_CLIENT = 'SENIOR_ERP_CLIENT',
  SICO_FINANCIAR = 'SICO_FINANCIAR',
  SICO_GESTIUNI = 'SICO_GESTIUNI',
  SMARTBILL = 'SMARTBILL',
  TEAMAPP = 'TEAMAPP',
  WIND = 'WIND'
}

export type SolutionInput = {
  activityUuids: Array<Scalars['String']['input']>;
  categoryCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type SolutionType = {
  __typename?: 'SolutionType';
  activities: Array<ActivityType>;
  category: CategoryType;
  name: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type ToggleClientActivity = {
  __typename?: 'ToggleClientActivity';
  error?: Maybe<ErrorType>;
};

export type ToggleUserCategoryPermission = {
  __typename?: 'ToggleUserCategoryPermission';
  error?: Maybe<ErrorType>;
  user: UserType;
};

export type ToggleUserClientPermission = {
  __typename?: 'ToggleUserClientPermission';
  error?: Maybe<ErrorType>;
  user: UserType;
};

export type ToggleUserPermission = {
  __typename?: 'ToggleUserPermission';
  error?: Maybe<ErrorType>;
  user: UserType;
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

export type UpdateClientActivityLogs = {
  __typename?: 'UpdateClientActivityLogs';
  clientActivity?: Maybe<ClientActivityType>;
  error?: Maybe<ErrorType>;
};

export type UpdateClientGroup = {
  __typename?: 'UpdateClientGroup';
  clientGroup?: Maybe<ClientGroupType>;
  error?: Maybe<ErrorType>;
};

export type UpdateClientInvoiceStatus = {
  __typename?: 'UpdateClientInvoiceStatus';
  error?: Maybe<ErrorType>;
  invoice?: Maybe<InvoiceType>;
};

export type UpdateClientSolution = {
  __typename?: 'UpdateClientSolution';
  clientSolution?: Maybe<ClientSolutionType>;
  error?: Maybe<ErrorType>;
};

export type UpdateClientSolutionLogs = {
  __typename?: 'UpdateClientSolutionLogs';
  clientSolution?: Maybe<ClientSolutionType>;
  error?: Maybe<ErrorType>;
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

/** An enumeration. */
export enum UserPermissionsEnum {
  HAS_ALL_CLIENTS_ACCESS = 'HAS_ALL_CLIENTS_ACCESS',
  HAS_CLIENT_ACTIVITY_COSTS_ACCESS = 'HAS_CLIENT_ACTIVITY_COSTS_ACCESS',
  HAS_CLIENT_ADD_ACCESS = 'HAS_CLIENT_ADD_ACCESS',
  HAS_CLIENT_INFORMATION_ACCESS = 'HAS_CLIENT_INFORMATION_ACCESS',
  HAS_CLIENT_INVOICE_ACCESS = 'HAS_CLIENT_INVOICE_ACCESS',
  HAS_ORGANIZATION_ADMIN = 'HAS_ORGANIZATION_ADMIN',
  HAS_OWN_CLIENTS_ACCESS = 'HAS_OWN_CLIENTS_ACCESS',
  HAS_SETTINGS_ACCESS = 'HAS_SETTINGS_ACCESS'
}

/** An enumeration. */
export enum UserRoleEnum {
  CLIENT = 'CLIENT',
  PM = 'PM'
}

export type UserType = {
  __typename?: 'UserType';
  categories: Array<CategoryType>;
  clientProfile: ClientUserProfileType;
  clients: Array<ClientType>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organization: OrganizationType;
  permissions: Array<UserPermissionsEnum>;
  photoUrl: Scalars['String']['output'];
  role: UserRoleEnum;
  uuid: Scalars['String']['output'];
};

export type ActivityFragment = { __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } };

export type AuthUserFragment = { __typename?: 'UserType', permissions: Array<UserPermissionsEnum>, uuid: string, name: string, email: string, photoUrl: string, role: UserRoleEnum, organization: { __typename?: 'OrganizationType', uuid: string, name: string, logoUrl: string }, categories: Array<{ __typename?: 'CategoryType', uuid: string, name: string, code: string }> };

export type BaseClientFragment = { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null };

export type BaseSolutionFragment = { __typename?: 'SolutionType', uuid: string, name: string, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } };

export type BaseUserFragment = { __typename?: 'UserType', uuid: string, name: string, email: string, photoUrl: string, role: UserRoleEnum };

export type CategoryFragment = { __typename?: 'CategoryType', uuid: string, name: string, code: string };

export type ClientFragment = { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, solutions: Array<{ __typename?: 'ClientSolutionType', uuid: string, unitCost?: number | null, unitCostCurrency: CurrencyEnum, quantity: number, solution: { __typename?: 'SolutionType', uuid: string, name: string, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } } }>, softwares: Array<{ __typename?: 'ClientSoftwareType', uuid: string, software: SoftwareEnum, username?: string | null, password?: string | null }>, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null };

export type ClientActivityFragment = { __typename?: 'ClientActivityType', uuid: string, isExecuted: boolean, isRecurrent: boolean, quantity: number };

export type ClientActivityLogFragment = { __typename?: 'ClientActivityLogType', uuid: string, date: DateString, minutesAllocated: number, description?: string | null };

export type ClientGroupFragment = { __typename?: 'ClientGroupType', uuid: string, name: string, clients: Array<{ __typename?: 'ClientType', uuid: string, name: string }> };

export type ClientSolutionFragment = { __typename?: 'ClientSolutionType', uuid: string, unitCost?: number | null, unitCostCurrency: CurrencyEnum, quantity: number, solution: { __typename?: 'SolutionType', uuid: string, name: string, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } } };

export type ClientSolutionLogFragment = { __typename?: 'ClientSolutionLogType', uuid: string, date: DateString, minutesAllocated: number, description?: string | null };

export type ClientUserFragment = { __typename?: 'UserType', uuid: string, email: string, firstName: string, lastName: string, clientProfile: { __typename?: 'ClientUserProfileType', ownershipPercentage?: number | null, role?: ClientUserRoleEnum | null, spvUsername?: string | null, spvPassword?: string | null, spvEmail?: string | null, phoneNumber: string, showInGroup: boolean } };

export type ErrorFragment = { __typename?: 'ErrorType', field?: string | null, message: string };

export type FileFragment = { __typename?: 'ClientFileType', uuid: string, name: string, updated: DateTimeString, url: string, size: number };

export type SolutionFragment = { __typename?: 'SolutionType', uuid: string, name: string, activities: Array<{ __typename?: 'ActivityType', uuid: string, name: string }>, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } };

export type UserFragment = { __typename?: 'UserType', permissions: Array<UserPermissionsEnum>, uuid: string, name: string, email: string, photoUrl: string, role: UserRoleEnum, clients: Array<{ __typename?: 'ClientType', uuid: string, name: string }>, categories: Array<{ __typename?: 'CategoryType', uuid: string, name: string, code: string }> };

export type ChangePasswordMutationVariables = Exact<{
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword?: { __typename?: 'ChangePassword', token?: string | null, error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginUser', token?: string | null, error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'UserType', permissions: Array<UserPermissionsEnum>, uuid: string, name: string, email: string, photoUrl: string, role: UserRoleEnum, organization: { __typename?: 'OrganizationType', uuid: string, name: string, logoUrl: string }, categories: Array<{ __typename?: 'CategoryType', uuid: string, name: string, code: string }> } | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: { __typename?: 'LogoutUser', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type CreateClientFilesMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  clientFilesInput: Array<ClientFileInput> | ClientFileInput;
}>;


export type CreateClientFilesMutation = { __typename?: 'Mutation', createClientFiles?: { __typename?: 'CreateClientFiles', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, client?: { __typename?: 'ClientType', uuid: string, files: Array<{ __typename?: 'ClientFileType', uuid: string, name: string, updated: DateTimeString, url: string, size: number }> } | null } | null };

export type DeleteClientMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
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

export type DeleteClientGroupMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeleteClientGroupMutation = { __typename?: 'Mutation', deleteClientGroup?: { __typename?: 'DeleteClientGroup', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type DeleteClientUserMutationVariables = Exact<{
  userUuid: Scalars['String']['input'];
}>;


export type DeleteClientUserMutation = { __typename?: 'Mutation', deleteClientUser?: { __typename?: 'DeleteClientUser', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type ToggleClientActivityMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  clientActivityUuid: Scalars['String']['input'];
}>;


export type ToggleClientActivityMutation = { __typename?: 'Mutation', toggleClientActivity?: { __typename?: 'ToggleClientActivity', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type UpdateClientMutationVariables = Exact<{
  clientInput: ClientInput;
}>;


export type UpdateClientMutation = { __typename?: 'Mutation', updateClient?: { __typename?: 'UpdateClient', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, client?: { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, solutions: Array<{ __typename?: 'ClientSolutionType', uuid: string, unitCost?: number | null, unitCostCurrency: CurrencyEnum, quantity: number, solution: { __typename?: 'SolutionType', uuid: string, name: string, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } } }>, softwares: Array<{ __typename?: 'ClientSoftwareType', uuid: string, software: SoftwareEnum, username?: string | null, password?: string | null }>, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null } | null } | null };

export type UpdateClientActivityMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  activityInput: ActivityInput;
  clientActivityInput: ClientActivityInput;
}>;


export type UpdateClientActivityMutation = { __typename?: 'Mutation', updateClientActivity?: { __typename?: 'UpdateClientActivity', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, clientActivity?: { __typename?: 'ClientActivityType', uuid: string, isExecuted: boolean, isRecurrent: boolean, quantity: number, activity: { __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } } } | null } | null };

export type UpdateClientActivityLogsMutationVariables = Exact<{
  clientActivityUuid: Scalars['String']['input'];
  logsInput: Array<LogInput> | LogInput;
}>;


export type UpdateClientActivityLogsMutation = { __typename?: 'Mutation', updateClientActivityLogs?: { __typename?: 'UpdateClientActivityLogs', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, clientActivity?: { __typename?: 'ClientActivityType', uuid: string, logs: Array<{ __typename?: 'ClientActivityLogType', uuid: string, date: DateString, minutesAllocated: number, description?: string | null }> } | null } | null };

export type UpdateClientGroupMutationVariables = Exact<{
  clientGroupInput: ClientGroupInput;
}>;


export type UpdateClientGroupMutation = { __typename?: 'Mutation', updateClientGroup?: { __typename?: 'UpdateClientGroup', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, clientGroup?: { __typename?: 'ClientGroupType', uuid: string, name: string, clients: Array<{ __typename?: 'ClientType', uuid: string, name: string }> } | null } | null };

export type UpdateClientInvoiceStatusMutationVariables = Exact<{
  invoiceUuid: Scalars['String']['input'];
  status: InvoiceStatusEnum;
}>;


export type UpdateClientInvoiceStatusMutation = { __typename?: 'Mutation', updateClientInvoiceStatus?: { __typename?: 'UpdateClientInvoiceStatus', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, invoice?: { __typename?: 'InvoiceType', uuid: string, dateSent?: DateString | null } | null } | null };

export type UpdateClientSolutionMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  clientSolutionInput: ClientSolutionInput;
}>;


export type UpdateClientSolutionMutation = { __typename?: 'Mutation', updateClientSolution?: { __typename?: 'UpdateClientSolution', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, clientSolution?: { __typename?: 'ClientSolutionType', uuid: string, quantity: number } | null } | null };

export type UpdateClientSolutionLogsMutationVariables = Exact<{
  clientSolutionUuid: Scalars['String']['input'];
  logsInput: Array<LogInput> | LogInput;
}>;


export type UpdateClientSolutionLogsMutation = { __typename?: 'Mutation', updateClientSolutionLogs?: { __typename?: 'UpdateClientSolutionLogs', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, clientSolution?: { __typename?: 'ClientSolutionType', uuid: string, logs: Array<{ __typename?: 'ClientSolutionLogType', uuid: string, date: DateString, minutesAllocated: number, description?: string | null }> } | null } | null };

export type UpdateClientUserMutationVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  clientUserInput: ClientUserInput;
}>;


export type UpdateClientUserMutation = { __typename?: 'Mutation', updateClientUser?: { __typename?: 'UpdateClientUser', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, clientUser?: { __typename?: 'UserType', uuid: string, email: string, firstName: string, lastName: string, clientProfile: { __typename?: 'ClientUserProfileType', ownershipPercentage?: number | null, role?: ClientUserRoleEnum | null, spvUsername?: string | null, spvPassword?: string | null, spvEmail?: string | null, phoneNumber: string, showInGroup: boolean } } | null } | null };

export type DeleteOrganizationActivityMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeleteOrganizationActivityMutation = { __typename?: 'Mutation', deleteOrganizationActivity?: { __typename?: 'DeleteOrganizationActivity', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type DeleteOrganizationSolutionMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeleteOrganizationSolutionMutation = { __typename?: 'Mutation', deleteOrganizationSolution?: { __typename?: 'DeleteOrganizationSolution', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null } | null };

export type OrganizationToggleUserCategoryPermissionMutationVariables = Exact<{
  userUuid: Scalars['String']['input'];
  categoryUuid: Scalars['String']['input'];
}>;


export type OrganizationToggleUserCategoryPermissionMutation = { __typename?: 'Mutation', toggleUserCategoryPermission?: { __typename?: 'ToggleUserCategoryPermission', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user: { __typename?: 'UserType', uuid: string, categories: Array<{ __typename?: 'CategoryType', uuid: string, name: string }> } } | null };

export type OrganizationToggleUserClientPermissionMutationVariables = Exact<{
  userUuid: Scalars['String']['input'];
  clientUuid: Scalars['String']['input'];
}>;


export type OrganizationToggleUserClientPermissionMutation = { __typename?: 'Mutation', toggleUserClientPermission?: { __typename?: 'ToggleUserClientPermission', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user: { __typename?: 'UserType', uuid: string, clients: Array<{ __typename?: 'ClientType', uuid: string, name: string }> } } | null };

export type OrganizationToggleUserPermissionMutationVariables = Exact<{
  userUuid: Scalars['String']['input'];
  permission: UserPermissionsEnum;
}>;


export type OrganizationToggleUserPermissionMutation = { __typename?: 'Mutation', toggleUserPermission?: { __typename?: 'ToggleUserPermission', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user: { __typename?: 'UserType', uuid: string, permissions: Array<UserPermissionsEnum> } } | null };

export type UpdateOrganizationActivityMutationVariables = Exact<{
  activityInput: ActivityInput;
}>;


export type UpdateOrganizationActivityMutation = { __typename?: 'Mutation', updateOrganizationActivity?: { __typename?: 'UpdateOrganizationActivity', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, activity?: { __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } } | null } | null };

export type UpdateOrganizationSolutionMutationVariables = Exact<{
  solutionInput: SolutionInput;
}>;


export type UpdateOrganizationSolutionMutation = { __typename?: 'Mutation', updateOrganizationSolution?: { __typename?: 'UpdateOrganizationSolution', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, solution?: { __typename?: 'SolutionType', uuid: string, name: string, activities: Array<{ __typename?: 'ActivityType', uuid: string, name: string }>, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } } | null } | null };

export type ReportGenerateUserReportMutationVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  categoryCodes: Array<Scalars['String']['input']> | Scalars['String']['input'];
  userUuids: Array<Scalars['String']['input']> | Scalars['String']['input'];
  solutionUuids: Array<Scalars['String']['input']> | Scalars['String']['input'];
  activityUuids: Array<Scalars['String']['input']> | Scalars['String']['input'];
  costMin?: InputMaybe<Scalars['Int']['input']>;
  costMax?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ReportGenerateUserReportMutation = { __typename?: 'Mutation', generateReport?: { __typename?: 'GenerateReport', downloadUrl: string } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'UserType', permissions: Array<UserPermissionsEnum>, uuid: string, name: string, email: string, photoUrl: string, role: UserRoleEnum, organization: { __typename?: 'OrganizationType', uuid: string, name: string, logoUrl: string }, categories: Array<{ __typename?: 'CategoryType', uuid: string, name: string, code: string }> } };

export type ClientActivitiesQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
}>;


export type ClientActivitiesQuery = { __typename?: 'Query', client: { __typename?: 'ClientType', uuid: string, activities: Array<{ __typename?: 'ClientActivityType', uuid: string, isExecuted: boolean, isRecurrent: boolean, quantity: number, activity: { __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } } }>, solutions: Array<{ __typename?: 'ClientSolutionType', uuid: string, unitCost?: number | null, unitCostCurrency: CurrencyEnum, quantity: number, solution: { __typename?: 'SolutionType', uuid: string, name: string, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } } }> } };

export type ClientActivityLogsQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  clientActivityUuid: Scalars['String']['input'];
}>;


export type ClientActivityLogsQuery = { __typename?: 'Query', client: { __typename?: 'ClientType', uuid: string, activity: { __typename?: 'ClientActivityType', uuid: string, logs: Array<{ __typename?: 'ClientActivityLogType', uuid: string, date: DateString, minutesAllocated: number, description?: string | null }> } } };

export type ClientClientQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type ClientClientQuery = { __typename?: 'Query', client: { __typename?: 'ClientType', uuid: string, name: string, description?: string | null, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, group?: { __typename?: 'ClientGroupType', uuid: string, name: string, clients: Array<{ __typename?: 'ClientType', uuid: string, name: string }> } | null, solutions: Array<{ __typename?: 'ClientSolutionType', uuid: string, unitCost?: number | null, unitCostCurrency: CurrencyEnum, quantity: number, solution: { __typename?: 'SolutionType', uuid: string, name: string, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } } }>, softwares: Array<{ __typename?: 'ClientSoftwareType', uuid: string, software: SoftwareEnum, username?: string | null, password?: string | null }>, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null } };

export type ClientFilesQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
}>;


export type ClientFilesQuery = { __typename?: 'Query', client: { __typename?: 'ClientType', uuid: string, files: Array<{ __typename?: 'ClientFileType', uuid: string, name: string, updated: DateTimeString, url: string, size: number }> } };

export type ClientGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientGroupsQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationType', uuid: string, clientGroups: Array<{ __typename?: 'ClientGroupType', uuid: string, name: string, clients: Array<{ __typename?: 'ClientType', uuid: string, name: string }> }> } };

export type ClientInvoiceQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
}>;


export type ClientInvoiceQuery = { __typename?: 'Query', client: { __typename?: 'ClientType', uuid: string, invoice: { __typename?: 'InvoiceType', uuid: string, dateSent?: DateString | null, items: Array<{ __typename?: 'InvoiceItemType', solutionName?: string | null, quantity: number, cost: number, currency: CurrencyEnum, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } }> } } };

export type ClientSolutionLogsQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
  clientSolutionUuid: Scalars['String']['input'];
}>;


export type ClientSolutionLogsQuery = { __typename?: 'Query', client: { __typename?: 'ClientType', uuid: string, solution: { __typename?: 'ClientSolutionType', uuid: string, logs: Array<{ __typename?: 'ClientSolutionLogType', uuid: string, date: DateString, minutesAllocated: number, description?: string | null }> } } };

export type ClientUsersQueryVariables = Exact<{
  clientUuid: Scalars['String']['input'];
}>;


export type ClientUsersQuery = { __typename?: 'Query', client: { __typename?: 'ClientType', uuid: string, group?: { __typename?: 'ClientGroupType', uuid: string } | null, users: Array<{ __typename?: 'UserType', uuid: string, email: string, firstName: string, lastName: string, clientProfile: { __typename?: 'ClientUserProfileType', ownershipPercentage?: number | null, role?: ClientUserRoleEnum | null, spvUsername?: string | null, spvPassword?: string | null, spvEmail?: string | null, phoneNumber: string, showInGroup: boolean } }> } };

export type OrganizationActivitiesQueryVariables = Exact<{
  excludeSolutionActivities?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type OrganizationActivitiesQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationType', uuid: string, activities: Array<{ __typename?: 'ActivityType', uuid: string, name: string, description?: string | null, unitCost?: number | null, unitCostCurrency: CurrencyEnum, unitCostType: UnitCostTypeEnum, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } }> } };

export type OrganizationCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationCategoriesQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationType', uuid: string, categories: Array<{ __typename?: 'CategoryType', uuid: string, name: string, code: string }> } };

export type OrganizationClientsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationClientsQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationType', uuid: string, clients: Array<{ __typename?: 'ClientType', uuid: string, name: string, description?: string | null, cui?: string | null, spvUsername?: string | null, spvPassword?: string | null, programManager?: { __typename?: 'UserType', uuid: string, name: string } | null }> } };

export type OrganizationSolutionsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationSolutionsQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationType', uuid: string, solutions: Array<{ __typename?: 'SolutionType', uuid: string, name: string, activities: Array<{ __typename?: 'ActivityType', uuid: string, name: string }>, category: { __typename?: 'CategoryType', uuid: string, name: string, code: string } }> } };

export type OrganizationUserQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type OrganizationUserQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationType', uuid: string, user: { __typename?: 'UserType', permissions: Array<UserPermissionsEnum>, uuid: string, name: string, email: string, photoUrl: string, role: UserRoleEnum, clients: Array<{ __typename?: 'ClientType', uuid: string, name: string }>, categories: Array<{ __typename?: 'CategoryType', uuid: string, name: string, code: string }> } } };

export type OrganizationUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationUsersQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationType', uuid: string, users: Array<{ __typename?: 'UserType', uuid: string, name: string, email: string, photoUrl: string, role: UserRoleEnum }> } };

export const CategoryFragmentDoc = gql`
    fragment Category on CategoryType {
  uuid
  name
  code
}
    `;
export const ActivityFragmentDoc = gql`
    fragment Activity on ActivityType {
  uuid
  name
  description
  unitCost
  unitCostCurrency
  unitCostType
  category {
    ...Category
  }
}
    ${CategoryFragmentDoc}`;
export const BaseUserFragmentDoc = gql`
    fragment BaseUser on UserType {
  uuid
  name
  email
  photoUrl
  role
}
    `;
export const AuthUserFragmentDoc = gql`
    fragment AuthUser on UserType {
  ...BaseUser
  organization {
    uuid
    name
    logoUrl
  }
  categories {
    ...Category
  }
  permissions
}
    ${BaseUserFragmentDoc}
${CategoryFragmentDoc}`;
export const BaseClientFragmentDoc = gql`
    fragment BaseClient on ClientType {
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
export const BaseSolutionFragmentDoc = gql`
    fragment BaseSolution on SolutionType {
  uuid
  name
  category {
    ...Category
  }
}
    ${CategoryFragmentDoc}`;
export const ClientSolutionFragmentDoc = gql`
    fragment ClientSolution on ClientSolutionType {
  uuid
  unitCost
  unitCostCurrency
  quantity
  solution {
    ...BaseSolution
  }
}
    ${BaseSolutionFragmentDoc}`;
export const ClientFragmentDoc = gql`
    fragment Client on ClientType {
  ...BaseClient
  solutions {
    ...ClientSolution
  }
  softwares {
    uuid
    software
    username
    password
  }
}
    ${BaseClientFragmentDoc}
${ClientSolutionFragmentDoc}`;
export const ClientActivityFragmentDoc = gql`
    fragment ClientActivity on ClientActivityType {
  uuid
  isExecuted
  isRecurrent
  quantity
}
    `;
export const ClientActivityLogFragmentDoc = gql`
    fragment ClientActivityLog on ClientActivityLogType {
  uuid
  date
  minutesAllocated
  description
}
    `;
export const ClientGroupFragmentDoc = gql`
    fragment ClientGroup on ClientGroupType {
  uuid
  name
  clients {
    uuid
    name
  }
}
    `;
export const ClientSolutionLogFragmentDoc = gql`
    fragment ClientSolutionLog on ClientSolutionLogType {
  uuid
  date
  minutesAllocated
  description
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
    spvEmail
    phoneNumber
    showInGroup
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
export const SolutionFragmentDoc = gql`
    fragment Solution on SolutionType {
  ...BaseSolution
  activities {
    uuid
    name
  }
}
    ${BaseSolutionFragmentDoc}`;
export const UserFragmentDoc = gql`
    fragment User on UserType {
  ...BaseUser
  permissions
  clients {
    uuid
    name
  }
  categories {
    ...Category
  }
}
    ${BaseUserFragmentDoc}
${CategoryFragmentDoc}`;
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
      ...AuthUser
    }
  }
}
    ${ErrorFragmentDoc}
${AuthUserFragmentDoc}`;
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
    mutation DeleteClient($uuid: String!) {
  deleteClient(uuid: $uuid) {
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
 *      uuid: // value for 'uuid'
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
export const DeleteClientGroupDocument = gql`
    mutation DeleteClientGroup($uuid: String!) {
  deleteClientGroup(uuid: $uuid) {
    error {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteClientGroupMutationFn = Apollo.MutationFunction<DeleteClientGroupMutation, DeleteClientGroupMutationVariables>;

/**
 * __useDeleteClientGroupMutation__
 *
 * To run a mutation, you first call `useDeleteClientGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClientGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClientGroupMutation, { data, loading, error }] = useDeleteClientGroupMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteClientGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClientGroupMutation, DeleteClientGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteClientGroupMutation, DeleteClientGroupMutationVariables>(DeleteClientGroupDocument, options);
      }
export type DeleteClientGroupMutationHookResult = ReturnType<typeof useDeleteClientGroupMutation>;
export type DeleteClientGroupMutationResult = Apollo.MutationResult<DeleteClientGroupMutation>;
export type DeleteClientGroupMutationOptions = Apollo.BaseMutationOptions<DeleteClientGroupMutation, DeleteClientGroupMutationVariables>;
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
    mutation ToggleClientActivity($clientUuid: String!, $clientActivityUuid: String!) {
  toggleClientActivity(
    clientUuid: $clientUuid
    clientActivityUuid: $clientActivityUuid
  ) {
    error {
      ...Error
    }
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
 *      clientActivityUuid: // value for 'clientActivityUuid'
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
export const UpdateClientActivityLogsDocument = gql`
    mutation UpdateClientActivityLogs($clientActivityUuid: String!, $logsInput: [LogInput!]!) {
  updateClientActivityLogs(
    clientActivityUuid: $clientActivityUuid
    logsInput: $logsInput
  ) {
    error {
      ...Error
    }
    clientActivity {
      uuid
      logs {
        ...ClientActivityLog
      }
    }
  }
}
    ${ErrorFragmentDoc}
${ClientActivityLogFragmentDoc}`;
export type UpdateClientActivityLogsMutationFn = Apollo.MutationFunction<UpdateClientActivityLogsMutation, UpdateClientActivityLogsMutationVariables>;

/**
 * __useUpdateClientActivityLogsMutation__
 *
 * To run a mutation, you first call `useUpdateClientActivityLogsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientActivityLogsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientActivityLogsMutation, { data, loading, error }] = useUpdateClientActivityLogsMutation({
 *   variables: {
 *      clientActivityUuid: // value for 'clientActivityUuid'
 *      logsInput: // value for 'logsInput'
 *   },
 * });
 */
export function useUpdateClientActivityLogsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientActivityLogsMutation, UpdateClientActivityLogsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientActivityLogsMutation, UpdateClientActivityLogsMutationVariables>(UpdateClientActivityLogsDocument, options);
      }
export type UpdateClientActivityLogsMutationHookResult = ReturnType<typeof useUpdateClientActivityLogsMutation>;
export type UpdateClientActivityLogsMutationResult = Apollo.MutationResult<UpdateClientActivityLogsMutation>;
export type UpdateClientActivityLogsMutationOptions = Apollo.BaseMutationOptions<UpdateClientActivityLogsMutation, UpdateClientActivityLogsMutationVariables>;
export const UpdateClientGroupDocument = gql`
    mutation UpdateClientGroup($clientGroupInput: ClientGroupInput!) {
  updateClientGroup(clientGroupInput: $clientGroupInput) {
    error {
      ...Error
    }
    clientGroup {
      ...ClientGroup
    }
  }
}
    ${ErrorFragmentDoc}
${ClientGroupFragmentDoc}`;
export type UpdateClientGroupMutationFn = Apollo.MutationFunction<UpdateClientGroupMutation, UpdateClientGroupMutationVariables>;

/**
 * __useUpdateClientGroupMutation__
 *
 * To run a mutation, you first call `useUpdateClientGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientGroupMutation, { data, loading, error }] = useUpdateClientGroupMutation({
 *   variables: {
 *      clientGroupInput: // value for 'clientGroupInput'
 *   },
 * });
 */
export function useUpdateClientGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientGroupMutation, UpdateClientGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientGroupMutation, UpdateClientGroupMutationVariables>(UpdateClientGroupDocument, options);
      }
export type UpdateClientGroupMutationHookResult = ReturnType<typeof useUpdateClientGroupMutation>;
export type UpdateClientGroupMutationResult = Apollo.MutationResult<UpdateClientGroupMutation>;
export type UpdateClientGroupMutationOptions = Apollo.BaseMutationOptions<UpdateClientGroupMutation, UpdateClientGroupMutationVariables>;
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
export const UpdateClientSolutionDocument = gql`
    mutation UpdateClientSolution($clientUuid: String!, $clientSolutionInput: ClientSolutionInput!) {
  updateClientSolution(
    clientUuid: $clientUuid
    clientSolutionInput: $clientSolutionInput
  ) {
    error {
      ...Error
    }
    clientSolution {
      uuid
      quantity
    }
  }
}
    ${ErrorFragmentDoc}`;
export type UpdateClientSolutionMutationFn = Apollo.MutationFunction<UpdateClientSolutionMutation, UpdateClientSolutionMutationVariables>;

/**
 * __useUpdateClientSolutionMutation__
 *
 * To run a mutation, you first call `useUpdateClientSolutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientSolutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientSolutionMutation, { data, loading, error }] = useUpdateClientSolutionMutation({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *      clientSolutionInput: // value for 'clientSolutionInput'
 *   },
 * });
 */
export function useUpdateClientSolutionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientSolutionMutation, UpdateClientSolutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientSolutionMutation, UpdateClientSolutionMutationVariables>(UpdateClientSolutionDocument, options);
      }
export type UpdateClientSolutionMutationHookResult = ReturnType<typeof useUpdateClientSolutionMutation>;
export type UpdateClientSolutionMutationResult = Apollo.MutationResult<UpdateClientSolutionMutation>;
export type UpdateClientSolutionMutationOptions = Apollo.BaseMutationOptions<UpdateClientSolutionMutation, UpdateClientSolutionMutationVariables>;
export const UpdateClientSolutionLogsDocument = gql`
    mutation UpdateClientSolutionLogs($clientSolutionUuid: String!, $logsInput: [LogInput!]!) {
  updateClientSolutionLogs(
    clientSolutionUuid: $clientSolutionUuid
    logsInput: $logsInput
  ) {
    error {
      ...Error
    }
    clientSolution {
      uuid
      logs {
        ...ClientSolutionLog
      }
    }
  }
}
    ${ErrorFragmentDoc}
${ClientSolutionLogFragmentDoc}`;
export type UpdateClientSolutionLogsMutationFn = Apollo.MutationFunction<UpdateClientSolutionLogsMutation, UpdateClientSolutionLogsMutationVariables>;

/**
 * __useUpdateClientSolutionLogsMutation__
 *
 * To run a mutation, you first call `useUpdateClientSolutionLogsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientSolutionLogsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientSolutionLogsMutation, { data, loading, error }] = useUpdateClientSolutionLogsMutation({
 *   variables: {
 *      clientSolutionUuid: // value for 'clientSolutionUuid'
 *      logsInput: // value for 'logsInput'
 *   },
 * });
 */
export function useUpdateClientSolutionLogsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientSolutionLogsMutation, UpdateClientSolutionLogsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientSolutionLogsMutation, UpdateClientSolutionLogsMutationVariables>(UpdateClientSolutionLogsDocument, options);
      }
export type UpdateClientSolutionLogsMutationHookResult = ReturnType<typeof useUpdateClientSolutionLogsMutation>;
export type UpdateClientSolutionLogsMutationResult = Apollo.MutationResult<UpdateClientSolutionLogsMutation>;
export type UpdateClientSolutionLogsMutationOptions = Apollo.BaseMutationOptions<UpdateClientSolutionLogsMutation, UpdateClientSolutionLogsMutationVariables>;
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
export const OrganizationToggleUserCategoryPermissionDocument = gql`
    mutation OrganizationToggleUserCategoryPermission($userUuid: String!, $categoryUuid: String!) {
  toggleUserCategoryPermission(userUuid: $userUuid, categoryUuid: $categoryUuid) {
    error {
      ...Error
    }
    user {
      uuid
      categories {
        uuid
        name
      }
    }
  }
}
    ${ErrorFragmentDoc}`;
export type OrganizationToggleUserCategoryPermissionMutationFn = Apollo.MutationFunction<OrganizationToggleUserCategoryPermissionMutation, OrganizationToggleUserCategoryPermissionMutationVariables>;

/**
 * __useOrganizationToggleUserCategoryPermissionMutation__
 *
 * To run a mutation, you first call `useOrganizationToggleUserCategoryPermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationToggleUserCategoryPermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationToggleUserCategoryPermissionMutation, { data, loading, error }] = useOrganizationToggleUserCategoryPermissionMutation({
 *   variables: {
 *      userUuid: // value for 'userUuid'
 *      categoryUuid: // value for 'categoryUuid'
 *   },
 * });
 */
export function useOrganizationToggleUserCategoryPermissionMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationToggleUserCategoryPermissionMutation, OrganizationToggleUserCategoryPermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationToggleUserCategoryPermissionMutation, OrganizationToggleUserCategoryPermissionMutationVariables>(OrganizationToggleUserCategoryPermissionDocument, options);
      }
export type OrganizationToggleUserCategoryPermissionMutationHookResult = ReturnType<typeof useOrganizationToggleUserCategoryPermissionMutation>;
export type OrganizationToggleUserCategoryPermissionMutationResult = Apollo.MutationResult<OrganizationToggleUserCategoryPermissionMutation>;
export type OrganizationToggleUserCategoryPermissionMutationOptions = Apollo.BaseMutationOptions<OrganizationToggleUserCategoryPermissionMutation, OrganizationToggleUserCategoryPermissionMutationVariables>;
export const OrganizationToggleUserClientPermissionDocument = gql`
    mutation OrganizationToggleUserClientPermission($userUuid: String!, $clientUuid: String!) {
  toggleUserClientPermission(userUuid: $userUuid, clientUuid: $clientUuid) {
    error {
      ...Error
    }
    user {
      uuid
      clients {
        uuid
        name
      }
    }
  }
}
    ${ErrorFragmentDoc}`;
export type OrganizationToggleUserClientPermissionMutationFn = Apollo.MutationFunction<OrganizationToggleUserClientPermissionMutation, OrganizationToggleUserClientPermissionMutationVariables>;

/**
 * __useOrganizationToggleUserClientPermissionMutation__
 *
 * To run a mutation, you first call `useOrganizationToggleUserClientPermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationToggleUserClientPermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationToggleUserClientPermissionMutation, { data, loading, error }] = useOrganizationToggleUserClientPermissionMutation({
 *   variables: {
 *      userUuid: // value for 'userUuid'
 *      clientUuid: // value for 'clientUuid'
 *   },
 * });
 */
export function useOrganizationToggleUserClientPermissionMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationToggleUserClientPermissionMutation, OrganizationToggleUserClientPermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationToggleUserClientPermissionMutation, OrganizationToggleUserClientPermissionMutationVariables>(OrganizationToggleUserClientPermissionDocument, options);
      }
export type OrganizationToggleUserClientPermissionMutationHookResult = ReturnType<typeof useOrganizationToggleUserClientPermissionMutation>;
export type OrganizationToggleUserClientPermissionMutationResult = Apollo.MutationResult<OrganizationToggleUserClientPermissionMutation>;
export type OrganizationToggleUserClientPermissionMutationOptions = Apollo.BaseMutationOptions<OrganizationToggleUserClientPermissionMutation, OrganizationToggleUserClientPermissionMutationVariables>;
export const OrganizationToggleUserPermissionDocument = gql`
    mutation OrganizationToggleUserPermission($userUuid: String!, $permission: UserPermissionsEnum!) {
  toggleUserPermission(userUuid: $userUuid, permission: $permission) {
    error {
      ...Error
    }
    user {
      uuid
      permissions
    }
  }
}
    ${ErrorFragmentDoc}`;
export type OrganizationToggleUserPermissionMutationFn = Apollo.MutationFunction<OrganizationToggleUserPermissionMutation, OrganizationToggleUserPermissionMutationVariables>;

/**
 * __useOrganizationToggleUserPermissionMutation__
 *
 * To run a mutation, you first call `useOrganizationToggleUserPermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationToggleUserPermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationToggleUserPermissionMutation, { data, loading, error }] = useOrganizationToggleUserPermissionMutation({
 *   variables: {
 *      userUuid: // value for 'userUuid'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useOrganizationToggleUserPermissionMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationToggleUserPermissionMutation, OrganizationToggleUserPermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationToggleUserPermissionMutation, OrganizationToggleUserPermissionMutationVariables>(OrganizationToggleUserPermissionDocument, options);
      }
export type OrganizationToggleUserPermissionMutationHookResult = ReturnType<typeof useOrganizationToggleUserPermissionMutation>;
export type OrganizationToggleUserPermissionMutationResult = Apollo.MutationResult<OrganizationToggleUserPermissionMutation>;
export type OrganizationToggleUserPermissionMutationOptions = Apollo.BaseMutationOptions<OrganizationToggleUserPermissionMutation, OrganizationToggleUserPermissionMutationVariables>;
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
export const ReportGenerateUserReportDocument = gql`
    mutation ReportGenerateUserReport($year: Int!, $month: Int!, $categoryCodes: [String!]!, $userUuids: [String!]!, $solutionUuids: [String!]!, $activityUuids: [String!]!, $costMin: Int, $costMax: Int) {
  generateReport(
    year: $year
    month: $month
    categoryCodes: $categoryCodes
    userUuids: $userUuids
    solutionUuids: $solutionUuids
    activityUuids: $activityUuids
    costMin: $costMin
    costMax: $costMax
  ) {
    downloadUrl
  }
}
    `;
export type ReportGenerateUserReportMutationFn = Apollo.MutationFunction<ReportGenerateUserReportMutation, ReportGenerateUserReportMutationVariables>;

/**
 * __useReportGenerateUserReportMutation__
 *
 * To run a mutation, you first call `useReportGenerateUserReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReportGenerateUserReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reportGenerateUserReportMutation, { data, loading, error }] = useReportGenerateUserReportMutation({
 *   variables: {
 *      year: // value for 'year'
 *      month: // value for 'month'
 *      categoryCodes: // value for 'categoryCodes'
 *      userUuids: // value for 'userUuids'
 *      solutionUuids: // value for 'solutionUuids'
 *      activityUuids: // value for 'activityUuids'
 *      costMin: // value for 'costMin'
 *      costMax: // value for 'costMax'
 *   },
 * });
 */
export function useReportGenerateUserReportMutation(baseOptions?: Apollo.MutationHookOptions<ReportGenerateUserReportMutation, ReportGenerateUserReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReportGenerateUserReportMutation, ReportGenerateUserReportMutationVariables>(ReportGenerateUserReportDocument, options);
      }
export type ReportGenerateUserReportMutationHookResult = ReturnType<typeof useReportGenerateUserReportMutation>;
export type ReportGenerateUserReportMutationResult = Apollo.MutationResult<ReportGenerateUserReportMutation>;
export type ReportGenerateUserReportMutationOptions = Apollo.BaseMutationOptions<ReportGenerateUserReportMutation, ReportGenerateUserReportMutationVariables>;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    ...AuthUser
  }
}
    ${AuthUserFragmentDoc}`;

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
    query ClientActivities($clientUuid: String!, $year: Int!, $month: Int!) {
  client(uuid: $clientUuid) {
    uuid
    activities(year: $year, month: $month) {
      ...ClientActivity
      activity {
        ...Activity
      }
    }
    solutions(year: $year, month: $month) {
      ...ClientSolution
    }
  }
}
    ${ClientActivityFragmentDoc}
${ActivityFragmentDoc}
${ClientSolutionFragmentDoc}`;

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
export const ClientActivityLogsDocument = gql`
    query ClientActivityLogs($clientUuid: String!, $clientActivityUuid: String!) {
  client(uuid: $clientUuid) {
    uuid
    activity(uuid: $clientActivityUuid) {
      uuid
      logs {
        ...ClientActivityLog
      }
    }
  }
}
    ${ClientActivityLogFragmentDoc}`;

/**
 * __useClientActivityLogsQuery__
 *
 * To run a query within a React component, call `useClientActivityLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientActivityLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientActivityLogsQuery({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *      clientActivityUuid: // value for 'clientActivityUuid'
 *   },
 * });
 */
export function useClientActivityLogsQuery(baseOptions: Apollo.QueryHookOptions<ClientActivityLogsQuery, ClientActivityLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientActivityLogsQuery, ClientActivityLogsQueryVariables>(ClientActivityLogsDocument, options);
      }
export function useClientActivityLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientActivityLogsQuery, ClientActivityLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientActivityLogsQuery, ClientActivityLogsQueryVariables>(ClientActivityLogsDocument, options);
        }
export function useClientActivityLogsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientActivityLogsQuery, ClientActivityLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientActivityLogsQuery, ClientActivityLogsQueryVariables>(ClientActivityLogsDocument, options);
        }
export type ClientActivityLogsQueryHookResult = ReturnType<typeof useClientActivityLogsQuery>;
export type ClientActivityLogsLazyQueryHookResult = ReturnType<typeof useClientActivityLogsLazyQuery>;
export type ClientActivityLogsSuspenseQueryHookResult = ReturnType<typeof useClientActivityLogsSuspenseQuery>;
export type ClientActivityLogsQueryResult = Apollo.QueryResult<ClientActivityLogsQuery, ClientActivityLogsQueryVariables>;
export const ClientClientDocument = gql`
    query ClientClient($uuid: String!) {
  client(uuid: $uuid) {
    ...Client
    group {
      uuid
      name
      clients {
        uuid
        name
      }
    }
  }
}
    ${ClientFragmentDoc}`;

/**
 * __useClientClientQuery__
 *
 * To run a query within a React component, call `useClientClientQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientClientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientClientQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useClientClientQuery(baseOptions: Apollo.QueryHookOptions<ClientClientQuery, ClientClientQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientClientQuery, ClientClientQueryVariables>(ClientClientDocument, options);
      }
export function useClientClientLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientClientQuery, ClientClientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientClientQuery, ClientClientQueryVariables>(ClientClientDocument, options);
        }
export function useClientClientSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientClientQuery, ClientClientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientClientQuery, ClientClientQueryVariables>(ClientClientDocument, options);
        }
export type ClientClientQueryHookResult = ReturnType<typeof useClientClientQuery>;
export type ClientClientLazyQueryHookResult = ReturnType<typeof useClientClientLazyQuery>;
export type ClientClientSuspenseQueryHookResult = ReturnType<typeof useClientClientSuspenseQuery>;
export type ClientClientQueryResult = Apollo.QueryResult<ClientClientQuery, ClientClientQueryVariables>;
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
export const ClientGroupsDocument = gql`
    query ClientGroups {
  organization {
    uuid
    clientGroups {
      ...ClientGroup
    }
  }
}
    ${ClientGroupFragmentDoc}`;

/**
 * __useClientGroupsQuery__
 *
 * To run a query within a React component, call `useClientGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useClientGroupsQuery(baseOptions?: Apollo.QueryHookOptions<ClientGroupsQuery, ClientGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientGroupsQuery, ClientGroupsQueryVariables>(ClientGroupsDocument, options);
      }
export function useClientGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientGroupsQuery, ClientGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientGroupsQuery, ClientGroupsQueryVariables>(ClientGroupsDocument, options);
        }
export function useClientGroupsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientGroupsQuery, ClientGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientGroupsQuery, ClientGroupsQueryVariables>(ClientGroupsDocument, options);
        }
export type ClientGroupsQueryHookResult = ReturnType<typeof useClientGroupsQuery>;
export type ClientGroupsLazyQueryHookResult = ReturnType<typeof useClientGroupsLazyQuery>;
export type ClientGroupsSuspenseQueryHookResult = ReturnType<typeof useClientGroupsSuspenseQuery>;
export type ClientGroupsQueryResult = Apollo.QueryResult<ClientGroupsQuery, ClientGroupsQueryVariables>;
export const ClientInvoiceDocument = gql`
    query ClientInvoice($clientUuid: String!, $year: Int!, $month: Int!) {
  client(uuid: $clientUuid) {
    uuid
    invoice(year: $year, month: $month) {
      uuid
      dateSent
      items {
        solutionName
        quantity
        cost
        currency
        category {
          ...Category
        }
      }
    }
  }
}
    ${CategoryFragmentDoc}`;

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
export const ClientSolutionLogsDocument = gql`
    query ClientSolutionLogs($clientUuid: String!, $clientSolutionUuid: String!) {
  client(uuid: $clientUuid) {
    uuid
    solution(uuid: $clientSolutionUuid) {
      uuid
      logs {
        ...ClientSolutionLog
      }
    }
  }
}
    ${ClientSolutionLogFragmentDoc}`;

/**
 * __useClientSolutionLogsQuery__
 *
 * To run a query within a React component, call `useClientSolutionLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClientSolutionLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClientSolutionLogsQuery({
 *   variables: {
 *      clientUuid: // value for 'clientUuid'
 *      clientSolutionUuid: // value for 'clientSolutionUuid'
 *   },
 * });
 */
export function useClientSolutionLogsQuery(baseOptions: Apollo.QueryHookOptions<ClientSolutionLogsQuery, ClientSolutionLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClientSolutionLogsQuery, ClientSolutionLogsQueryVariables>(ClientSolutionLogsDocument, options);
      }
export function useClientSolutionLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClientSolutionLogsQuery, ClientSolutionLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClientSolutionLogsQuery, ClientSolutionLogsQueryVariables>(ClientSolutionLogsDocument, options);
        }
export function useClientSolutionLogsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ClientSolutionLogsQuery, ClientSolutionLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ClientSolutionLogsQuery, ClientSolutionLogsQueryVariables>(ClientSolutionLogsDocument, options);
        }
export type ClientSolutionLogsQueryHookResult = ReturnType<typeof useClientSolutionLogsQuery>;
export type ClientSolutionLogsLazyQueryHookResult = ReturnType<typeof useClientSolutionLogsLazyQuery>;
export type ClientSolutionLogsSuspenseQueryHookResult = ReturnType<typeof useClientSolutionLogsSuspenseQuery>;
export type ClientSolutionLogsQueryResult = Apollo.QueryResult<ClientSolutionLogsQuery, ClientSolutionLogsQueryVariables>;
export const ClientUsersDocument = gql`
    query ClientUsers($clientUuid: String!) {
  client(uuid: $clientUuid) {
    uuid
    group {
      uuid
    }
    users {
      ...ClientUser
    }
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
    query OrganizationActivities($excludeSolutionActivities: Boolean) {
  organization {
    uuid
    activities(excludeSolutionActivities: $excludeSolutionActivities) {
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
 *      excludeSolutionActivities: // value for 'excludeSolutionActivities'
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
export const OrganizationCategoriesDocument = gql`
    query OrganizationCategories {
  organization {
    uuid
    categories {
      ...Category
    }
  }
}
    ${CategoryFragmentDoc}`;

/**
 * __useOrganizationCategoriesQuery__
 *
 * To run a query within a React component, call `useOrganizationCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationCategoriesQuery, OrganizationCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationCategoriesQuery, OrganizationCategoriesQueryVariables>(OrganizationCategoriesDocument, options);
      }
export function useOrganizationCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationCategoriesQuery, OrganizationCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationCategoriesQuery, OrganizationCategoriesQueryVariables>(OrganizationCategoriesDocument, options);
        }
export function useOrganizationCategoriesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationCategoriesQuery, OrganizationCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationCategoriesQuery, OrganizationCategoriesQueryVariables>(OrganizationCategoriesDocument, options);
        }
export type OrganizationCategoriesQueryHookResult = ReturnType<typeof useOrganizationCategoriesQuery>;
export type OrganizationCategoriesLazyQueryHookResult = ReturnType<typeof useOrganizationCategoriesLazyQuery>;
export type OrganizationCategoriesSuspenseQueryHookResult = ReturnType<typeof useOrganizationCategoriesSuspenseQuery>;
export type OrganizationCategoriesQueryResult = Apollo.QueryResult<OrganizationCategoriesQuery, OrganizationCategoriesQueryVariables>;
export const OrganizationClientsDocument = gql`
    query OrganizationClients {
  organization {
    uuid
    clients {
      ...BaseClient
    }
  }
}
    ${BaseClientFragmentDoc}`;

/**
 * __useOrganizationClientsQuery__
 *
 * To run a query within a React component, call `useOrganizationClientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationClientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationClientsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationClientsQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationClientsQuery, OrganizationClientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationClientsQuery, OrganizationClientsQueryVariables>(OrganizationClientsDocument, options);
      }
export function useOrganizationClientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationClientsQuery, OrganizationClientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationClientsQuery, OrganizationClientsQueryVariables>(OrganizationClientsDocument, options);
        }
export function useOrganizationClientsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationClientsQuery, OrganizationClientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationClientsQuery, OrganizationClientsQueryVariables>(OrganizationClientsDocument, options);
        }
export type OrganizationClientsQueryHookResult = ReturnType<typeof useOrganizationClientsQuery>;
export type OrganizationClientsLazyQueryHookResult = ReturnType<typeof useOrganizationClientsLazyQuery>;
export type OrganizationClientsSuspenseQueryHookResult = ReturnType<typeof useOrganizationClientsSuspenseQuery>;
export type OrganizationClientsQueryResult = Apollo.QueryResult<OrganizationClientsQuery, OrganizationClientsQueryVariables>;
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
export const OrganizationUserDocument = gql`
    query OrganizationUser($uuid: String!) {
  organization {
    uuid
    user(uuid: $uuid) {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

/**
 * __useOrganizationUserQuery__
 *
 * To run a query within a React component, call `useOrganizationUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationUserQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useOrganizationUserQuery(baseOptions: Apollo.QueryHookOptions<OrganizationUserQuery, OrganizationUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationUserQuery, OrganizationUserQueryVariables>(OrganizationUserDocument, options);
      }
export function useOrganizationUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationUserQuery, OrganizationUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationUserQuery, OrganizationUserQueryVariables>(OrganizationUserDocument, options);
        }
export function useOrganizationUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationUserQuery, OrganizationUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationUserQuery, OrganizationUserQueryVariables>(OrganizationUserDocument, options);
        }
export type OrganizationUserQueryHookResult = ReturnType<typeof useOrganizationUserQuery>;
export type OrganizationUserLazyQueryHookResult = ReturnType<typeof useOrganizationUserLazyQuery>;
export type OrganizationUserSuspenseQueryHookResult = ReturnType<typeof useOrganizationUserSuspenseQuery>;
export type OrganizationUserQueryResult = Apollo.QueryResult<OrganizationUserQuery, OrganizationUserQueryVariables>;
export const OrganizationUsersDocument = gql`
    query OrganizationUsers {
  organization {
    uuid
    users {
      ...BaseUser
    }
  }
}
    ${BaseUserFragmentDoc}`;

/**
 * __useOrganizationUsersQuery__
 *
 * To run a query within a React component, call `useOrganizationUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationUsersQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationUsersQuery, OrganizationUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationUsersQuery, OrganizationUsersQueryVariables>(OrganizationUsersDocument, options);
      }
export function useOrganizationUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationUsersQuery, OrganizationUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationUsersQuery, OrganizationUsersQueryVariables>(OrganizationUsersDocument, options);
        }
export function useOrganizationUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrganizationUsersQuery, OrganizationUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrganizationUsersQuery, OrganizationUsersQueryVariables>(OrganizationUsersDocument, options);
        }
export type OrganizationUsersQueryHookResult = ReturnType<typeof useOrganizationUsersQuery>;
export type OrganizationUsersLazyQueryHookResult = ReturnType<typeof useOrganizationUsersLazyQuery>;
export type OrganizationUsersSuspenseQueryHookResult = ReturnType<typeof useOrganizationUsersSuspenseQuery>;
export type OrganizationUsersQueryResult = Apollo.QueryResult<OrganizationUsersQuery, OrganizationUsersQueryVariables>;