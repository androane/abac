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
      invoice: {
        list: `/${ROOTS.CLIENT}/invoice/list`,
      },
    },
    settings: {
      root: `/${ROOTS.SETTINGS}`,
      activity: {
        list: `/${ROOTS.SETTINGS}/activity/list`,
      },
      solution: {
        list: `/${ROOTS.SETTINGS}/solution/list`,
      },
    },
  },
}

export const LANDING_PAGE = paths.app.client.list
