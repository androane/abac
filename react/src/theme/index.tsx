import merge from 'lodash/merge'
import { useMemo } from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider as MuiThemeProvider, ThemeOptions, createTheme } from '@mui/material/styles'

import { useLocales } from 'locales'

import { useSettingsContext } from 'components/settings'
// system
import { palette } from './palette'
import { shadows } from './shadows'
import { typography } from './typography'
// options
import { customShadows } from './custom-shadows'
import { createContrast } from './options/contrast'
import { createPresets } from './options/presets'
import { componentsOverrides } from './overrides'

type Props = {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: Props) {
  const { currentLang } = useLocales()

  const settings = useSettingsContext()

  const presets = createPresets(settings.themeColorPresets)

  const contrast = createContrast(settings.themeContrast, settings.themeMode)

  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette(settings.themeMode),
        ...presets.palette,
        ...contrast.palette,
      },
      customShadows: {
        ...customShadows(settings.themeMode),
        ...presets.customShadows,
      },
      shadows: shadows(settings.themeMode),
      shape: { borderRadius: 8 },
      typography,
    }),
    [settings.themeMode, presets.palette, presets.customShadows, contrast.palette],
  )

  const theme = createTheme(memoizedValue as ThemeOptions)

  theme.components = merge(componentsOverrides(theme), contrast.components)

  const themeWithLocale = useMemo(
    () => createTheme(theme, currentLang.systemValue),
    [currentLang.systemValue, theme],
  )

  return (
    <MuiThemeProvider theme={themeWithLocale}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
