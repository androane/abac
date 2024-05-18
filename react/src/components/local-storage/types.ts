export type LocalStorageValueProps = {
  category: string
  pmUuid: string
}

export type LocalStorageContextProps = LocalStorageValueProps & {
  onUpdate: (name: string, value: string | boolean) => void
  canReset: boolean
  onReset: VoidFunction
  onResetKey: (key: string) => VoidFunction
}
