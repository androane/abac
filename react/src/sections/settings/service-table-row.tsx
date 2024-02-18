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
import { StandardInvoiceItemFragment } from 'generated/graphql'
import { UNIT_PRICE_TYPE_LABELS } from 'sections/settings/constants'

type Props = {
  onEditRow: VoidFunction
  row: StandardInvoiceItemFragment
  onDeleteRow: VoidFunction
  loading: boolean
}

const ServiceTableRow: React.FC<Props> = ({ row, onEditRow, onDeleteRow, loading }) => {
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
        {['unitPrice', 'unitPriceCurrency', 'unitPriceType'].map(key => {
          let value = row[key as keyof StandardInvoiceItemFragment]
          if (value && key === 'unitPriceType') {
            value = UNIT_PRICE_TYPE_LABELS[value as keyof typeof UNIT_PRICE_TYPE_LABELS]
          }
          return (
            <TableCell sx={{ whiteSpace: 'nowrap' }} key={key}>
              <ListItemText
                primary={value}
                secondary=""
                primaryTypographyProps={{ typography: 'body2' }}
                secondaryTypographyProps={{
                  component: 'span',
                  color: 'text.disabled',
                }}
              />
            </TableCell>
          )
        })}
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
        title="Stergere Serviciu"
        content="Esti sigur ca vrei sa stergi acest serviciu?"
        action={
          <LoadingButton variant="contained" color="error" onClick={onDeleteRow} loading={loading}>
            Sterge
          </LoadingButton>
        }
      />
    </>
  )
}

export default ServiceTableRow
