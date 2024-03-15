import {
  ActivityType,
  ClientFilesQuery,
  ClientInvoiceQuery,
  OrganizationClientsQuery,
  ClientUsersQuery,
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

export type ClientActivityType = ActivityType & {
  isExecuted: boolean
  isCustom: boolean
  isSolutionActivity: boolean
  activityUuid: string
  clientActivityUuid?: string
}

export type APIClientUser = ClientUsersQuery['client']['users'][0]
export type APIClient = OrganizationClientsQuery['organization']['clients'][0]
export type APIClientInvoice = ClientInvoiceQuery['clientInvoice']
export type APIClientFile = ClientFilesQuery['client']['files'][0]
