import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import LoadingButton from '@mui/lab/LoadingButton'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions'

import FormProvider, { RHFSelect, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import {
  StandardInvoiceItemFragment,
  CurrencyEnum,
  useUpdateOrganizationServiceMutation,
  UnitPriceTypeEnum,
  StandardInvoiceItemFragmentDoc,
} from 'generated/graphql'
import { CATEGORY_CODE_TO_LABEL, UNIT_PRICE_TYPE_LABELS } from 'sections/settings/constants'
import getErrorMessage from 'utils/api-codes'

type Props = {
  categoryCode: string
  service?: StandardInvoiceItemFragment
  onClose: () => void
}

const UpdateService: React.FC<Props> = ({ categoryCode, service, onClose }) => {
  const [updateOrganizationService, { loading }] = useUpdateOrganizationServiceMutation()
  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: service?.name || '',
      unitPrice: service?.unitPrice || undefined,
      unitPriceCurrency: service?.unitPriceCurrency || CurrencyEnum.RON,
      unitPriceType: service?.unitPriceType || UnitPriceTypeEnum.HOURLY,
    }),
    [service],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required('Acest câmp este obligatoriu'),
        unitPrice: Yup.number(),
        unitPriceCurrency: Yup.mixed<CurrencyEnum>()
          .oneOf(Object.values(CurrencyEnum))
          .required('Acest câmp este obligatoriu'),
        unitPriceType: Yup.mixed<UnitPriceTypeEnum>()
          .oneOf(Object.values(UnitPriceTypeEnum))
          .required('Acest câmp este obligatoriu'),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await updateOrganizationService({
        variables: {
          standardInvoiceItemInput: {
            uuid: service?.uuid,
            categoryCode,
            name: data.name,
            unitPrice: data.unitPrice || 0,
            unitPriceCurrency: data.unitPriceCurrency,
            unitPriceType: data.unitPriceType,
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            fields: {
              organizationServices(existingServices = []) {
                if (!service) {
                  const newService = cache.writeFragment({
                    data: cacheData?.updateOrganizationService?.service,
                    fragment: StandardInvoiceItemFragmentDoc,
                  })
                  return [newService, ...existingServices]
                }
                return existingServices
              },
            },
          })
        },
      })
      form.reset()
      enqueueSnackbar('Serviciu actualizat cu succes!')
      onClose()
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
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
      <FormProvider methods={form} onSubmit={onSubmit}>
        <DialogTitle>
          Serviciu {CATEGORY_CODE_TO_LABEL[categoryCode as keyof typeof CATEGORY_CODE_TO_LABEL]}
        </DialogTitle>
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
            <RHFTextField name="name" label="Nume serviciu" />
            <div />
            <RHFTextField name="unitPrice" label="Cost" />
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
            <RHFSelect
              native
              name="unitPriceType"
              label="Tip tarifare"
              InputLabelProps={{ shrink: true }}
            >
              {Object.keys(UnitPriceTypeEnum).map(type => (
                <option key={type} value={type}>
                  {UNIT_PRICE_TYPE_LABELS[type as UnitPriceTypeEnum]}
                </option>
              ))}
            </RHFSelect>
          </Box>
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              {'<'} Înapoi
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {service ? 'Salvează' : 'Adaugă Serviciu'}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateService
