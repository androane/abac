import Box from '@mui/material/Box'

import { useBoolean } from 'hooks/use-boolean'
import { useResponsive } from 'hooks/use-responsive'

import { useSettingsContext } from 'components/settings'

import Header from './header'
import Main from './main'
import NavMini from './nav-mini'
import NavVertical from './nav-vertical'

type Props = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext()

  const lgUp = useResponsive('up', 'lg')

  const nav = useBoolean()

  const isMini = settings.themeLayout === 'mini'

  const renderNavMini = <NavMini />

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    )
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {renderNavVertical}

        <Main>{children}</Main>
      </Box>
    </>
  )
}
