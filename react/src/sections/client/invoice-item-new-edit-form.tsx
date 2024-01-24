import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'

import FormProvider, { RHFSelect, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import { CurrencyEnum } from 'generated/graphql'
import { InvoiceItem } from './types'

type Props = {
  onBack: () => void
  invoiceItem?: InvoiceItem
}

export default function InvoiceNewEditForm({ invoiceItem, onBack }: Props) {
  const { enqueueSnackbar } = useSnackbar()

  const NewInvoiceSchema = Yup.object().shape({
    description: Yup.string().required('Descrierea este obligatorie'),
    unitPrice: Yup.number().nullable(),
    unitPriceCurrency: Yup.string().nullable(),
    itemDate: Yup.date().nullable(),
    minutesAllocated: Yup.number().nullable(),
  })

  const defaultValues = useMemo(
    () => ({
      description: invoiceItem?.description || '',
      unitPrice: invoiceItem?.unitPrice,
      unitPriceCurrency: invoiceItem?.unitPriceCurrency,
      itemDate: invoiceItem?.itemDate,
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
      await new Promise(resolve => setTimeout(resolve, 500))
      reset()
      enqueueSnackbar(invoiceItem ? 'Factura actualizata cu succes!' : 'Factura creata cu succes!')

      onBack()
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="description" label="Descriere" />
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
              <RHFTextField name="itemDate" label="Data" />
              <RHFTextField name="minutesAllocated" label="Numar de minute alocate" />
            </Box>

            <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button color="inherit" variant="outlined" onClick={onBack}>
                {'<'} Inapoi
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Salveaza Schimbarile
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
