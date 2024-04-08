import Stack from '@mui/material/Stack'
import LoadingButton from '@mui/lab/LoadingButton'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import MenuItem from '@mui/material/MenuItem'
import CustomPopover, { usePopover } from 'components/custom-popover'

import Iconify from 'components/iconify'
import { InvoiceStatusEnum, useUpdateClientInvoiceStatusMutation } from 'generated/graphql'
import { enqueueSnackbar } from 'components/snackbar'
import getErrorMessage from 'utils/api-codes'
import React from 'react'
import { getAuthorizationHeader } from 'config/config-apollo'
import { BACKEND_HOST } from 'config/config-env'

type Props = {
  invoiceId: string
  invoiceDate: Date
  invoiceDateSent?: null | string
  onChangeDate: (newDate: Date) => void
}

const InvoiceTableToolbar: React.FC<Props> = ({
  invoiceId,
  invoiceDate,
  invoiceDateSent,
  onChangeDate,
}) => {
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
      enqueueSnackbar('Statusul a fost actualizat!')
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  }

  const onDownloadDetails = () => {
    const url = `${BACKEND_HOST}/download/invoice-details?invoice_uuid=${invoiceId}`
    console.log(url)

    const headers = new Headers()
    headers.append('Authorization', getAuthorizationHeader())

    fetch(url, { method: 'GET', headers })
      .then(response => response.blob())
      .then(blob => {
        const _url = window.URL.createObjectURL(blob)
        window.open(_url, '_blank')?.focus()
      })
      .catch(error => console.error('Error:', error))
  }

  const statusToLabel = {
    [InvoiceStatusEnum.DRAFT]: 'Draft',
    [InvoiceStatusEnum.SENT]: 'Trimisă',
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
        onChange={newDate => newDate && onChangeDate(newDate)}
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
      {/* <Button onClick={onDownloadDetails}>
        <Iconify icon="eva:download-fill" />
        Descarcă detalii
      </Button> */}
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
    </Stack>
  )
}

export default InvoiceTableToolbar
