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
import { UNIT_PRICE_TYPE_LABELS } from 'sections/settings/constants'
import { UnitPriceTypeEnum } from 'generated/graphql'
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
            primary={UNIT_PRICE_TYPE_LABELS[row.unitPriceType as UnitPriceTypeEnum]}
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
            primary={`${row.unitPrice} ${row.unitPriceCurrency}`}
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
            primary={row.quantity}
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
            primary={`${row.unitPrice * row.quantity} ${row.unitPriceCurrency}`}
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
          Sterge
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow()
            popover.onClose()
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Modifica
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Stergere Intrare"
        content="Esti sigur ca vrei sa stergi acesta intrare?"
        action={
          <LoadingButton loading={loading} variant="contained" color="error" onClick={onDeleteRow}>
            Sterge
          </LoadingButton>
        }
      />
    </>
  )
}

export default InvoiceTableRow
