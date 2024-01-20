const ROOTS = {
  AUTH: '/auth',
  CLIENTS: '/clients',
}

export const paths = {
  page404: '/404',
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  clients: {
    root: ROOTS.CLIENTS,
  },
}
