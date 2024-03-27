import { forwardRef } from 'react'

import Link from '@mui/material/Link'
import Box, { BoxProps } from '@mui/material/Box'

import { RouterLink } from 'routes/components'

export interface LogoProps extends BoxProps {
  disabledLink?: boolean
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(({ disabledLink = false, sx }) => {
  const logo = (
    <Box
      component="img"
      src="/logo/logo.png"
      sx={{ pb: 8, width: 150, cursor: 'pointer', ...sx }}
    />
  )

  if (disabledLink) {
    return logo
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  )
})

export default Logo
