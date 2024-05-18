import { useMemo } from 'react'

import { useLocalStorage } from 'hooks/use-local-storage'

import { LocalStorageValueProps } from '../types'
import { LocalStorageContext } from './local-storage-context'

const STORAGE_KEY = 'app'

export enum APP_STORAGE_KEYS {
  CATEGORY = 'category',
  PROGRAM_MANAGER = 'pmUuid',
}

export const DEFAULT_APP_STORAGE = {
  [APP_STORAGE_KEYS.CATEGORY]: '',
  [APP_STORAGE_KEYS.PROGRAM_MANAGER]: '',
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
      onReset: reset,
      onResetKey: (key: APP_STORAGE_KEYS) => {
        update(key, DEFAULT_APP_STORAGE[key])
      },
    }),
    [reset, update, state],
  )

  return (
    <LocalStorageContext.Provider value={memoizedValue}>{children}</LocalStorageContext.Provider>
  )
}
