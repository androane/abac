import LoadingButton from '@mui/lab/LoadingButton'
import { Switch } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { ConfirmDialog } from 'components/custom-dialog'

import CustomPopover, { usePopover } from 'components/custom-popover'
import Iconify from 'components/iconify'
import { useToggleClientActivityMutation } from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import React from 'react'
import { ClientActivityType } from 'sections/client/types'
import { getUnitCostTypeLabel } from 'utils/constants'

type Props = {
  loading: boolean
  row: ClientActivityType
  onEditRow: VoidFunction
  onDeleteRow: VoidFunction
}

const ActivityTableRow: React.FC<Props> = ({ loading, row, onEditRow, onDeleteRow }) => {
  const [toggleClientActivity, { loading: loadingToggle }] = useToggleClientActivityMutation()

  const confirm = useBoolean()

  const popover = usePopover()

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Switch
            checked={row.isExecuted}
            onChange={() => toggleClientActivity({ variables: { clientActivityUuid: row.uuid } })}
            disabled={loadingToggle}
            color="primary"
          />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row.name} sx={{ mr: 2 }}>
            {row.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box
            onClick={onEditRow}
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
            primary={row.unitCost}
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
            primary={getUnitCostTypeLabel(row.unitCostType)}
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
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Șterge Serviciu"
        content="Ești sigur că vrei să ștergi acest serviciu?"
        action={
          <LoadingButton variant="contained" color="error" onClick={onDeleteRow} loading={loading}>
            Șterge
          </LoadingButton>
        }
      />
    </>
  )
}

export default ActivityTableRow
