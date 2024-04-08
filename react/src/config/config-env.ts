const getViteEnv = (key: string, defaultValue?: string) =>
  import.meta.env[`VITE_${key}`] || defaultValue

export const BACKEND_HOST = getViteEnv('BACKEND_HOST', '')
