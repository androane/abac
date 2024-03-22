import { createContext, useContext } from 'react'

import { LocalStorageContextProps } from '../types'

export const LocalStorageContext = createContext({} as LocalStorageContextProps)

export const useLocalStorageContext = () => {
  const context = useContext(LocalStorageContext)

  if (!context) throw new Error('useLocalStorageContext must be use inside LocalStorageProvider')

  return context
}
