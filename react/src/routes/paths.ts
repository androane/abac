export const ROOTS = {
  AUTH: 'auth',
  CLIENT: 'client',
  SETTINGS: 'settings',
  REPORTS: 'reports',
}

export const paths = {
  page404: '/404',
  auth: {
    login: `${ROOTS.AUTH}/login`,
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
}

export const LANDING_PAGE = paths.app.client.list
