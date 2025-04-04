import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import LoadingButton from '@mui/lab/LoadingButton'

import { useBoolean } from 'hooks/use-boolean'

import { ConfirmDialog } from 'components/custom-dialog'
import CustomPopover, { usePopover } from 'components/custom-popover'
import Iconify from 'components/iconify'
import { ActivityFragment } from 'generated/graphql'
import { CATEGORY_CODE_TO_LABEL, getUnitCostTypeLabel } from 'utils/constants'

type Props = {
  onEditRow: VoidFunction
  row: ActivityFragment
  onDeleteRow: VoidFunction
  loading: boolean
}

const ActivityTableRow: React.FC<Props> = ({ row, onEditRow, onDeleteRow, loading }) => {
  const confirm = useBoolean()

  const popover = usePopover()

  return (
    <>
      <TableRow hover>
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
            primary={
              CATEGORY_CODE_TO_LABEL[row.category.code as keyof typeof CATEGORY_CODE_TO_LABEL]
            }
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
            primary={row.unitCostCurrency}
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
