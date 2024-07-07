import { getAuthData } from 'auth/context/utils'
import { UserRoleEnum } from 'generated/graphql'

export const ROOTS = {
  AUTH: 'auth',
  CLIENT: 'client',
  SETTINGS: 'settings',
  REPORTS: 'reports',
  CLIENT_APP: 'c',
  DOCUMENTS: 'documents',
}

export const paths = {
  page404: '/404',
  auth: {
    login: `/${ROOTS.AUTH}/login`,
  },
  app: {
    client: {
      root: `/${ROOTS.CLIENT}`,
      list: `/${ROOTS.CLIENT}/list`,
      new: `/${ROOTS.CLIENT}/new`,
      groups: `/${ROOTS.CLIENT}/groups`,
      detail: (id: string, tab: string) => `/${ROOTS.CLIENT}/${id}/${tab}`,
    },
    settings: {
      root: `/${ROOTS.SETTINGS}`,
      activities: `/${ROOTS.SETTINGS}/activities`,
      solutions: `/${ROOTS.SETTINGS}/solutions`,
      users: `/${ROOTS.SETTINGS}/users`,
    },
    reports: {
      root: `/${ROOTS.REPORTS}`,
    },
  },
  clientApp: {
    root: `/${ROOTS.CLIENT_APP}`,
    detail: (id: string, tab: string) => `/${ROOTS.CLIENT_APP}/${id}/${tab}`,
  },
}

export const getLandingPage = () => {
  const { userRole } = getAuthData()
  if (userRole === UserRoleEnum.PM) {
    return paths.app.client.list
  }
  return paths.clientApp.root
}
