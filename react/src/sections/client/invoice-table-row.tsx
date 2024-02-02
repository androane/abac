import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { InvoiceItem } from './types'

type Props = {
  onEditRow: VoidFunction
  row: InvoiceItem
  onDeleteRow: VoidFunction
}

export default function InvoiceTableRow({ row, onEditRow, onDeleteRow }: Props) {
  const {
    index,
    isRecurring,
    description,
    unitPrice,
    unitPriceCurrency,
    itemDate,
    minutesAllocated,
  } = row

  const confirm = useBoolean()

  const popover = usePopover()

  return (
    <>
      <TableRow hover>
        <TableCell>{index}</TableCell>
        <TableCell sx={{ maxWidth: 300 }}>
          <Box
            onClick={onEditRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {description}
            {isRecurring && (
              <Label variant="soft" color="warning" sx={{ ml: 2 }}>
                LUNAR
              </Label>
            )}
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={itemDate && fDateTime(itemDate, 'd MMMM yyyy')}
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
            primary={`${unitPrice || ''} ${unitPriceCurrency || ''}`}
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
            primary={minutesAllocated}
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
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Sterge
          </Button>
        }
      />
    </>
  )
}
