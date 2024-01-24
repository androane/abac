import 'global.css'

import { useScrollToTop } from 'hooks/use-scroll-to-top'
import { LocalizationProvider } from 'locales'

import ThemeProvider from 'theme'

import { AuthProvider } from 'auth/context'
import { MotionLazy } from 'components/animate/motion-lazy'
import ProgressBar from 'components/progress-bar'
import { SettingsDrawer, SettingsProvider } from 'components/settings'
import SnackbarProvider from 'components/snackbar/snackbar-provider'
import Router from 'routes/sections'

export default function App() {
  useScrollToTop()

  return (
    <AuthProvider>
      <LocalizationProvider>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light', // 'light' | 'dark'
            themeDirection: 'ltr', //  'rtl' | 'ltr'
            themeContrast: 'default', // 'default' | 'bold'
            themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <SnackbarProvider>
                <SettingsDrawer />
                <ProgressBar />

                <Router />
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </AuthProvider>
  )
}
