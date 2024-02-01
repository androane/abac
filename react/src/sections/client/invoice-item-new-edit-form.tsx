import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import LoadingButton from '@mui/lab/LoadingButton'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions'
import { format } from 'date-fns'

import FormProvider, { RHFSelect, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import { CurrencyEnum, useUpdateClientInvoiceItemMutation } from 'generated/graphql'
import { InvoiceItem } from './types'

type Props = {
  invoiceId: string
  invoiceDate: null | Date
  onClose: () => void
  invoiceItem?: InvoiceItem
}

export default function InvoiceItemNewEditForm({
  invoiceId,
  invoiceDate,
  invoiceItem,
  onClose,
}: Props) {
  const [updateInvoiceItem] = useUpdateClientInvoiceItemMutation()

  const { enqueueSnackbar } = useSnackbar()

  const [itemDate, setItemDate] = useState(invoiceItem?.itemDate)

  const NewInvoiceSchema = Yup.object().shape({
    description: Yup.string().required('Acest camp este obligatoriu'),
    unitPrice: Yup.number().nullable(),
    unitPriceCurrency: Yup.mixed<CurrencyEnum>().oneOf(Object.values(CurrencyEnum)).nullable(),
    minutesAllocated: Yup.number().nullable(),
  })

  const defaultValues = useMemo(
    () => ({
      description: invoiceItem?.description || '',
      unitPrice: invoiceItem?.unitPrice,
      unitPriceCurrency: invoiceItem?.unitPriceCurrency,
      minutesAllocated: invoiceItem?.minutesAllocated,
    }),
    [invoiceItem],
  )

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = handleSubmit(async data => {
    try {
      await updateInvoiceItem({
        variables: {
          invoiceUuid: invoiceId,
          invoiceItemInput: {
            uuid: invoiceItem?.id,
            description: data.description,
            unitPrice: data.unitPrice,
            unitPriceCurrency: data.unitPriceCurrency,
            minutesAllocated: data.minutesAllocated,
            itemDate,
          },
        },
      })
      reset()
      enqueueSnackbar('Factura actualizata cu succes!')
      onClose()
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <Dialog
      fullWidth
      open
      maxWidth={false}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Factura</DialogTitle>
        <DialogContent>
          <br />
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="description" label="Descriere" multiline rows={5} />
            <DatePicker
              label="Ziua din luna"
              minDate={invoiceDate}
              value={itemDate && new Date(itemDate)}
              onChange={newItemDate =>
                newItemDate && setItemDate(format(newItemDate, 'yyyy-MM-dd'))
              }
              disableFuture
              name="itemDate"
              slotProps={{ textField: { fullWidth: true } }}
              views={['day']}
              sx={{
                maxWidth: { md: 180 },
              }}
            />
            <RHFTextField name="unitPrice" label="Cost" />
            <RHFSelect
              native
              name="unitPriceCurrency"
              label="Moneda"
              InputLabelProps={{ shrink: true }}
            >
              <option key="null" value="" />
              {Object.keys(CurrencyEnum).map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </RHFSelect>
            <RHFTextField name="minutesAllocated" label="Numar de minute alocate" />
          </Box>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              {'<'} Inapoi
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Salveaza Schimbarile
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}
