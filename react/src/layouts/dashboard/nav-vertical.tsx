import { useEffect } from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import { alpha } from '@mui/material/styles'

import { usePathname } from 'routes/hooks'

import { useResponsive } from 'hooks/use-responsive'
import { bgGradient } from 'theme/css'

import Logo from 'components/logo'
import { NavSectionVertical } from 'components/nav-section'
import Scrollbar from 'components/scrollbar'

import { useAuthContext } from 'auth/hooks'
import { grey } from 'theme/palette'
import NavToggleButton from '../common/nav-toggle-button'
import { NAV } from '../config-layout'
import useNavData from './config-navigation'

type Props = {
  openNav: boolean
  onCloseNav: VoidFunction
}

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useAuthContext()

  const pathname = usePathname()

  const lgUp = useResponsive('up', 'lg')

  const navData = useNavData()

  useEffect(() => {
    if (openNav) {
      onCloseNav()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />

      <NavSectionVertical
        data={navData}
        slotProps={{
          currentRole: user?.role,
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  )

  return (
    <Box
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(grey[200], 0.2),
          endColor: alpha(grey[400], 0.2),
        }),
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: theme => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  )
}
