export type SettingsValueProps = {
  themeMode: 'light' | 'dark'
  themeContrast: 'default' | 'bold'
  themeLayout: 'vertical' | 'mini'
  themeColorPresets: 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
}

export type SettingsContextProps = SettingsValueProps & {
  // Update
  onUpdate: (name: string, value: string | boolean) => void
  // Direction by lang
  onChangeDirectionByLang: (lang: string) => void
  // Reset
  canReset: boolean
  onReset: VoidFunction
  // Drawer
  open: boolean
  onToggle: VoidFunction
  onClose: VoidFunction
}
