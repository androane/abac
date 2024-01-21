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
      list: `${ROOTS.DASHBOARD}/client/list`,
      create: `${ROOTS.DASHBOARD}/client/create`,
    },
  },
}
