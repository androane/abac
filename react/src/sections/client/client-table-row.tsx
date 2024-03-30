import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { useBoolean } from 'hooks/use-boolean'

import { ConfirmDialog } from 'components/custom-dialog'
import CustomPopover, { usePopover } from 'components/custom-popover'
import Iconify from 'components/iconify'
import { APIClient } from 'sections/client/types'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAuthContext } from 'auth/hooks'
import { UserPermissionsEnum } from 'generated/graphql'
import { paths } from 'routes/paths'
import { useRouter } from 'routes/hooks'
import { TABS_VALUES } from 'sections/client/constants'

type Props = {
  loading: boolean
  row: APIClient
  onDeleteRow: VoidFunction
}

const ClientTableRow: React.FC<Props> = ({ loading, row, onDeleteRow }) => {
  const confirm = useBoolean()

  const popover = usePopover()

  const router = useRouter()

  const { hasPermission } = useAuthContext()

  const onGoToClient = () => router.push(paths.app.client.detail(row.uuid, TABS_VALUES.GENERAL))

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row.name} sx={{ mr: 2 }}>
            {row.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box
            onClick={onGoToClient}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {row.name}
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={row.programManager?.name}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {hasPermission(UserPermissionsEnum.HAS_ORGANIZATION_ADMIN) && (
          <MenuItem
            onClick={() => {
              confirm.onTrue()
              popover.onClose()
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Șterge
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            onGoToClient()
            popover.onClose()
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Modifică
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Șterge Client"
        content="Ești sigur că vrei să ștergi acest client?"
        action={
          <LoadingButton loading={loading} variant="contained" color="error" onClick={onDeleteRow}>
            Șterge
          </LoadingButton>
        }
      />
    </>
  )
}

export default ClientTableRow
