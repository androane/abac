import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { ConfirmDialog } from 'components/custom-dialog'
import CustomPopover, { usePopover } from 'components/custom-popover'
import Iconify from 'components/iconify'

import { useBoolean } from 'hooks/use-boolean'
import { ROLE_LABELS } from 'sections/client/constants'
import { ClientUserRoleEnum } from 'generated/graphql'
import { APIClientUser } from 'sections/client/types'
import LoadingButton from '@mui/lab/LoadingButton'

type Props = {
  loading: boolean
  canSeeInformation: boolean
  row: APIClientUser
  onEditRow: VoidFunction
  onDeleteRow: VoidFunction
}

const UserTableRow: React.FC<Props> = ({
  canSeeInformation,
  loading,
  row,
  onEditRow,
  onDeleteRow,
}) => {
  const confirm = useBoolean()

  const popover = usePopover()

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Box
            onClick={onEditRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {row.lastName} {row.firstName}
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={row.email}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={row.clientProfile.phoneNumber}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        {canSeeInformation && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            <ListItemText
              primary={ROLE_LABELS[row.clientProfile.role as ClientUserRoleEnum]}
              secondary=""
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            />
          </TableCell>
        )}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={row.clientProfile.spvUsername}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={row.clientProfile.spvPassword}
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

        <MenuItem
          onClick={() => {
            onEditRow()
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
        title="Șterge Persoană de Contact"
        content="Ești sigur că vrei să ștergi aceasta Persoană de Contact?"
        action={
          <LoadingButton loading={loading} variant="contained" color="error" onClick={onDeleteRow}>
            Șterge
          </LoadingButton>
        }
      />
    </>
  )
}

export default UserTableRow
