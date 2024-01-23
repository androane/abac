const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '',
}

export const paths = {
  page404: '/404',
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  dashboard: {
    client: {
      root: `${ROOTS.DASHBOARD}/client`,
      list: `${ROOTS.DASHBOARD}/client/list`,
      new: `${ROOTS.DASHBOARD}/client/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/client/${id}/edit`,
      invoice: {
        list: `${ROOTS.DASHBOARD}/client/invoice/list`,
        new: `${ROOTS.DASHBOARD}/client/invoice/new`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/client/invoice/${id}/edit`,
      },
    },
  },
}
