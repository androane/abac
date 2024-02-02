import { forwardRef } from 'react'

import Link from '@mui/material/Link'
import Box, { BoxProps } from '@mui/material/Box'

import { useAuthContext } from 'auth/hooks'

import { RouterLink } from 'routes/components'
import { Stack } from '@mui/material'

const Logo = forwardRef<HTMLDivElement, BoxProps>(({ sx }, ref) => {
  const { user } = useAuthContext()

  return (
    <Stack pr={5} direction="row" alignItems="center" justifyContent="center">
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        <Box
          ref={ref}
          component="img"
          src={user?.organization.logoUrl}
          sx={{ maxWidth: 160, pb: 5, cursor: 'pointer', ...sx }}
        />
      </Link>
    </Stack>
  )
})

export default Logo
