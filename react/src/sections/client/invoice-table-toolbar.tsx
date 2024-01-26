import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import LoadingButton from '@mui/lab/LoadingButton'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { RouterLink } from 'routes/components'
import MenuItem from '@mui/material/MenuItem'
import CustomPopover, { usePopover } from 'components/custom-popover'

import Iconify from 'components/iconify'
import { InvoiceStatusEnum, useUpdateClientInvoiceStatusMutation } from 'generated/graphql'
import { enqueueSnackbar } from 'components/snackbar'

type Props = {
  onAddInvoiceItem: () => void
  invoiceId: string
  invoiceDate: null | Date
  invoiceDateSent: null | Date
  onChangeInvoiceDate: (newDate: null | Date) => void
}

export default function InvoiceTableToolbar({
  onAddInvoiceItem,
  invoiceId,
  invoiceDate,
  invoiceDateSent,
  onChangeInvoiceDate,
}: Props) {
  const [updateInvoiceStatus, { loading }] = useUpdateClientInvoiceStatusMutation()
  const popover = usePopover()

  const status = invoiceDateSent ? InvoiceStatusEnum.SENT : InvoiceStatusEnum.DRAFT

  const onChangeStatus = async (newStatus: InvoiceStatusEnum) => {
    try {
      await updateInvoiceStatus({
        variables: {
          invoiceUuid: invoiceId,
          status: newStatus,
        },
      })
      enqueueSnackbar('Status actualizat cu success')
    } catch (error) {
      console.error(error)
    }
  }

  const statusToLabel = {
    [InvoiceStatusEnum.DRAFT]: 'Draft',
    [InvoiceStatusEnum.SENT]: 'Trimisa',
  }

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <DatePicker
        label="Vezi factura pentru luna"
        minDate={new Date('2024-01-01')}
        disableFuture
        value={invoiceDate}
        onChange={onChangeInvoiceDate}
        slotProps={{ textField: { fullWidth: true } }}
        views={['month', 'year']}
        sx={{
          maxWidth: { md: 180 },
        }}
      />
      <LoadingButton
        size="large"
        color={status === InvoiceStatusEnum.SENT ? 'success' : 'warning'}
        variant="contained"
        loading={loading}
        loadingIndicator="…"
        endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        onClick={popover.onOpen}
        sx={{ textTransform: 'capitalize' }}
      >
        {statusToLabel[status]}
      </LoadingButton>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {Object.keys(InvoiceStatusEnum).map(st => (
          <MenuItem
            key={st}
            selected={st === status}
            onClick={() => {
              onChangeStatus(st as InvoiceStatusEnum)
              popover.onClose()
            }}
          >
            {statusToLabel[st as InvoiceStatusEnum]}
          </MenuItem>
        ))}
      </CustomPopover>
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        <Button
          disabled={status === InvoiceStatusEnum.SENT}
          onClick={onAddInvoiceItem}
          component={RouterLink}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Adauga la Factura
        </Button>
      </Stack>
    </Stack>
  )
}
