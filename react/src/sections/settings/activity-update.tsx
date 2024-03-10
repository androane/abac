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
import getErrorMessage from 'utils/api-codes'
import { CATEGORY_CODES, getCategoryLabelFromCode, getUnitCostTypeLabel } from 'utils/constants'
import { MenuItem } from '@mui/material'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'

type Props = {
  organizationUuid: string
  activity?: ActivityFragment
  onClose: () => void
}

const UpdateActivity: React.FC<Props> = ({ organizationUuid, activity, onClose }) => {
  const [updateOrganizationActivity, { loading }] = useUpdateOrganizationActivityMutation()
  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: activity?.name || '',
      description: activity?.description || '',
      categoryCode: activity?.category.code || '',
      unitCost: activity?.unitCost || undefined,
      unitCostCurrency: activity?.unitCostCurrency || CurrencyEnum.RON,
      unitCostType: activity?.unitCostType || UnitCostTypeEnum.HOURLY,
    }),
    [activity],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(REQUIRED_FIELD_ERROR),
        description: Yup.string(),
        categoryCode: Yup.string().required(REQUIRED_FIELD_ERROR),
        unitCost: Yup.number(),
        unitCostCurrency: Yup.mixed<CurrencyEnum>()
          .oneOf(Object.values(CurrencyEnum))
          .required(REQUIRED_FIELD_ERROR),
        unitCostType: Yup.mixed<UnitCostTypeEnum>()
          .oneOf(Object.values(UnitCostTypeEnum))
          .required(REQUIRED_FIELD_ERROR),
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
            categoryCode: activity?.category.code || data.categoryCode,
            name: data.name,
            description: data.description,
            unitCost: data.unitCost,
            unitCostCurrency: data.unitCostCurrency,
            unitCostType: data.unitCostType,
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            id: cache.identify({ uuid: organizationUuid, __typename: 'OrganizationType' }),
            fields: {
              activities(existingActivities) {
                if (activity) {
                  return existingActivities
                }
                const newActivity = cache.writeFragment({
                  data: cacheData?.updateOrganizationActivity?.activity,
                  fragment: ActivityFragmentDoc,
                })
                return [newActivity, ...existingActivities]
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
        <DialogTitle>Serviciu</DialogTitle>
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
            <RHFSelect name="categoryCode" label="Domeniu" disabled={Boolean(activity)}>
              <MenuItem value="" sx={{ color: 'text.secondary' }}>
                Alege
              </MenuItem>
              {CATEGORY_CODES.map(catetgoryCode => (
                <MenuItem key={catetgoryCode} value={catetgoryCode}>
                  {getCategoryLabelFromCode(catetgoryCode)}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField name="unitCost" label="Cost" type="number" />
            <RHFSelect name="unitCostCurrency" label="Moneda">
              {Object.keys(CurrencyEnum).map(currency => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="unitCostType" label="Tip Cost">
              {Object.keys(UnitCostTypeEnum).map(type => (
                <MenuItem key={type} value={type}>
                  {getUnitCostTypeLabel(type as UnitCostTypeEnum)}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField multiline rows={5} name="description" label="Descriere" />
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
