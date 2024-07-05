import { m } from 'framer-motion'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'

import { useAuthContext } from 'auth/hooks'
import { useRouter } from 'routes/hooks'

import { varHover } from 'components/animate'
import CustomPopover, { usePopover } from 'components/custom-popover'
import { useSnackbar } from 'components/snackbar'
import { Stack } from '@mui/material'
import { useBoolean } from 'hooks/use-boolean'
import ChangePassword from 'sections/auth/change-password'
import getErrorMessage from 'utils/api-codes'
import { clearAuthData } from 'auth/context/utils'
import { paths } from 'routes/paths'

const AccountPopover = () => {
  const router = useRouter()

  const { user } = useAuthContext()

  const { logout } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()

  const popover = usePopover()

  const showChangePassword = useBoolean()

  const handleLogout = async () => {
    try {
      await logout()
      clearAuthData()
      popover.onClose()
      router.replace(paths.auth.login)
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  }

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: theme => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: theme =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user?.photoUrl}
          alt={user?.name}
          sx={{
            width: 36,
            height: 36,
            border: theme => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider />
        <Stack sx={{ p: 1 }}>
          <MenuItem onClick={showChangePassword.onTrue}>Schimbă Parola</MenuItem>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Ieși din Cont
        </MenuItem>
      </CustomPopover>

      {showChangePassword.value && (
        <ChangePassword
          onClose={() => {
            showChangePassword.onFalse()
            popover.onClose()
          }}
        />
      )}
    </>
  )
}

export default AccountPopover
