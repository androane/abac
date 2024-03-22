export type LocalStorageValueProps = {
  category: string
}

export type LocalStorageContextProps = LocalStorageValueProps & {
  // Update
  onUpdate: (name: string, value: string | boolean) => void
  // Reset
  canReset: boolean
  onReset: VoidFunction
}
