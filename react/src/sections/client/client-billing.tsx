import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'

import { useRouter } from 'routes/hooks'
import { paths } from 'routes/paths'

import FormProvider, { RHFSelect, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import { CurrencyEnum, CustomerOrganizationsQuery } from 'generated/graphql'

type Props = {
  currentClient?: CustomerOrganizationsQuery['customerOrganizations'][0]
}

export default function UserNewEditForm({ currentClient }: Props) {
  const router = useRouter()

  const { enqueueSnackbar } = useSnackbar()

  const NewUserSchema = Yup.object().shape({
    monthlyInvoiceAmmount: Yup.number().nullable(),
    monthlyInvoiceCurrency: Yup.string().nullable(),
  })

  const defaultValues = useMemo(
    () => ({
      monthlyInvoiceAmmount: currentClient?.monthlyInvoiceAmmount,
      monthlyInvoiceCurrency: currentClient?.monthlyInvoiceCurrency,
    }),
    [currentClient],
  )

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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
      enqueueSnackbar('Client actualizat cu succes!')
      router.push(paths.dashboard.client.list)
      console.info('DATA', data)
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
              <RHFTextField name="monthlyInvoiceAmmount" label="Tarif Lunar Fix" />
              <RHFSelect
                native
                name="monthlyInvoiceCurrency"
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
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
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
