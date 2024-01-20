const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/',
};

export const paths = {
  page404: '/404',
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
  }
};
