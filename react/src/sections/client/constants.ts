import { ClientUserRoleEnum } from 'generated/graphql'

export const ROLE_LABELS = {
  [ClientUserRoleEnum.ADMINSTRATOR]: 'Administrator',
  [ClientUserRoleEnum.ASSOCIATE]: 'Asociat',
  [ClientUserRoleEnum.EMPLOYEE]: 'Angajat',
  [ClientUserRoleEnum.MANAGER]: 'Manager',
}
