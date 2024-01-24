import {
  CurrencyEnum,
  CustomerOrganizationInvoiceQuery,
  CustomerOrganizationsQuery,
} from 'generated/graphql'

export type CustomerOrganizationItem = {
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
  itemDate?: null | Date
  minutesAllocated?: null | number
}

export type InvoiceTableFilters = {
  description: string
}

export type APICustomerOrganization = CustomerOrganizationsQuery['customerOrganizations'][0]
export type APIInvoiceItem =
  CustomerOrganizationInvoiceQuery['customerOrganizationInvoice']['items'][0]
