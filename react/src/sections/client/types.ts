import {
  CurrencyEnum,
  CustomerOrganizationInvoiceItemsQuery,
  CustomerOrganizationsQuery,
} from 'generated/graphql'

export type ClientItem = {
  id: string
  name: string
  programManagerName?: string
  phoneNumber1?: string
  phoneNumber2?: string
}

export type ClientTableFilters = {
  name: string
}

export type InvoiceItem = {
  id: string
  description: string
  unitPrice?: null | number
  unitPriceCurrency?: null | CurrencyEnum
  dateSent?: null | Date
  minutesAllocated?: number
}

export type InvoiceTableFilters = {
  description: string
}

export type APIClient = CustomerOrganizationsQuery['customerOrganizations'][0]
export type APIInvoiceItem =
  CustomerOrganizationInvoiceItemsQuery['customerOrganization']['invoiceItems'][0]
