import {
  ClientFilesQuery,
  ClientInvoiceQuery,
  ClientUserRoleEnum,
  ClientsQuery,
  CurrencyEnum,
} from 'generated/graphql'

export type ClientItem = {
  id: string
  name: string
  programManager?: null | {
    id: string
    name: string
  }
  phoneNumber1?: string
  phoneNumber2?: string
}

export type ClientTableFilters = {
  name: string
  programManagerId?: string
}

export type InvoiceItem = {
  id: string
  index: number
  description: string
  unitPrice?: null | number
  unitPriceCurrency?: null | CurrencyEnum
  itemDate?: null | string
  minutesAllocated?: null | number
  isRecurring: boolean
}

export type InvoiceTableFilters = {
  description: string
}

export type ClientUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  role?: null | ClientUserRoleEnum
  ownershipPercentage?: null | number
  spvUsername?: null | string
  spvPassword?: null | string
}

export type APIClient = ClientsQuery['clients'][0]
export type APIClientInvoice = ClientInvoiceQuery['clientInvoice']
export type APIInvoiceItem = ClientInvoiceQuery['clientInvoice']['items'][0]
export type APIClientFile = ClientFilesQuery['client']['files'][0]
