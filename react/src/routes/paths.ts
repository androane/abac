export const ROOTS = {
  AUTH: 'auth',
  CLIENT: 'client',
  SETTINGS: 'settings',
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
      edit: (id: string) => `/${ROOTS.CLIENT}/${id}/edit`,
    },
    settings: {
      root: `/${ROOTS.SETTINGS}`,
      activities: `/${ROOTS.SETTINGS}/activities`,
      solutions: `/${ROOTS.SETTINGS}/solutions`,
      users: `/${ROOTS.SETTINGS}/users`,
    },
  },
}

export const LANDING_PAGE = paths.app.client.list
