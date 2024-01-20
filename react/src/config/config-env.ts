const getViteEnv = (key: string, defaultValue?: string) => import.meta.env[`VITE_${key}`] || defaultValue


export const GRAPHQL_ENDPOINT = getViteEnv('GRAPHQL_ENDPOINT', '')
