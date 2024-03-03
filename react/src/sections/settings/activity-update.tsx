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
  ActivityFragment,
  CurrencyEnum,
  useUpdateOrganizationActivityMutation,
  UnitCostTypeEnum,
  ActivityFragmentDoc,
} from 'generated/graphql'
import { getCategoryLabelFromCode, getUnitCostTypeLabel } from 'sections/settings/constants'
import getErrorMessage from 'utils/api-codes'

type Props = {
  organizationUuid: string
  categoryCode: string
  activity?: ActivityFragment
  onClose: () => void
}

const UpdateActivity: React.FC<Props> = ({ organizationUuid, categoryCode, activity, onClose }) => {
  const [updateOrganizationActivity, { loading }] = useUpdateOrganizationActivityMutation()
  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: activity?.name || '',
      unitCost: activity?.unitCost || undefined,
      unitCostCurrency: activity?.unitCostCurrency || CurrencyEnum.RON,
      unitCostType: activity?.unitCostType || UnitCostTypeEnum.HOURLY,
    }),
    [activity],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required('Acest câmp este obligatoriu'),
        unitCost: Yup.number(),
        unitCostCurrency: Yup.mixed<CurrencyEnum>()
          .oneOf(Object.values(CurrencyEnum))
          .required('Acest câmp este obligatoriu'),
        unitCostType: Yup.mixed<UnitCostTypeEnum>()
          .oneOf(Object.values(UnitCostTypeEnum))
          .required('Acest câmp este obligatoriu'),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await updateOrganizationActivity({
        variables: {
          activityInput: {
            uuid: activity?.uuid,
            categoryCode,
            name: data.name,
            unitCost: data.unitCost,
            unitCostCurrency: data.unitCostCurrency,
            unitCostType: data.unitCostType,
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            id: cache.identify({ uuid: organizationUuid, __typename: 'OrganizationType' }),
            fields: {
              activities(activities) {
                if (activity) {
                  return activities
                }
                const newActivity = cache.writeFragment({
                  data: cacheData?.updateOrganizationActivity?.activity,
                  fragment: ActivityFragmentDoc,
                })
                return [newActivity, ...activities]
              },
            },
          })
        },
      })
      form.reset()
      enqueueSnackbar('Serviciu actualizat cu succes!')
      onClose()
    } catch (error) {
      console.log(error)
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
        <DialogTitle>Serviciu {getCategoryLabelFromCode(categoryCode)}</DialogTitle>
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
            <RHFTextField name="unitCost" label="Cost" />
            <RHFSelect
              native
              name="unitCostCurrency"
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
              name="unitCostType"
              label="Tip Cost"
              InputLabelProps={{ shrink: true }}
            >
              {Object.keys(UnitCostTypeEnum).map(type => (
                <option key={type} value={type}>
                  {getUnitCostTypeLabel(type as UnitCostTypeEnum)}
                </option>
              ))}
            </RHFSelect>
          </Box>
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              {'<'} Înapoi
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {activity ? 'Salvează' : 'Adaugă Serviciu'}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateActivity
