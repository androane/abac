import {
  ActivityType,
  ClientFilesQuery,
  ClientInvoiceQuery,
  ClientsQuery,
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
}

export type ClientActivityType = ActivityType & { isExecuted: boolean }

export type APIClientUser = ClientUsersQuery['clientUsers'][0]
export type APIClient = ClientsQuery['clients'][0]
export type APIClientInvoice = ClientInvoiceQuery['clientInvoice']
export type APIInvoiceItem = ClientInvoiceQuery['clientInvoice']['items'][0]
export type APIClientFile = ClientFilesQuery['client']['files'][0]
