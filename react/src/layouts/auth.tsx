import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import Lottie from 'lottie-react'

import { useResponsive } from 'hooks/use-responsive'

import { bgGradient } from 'theme/css'

import Logo from 'components/logo'
import loading from './accounting.json'

type Props = {
  title?: string
  children: React.ReactNode
}

const AuthLayout: React.FC<Props> = ({ children, title }) => {
  const theme = useTheme()

  const mdUp = useResponsive('up', 'md')

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
    />
  )

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        pt: { xs: 15, md: 20 },
        pb: { xs: 15, md: 0 },
      }}
    >
      {children}
    </Stack>
  )

  const renderSection = (
    <Stack
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94,
          ),
          imgUrl: '/assets/background/overlay_3.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title}
      </Typography>

      <Box
        sx={{
          px: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Lottie animationData={loading} loop autoplay />
      </Box>
    </Stack>
  )

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {renderLogo}

      {mdUp && renderSection}

      {renderContent}
    </Stack>
  )
}

export default AuthLayout
