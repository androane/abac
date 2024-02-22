import { useMemo, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import { format } from 'date-fns'

import FormProvider, { RHFSelect, RHFSwitch, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import {
  CurrencyEnum,
  UnitPriceTypeEnum,
  useOrganizationServicesQuery,
  useUpdateClientInvoiceItemMutation,
} from 'generated/graphql'
import { Button, DialogActions, Typography } from '@mui/material'
import ResponseHandler from 'components/response-handler'
import LoadingButton from '@mui/lab/LoadingButton'
import getErrorMessage from 'utils/api-codes'
import { APIInvoiceItem } from './types'

const OTHER_SERVICE = 'Other'

type Props = {
  invoiceId: string
  invoiceDate: null | Date
  onClose: () => void
  invoiceItem?: APIInvoiceItem
}

const UpdateInvoiceItem: React.FC<Props> = ({ invoiceId, invoiceDate, invoiceItem, onClose }) => {
  const result = useOrganizationServicesQuery()
  const [updateInvoiceItem, { loading }] = useUpdateClientInvoiceItemMutation()

  const { enqueueSnackbar } = useSnackbar()

  const [itemDate, setItemDate] = useState(invoiceItem?.itemDate)

  let standardServiceUuid = ''
  if (invoiceItem?.standardInvoiceItem?.uuid) {
    standardServiceUuid = invoiceItem.standardInvoiceItem.uuid
  } else if (invoiceItem) {
    standardServiceUuid = OTHER_SERVICE
  }

  const defaultValues = useMemo(
    () => ({
      standardServiceUuid,
      name: invoiceItem?.name || '',
      description: invoiceItem?.description,
      unitPrice: invoiceItem?.unitPrice,
      unitPriceCurrency: invoiceItem?.unitPriceCurrency || CurrencyEnum.RON,
      quantity: invoiceItem?.quantity || 1,
      minutesAllocated: invoiceItem?.minutesAllocated,
      isRecurring: invoiceItem?.isRecurring || false,
    }),
    [invoiceItem, standardServiceUuid],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string(),
        standardServiceUuid: Yup.string().required('Acest camp este obligatoriu'),
        unitPrice: Yup.number().nullable(),
        unitPriceCurrency: Yup.mixed<CurrencyEnum>().oneOf(Object.values(CurrencyEnum)).nullable(),
        description: Yup.string().nullable(),
        minutesAllocated: Yup.number().nullable(),
        quantity: Yup.number().required('Acest camp este obligatoriu'),
        isRecurring: Yup.boolean(),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await updateInvoiceItem({
        variables: {
          invoiceUuid: invoiceId,
          invoiceItemInput: {
            uuid: invoiceItem?.uuid,
            standardServiceUuid:
              data.standardServiceUuid === OTHER_SERVICE ? null : data.standardServiceUuid,
            itemDate,
            name: data.name,
            description: data.description,
            unitPrice: data.unitPrice,
            unitPriceCurrency: data.unitPriceCurrency,
            quantity: data.quantity,
            minutesAllocated: data.minutesAllocated,
            isRecurring: data.isRecurring,
          },
        },
      })
      form.reset()
      enqueueSnackbar('Factura actualizata cu succes!')
      onClose()
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  })

  const isNonStandardService = form.watch('standardServiceUuid') === OTHER_SERVICE

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
      <FormProvider methods={form} onSubmit={onSubmit}>
        <DialogTitle>Factura</DialogTitle>
        <DialogContent>
          <ResponseHandler {...result}>
            {({ organizationServices }) => {
              const selectedServiceIsFixedPrice =
                organizationServices.find(
                  service => service.uuid === form.watch('standardServiceUuid'),
                )?.unitPriceType === UnitPriceTypeEnum.FIXED
              return (
                <>
                  <br />
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    }}
                    sx={{ pb: 4 }}
                  >
                    <RHFSelect
                      native
                      name="standardServiceUuid"
                      label="Serviciu"
                      InputLabelProps={{ shrink: true }}
                    >
                      <option value="" />
                      <optgroup label="Serviciu non-standard">
                        <option value={OTHER_SERVICE} label="Serviciu non-standard" />
                      </optgroup>
                      <optgroup label="Servicii Existente">
                        {organizationServices.map(service => (
                          <option key={service.uuid} value={service.uuid}>
                            {service.name}
                          </option>
                        ))}
                      </optgroup>
                    </RHFSelect>
                    {isNonStandardService ? <RHFTextField name="name" label="Nume" /> : <div />}
                    <RHFTextField
                      name="description"
                      label="Explicatie (optional)"
                      multiline
                      rows={5}
                    />
                    <RHFSwitch
                      name="isRecurring"
                      labelPlacement="start"
                      label={
                        <>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            Este serviciu lunar?
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Bifeaza aceasta optiune daca vrei ca acest serviciu sa fie transferat
                            recurent si automat pe factura din urmatoarea luna.
                          </Typography>
                        </>
                      }
                      sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                    />
                    {isNonStandardService ? (
                      <>
                        <RHFTextField name="unitPrice" label="Suma" />
                        <RHFSelect
                          native
                          name="unitPriceCurrency"
                          label="Moneda"
                          InputLabelProps={{ shrink: true }}
                        >
                          {Object.keys(CurrencyEnum).map(currency => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </RHFSelect>
                      </>
                    ) : (
                      <RHFTextField name="minutesAllocated" label="Numar de minute alocate" />
                    )}
                    {selectedServiceIsFixedPrice && (
                      <RHFTextField name="quantity" label="Cantiate" />
                    )}
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
                  </Box>
                  <DialogActions>
                    <Button color="inherit" variant="outlined" onClick={onClose}>
                      {'<'} Inapoi
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={loading}>
                      {invoiceItem ? 'Salveaza' : 'Adauga la Factura'}
                    </LoadingButton>
                  </DialogActions>
                </>
              )
            }}
          </ResponseHandler>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateInvoiceItem
