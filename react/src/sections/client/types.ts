import {
  ActivityType,
  ClientFilesQuery,
  ClientInvoiceQuery,
  OrganizationClientsQuery,
  ClientUsersQuery,
  ClientGroupsQuery,
  ClientActivitiesQuery,
} from 'generated/graphql'

export type ClientTableFilters = {
  name: string
  programManagerId?: string
}

export type InvoiceTableFilters = {
  name: string
}

export type ClientActivityTableFilters = {
  name: string
  category: string
  isCustom: string
}

export type CombinedActivityType = ActivityType & {
  isExecuted: boolean
  isCustom: boolean
  clientActivityUuid: null | string
  quantity: number
}

export type APIClient = OrganizationClientsQuery['organization']['clients'][0]
export type APIClientGroup = ClientGroupsQuery['organization']['clientGroups'][0]
export type APIClientUser = ClientUsersQuery['client']['users'][0]
export type APIClientInvoice = ClientInvoiceQuery['client']['invoice']
export type APIClientFile = ClientFilesQuery['client']['files'][0]
export type APIClientSolution = ClientActivitiesQuery['client']['solutions'][0]
