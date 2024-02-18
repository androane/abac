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
        new: `/${ROOTS.CLIENT}/invoice/new`,
        edit: (id: string) => `/${ROOTS.CLIENT}/invoice/${id}/edit`,
      },
    },
    settings: {
      root: `/${ROOTS.SETTINGS}`,
      service: {
        list: `/${ROOTS.SETTINGS}/service/list`,
      },
    },
  },
}

export const LANDING_PAGE = paths.app.client.list
