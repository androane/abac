import { useMemo } from 'react'

import { useLocalStorage } from 'hooks/use-local-storage'

import { LocalStorageValueProps } from '../types'
import { LocalStorageContext } from './local-storage-context'

const STORAGE_KEY = 'app'

export enum APP_STORAGE_KEYS {
  CATEGORY = 'category',
}

export const DEFAULT_APP_STORAGE = {
  [APP_STORAGE_KEYS.CATEGORY]: '',
}

type LocalStorageProviderProps = {
  children: React.ReactNode
  defaultLocalStorage: LocalStorageValueProps
}

export function LocalStorageProvider({ children, defaultLocalStorage }: LocalStorageProviderProps) {
  const { state, update, reset } = useLocalStorage(STORAGE_KEY, defaultLocalStorage)

  const memoizedValue = useMemo(
    () => ({
      ...state,
      onUpdate: update,
      // Reset
      onReset: reset,
    }),
    [reset, update, state],
  )

  return (
    <LocalStorageContext.Provider value={memoizedValue}>{children}</LocalStorageContext.Provider>
  )
}
