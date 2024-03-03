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
import { fDateTime } from 'utils/format-time'
import Label from 'components/label'
import { getUnitCostTypeLabel } from 'sections/settings/constants'
import LoadingButton from '@mui/lab/LoadingButton'
import { APIInvoiceItem } from './types'

type Props = {
  index: number
  loading: boolean
  invoiceIsLocked: boolean
  row: APIInvoiceItem
  onEditRow: VoidFunction
  onDeleteRow: VoidFunction
}

const InvoiceTableRow: React.FC<Props> = ({
  index,
  invoiceIsLocked,
  row,
  onEditRow,
  onDeleteRow,
  loading,
}) => {
  const confirm = useBoolean()

  const popover = usePopover()

  return (
    <>
      <TableRow hover>
        <TableCell>{index}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Box
            onClick={() => !invoiceIsLocked && onEditRow()}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {row.name}
            {row.isRecurring && (
              <Label variant="soft" color="warning" sx={{ ml: 2 }}>
                LUNAR
              </Label>
            )}
          </Box>
        </TableCell>
        <TableCell sx={{ maxWidth: 300 }}>
          <ListItemText
            primary={row.description}
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
            primary={row.itemDate && fDateTime(row.itemDate, 'd MMMM yyyy')}
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
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={row.minutesAllocated}
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
            primary={`${row.unitCost} ${row.unitCostCurrency}`}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={row.quantity}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={`${row.total.toFixed(2)} ${row.unitCostCurrency}`}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            disabled={invoiceIsLocked}
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
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
        title="Șterge Intrare"
        content="Ești sigur că vrei să ștergi acesta intrare?"
        action={
          <LoadingButton loading={loading} variant="contained" color="error" onClick={onDeleteRow}>
            Șterge
          </LoadingButton>
        }
      />
    </>
  )
}

export default InvoiceTableRow
