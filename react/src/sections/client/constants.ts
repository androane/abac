import { ClientUserRoleEnum } from 'generated/graphql'

export const ROLE_LABELS = {
  [ClientUserRoleEnum.ADMINSTRATOR]: 'Administrator',
  [ClientUserRoleEnum.ASSOCIATE]: 'Asociat',
  [ClientUserRoleEnum.EMPLOYEE]: 'Angajat',
  [ClientUserRoleEnum.MANAGER]: 'Manager',
}

export enum TABS_VALUES {
  GENERAL = 'g',
  ACTIVITY = 'a',
  INVOICE = 'i',
  FILES = 'f',
  OPCSB = 'o',
  USERS = 'u',
}
