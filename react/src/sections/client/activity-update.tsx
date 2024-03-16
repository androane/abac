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
  useUpdateClientActivityMutation,
  CurrencyEnum,
  UnitCostTypeEnum,
  ClientActivityFragmentDoc,
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import { CATEGORY_CODES, getCategoryLabelFromCode, getUnitCostTypeLabel } from 'utils/constants'
import { MenuItem } from '@mui/material'
import { GenericActivityType } from 'sections/client/types'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'

type Props = {
  activity: null | GenericActivityType
  clientUuid: string
  date: Date
  onClose: () => void
}

const UpdateClientActivity: React.FC<Props> = ({ activity, clientUuid, date, onClose }) => {
  const [updateClientActivity, { loading }] = useUpdateClientActivityMutation()

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
      await updateClientActivity({
        variables: {
          clientUuid,
          activityInput: {
            uuid: activity?.activityUuid,
            name: data.name,
            description: data.description,
            categoryCode: data.categoryCode,
            unitCost: data.unitCost,
            unitCostCurrency: data.unitCostCurrency,
            unitCostType: data.unitCostType,
          },
          clientActivityInput: {
            uuid: activity?.clientActivityUuid,
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            id: cache.identify({ uuid: clientUuid, __typename: 'ClientType' }),
            fields: {
              activities(existingActivities = []) {
                if (activity) {
                  return existingActivities
                }
                const newActivity = cache.writeFragment({
                  data: cacheData?.updateClientActivity?.clientActivity,
                  fragment: ClientActivityFragmentDoc,
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
        <DialogTitle>{activity ? 'Actualizează Activitate' : 'Adaugă Activitate'}</DialogTitle>
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
            <RHFTextField
              name="name"
              label="Nume"
              disabled={activity ? !activity.isCustom : false}
              InputLabelProps={{ shrink: true }}
            />

            <RHFSelect
              name="categoryCode"
              label="Domeniu"
              disabled={Boolean(activity)}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="" sx={{ color: 'text.secondary' }}>
                Alege
              </MenuItem>
              {CATEGORY_CODES.map(catetgoryCode => (
                <MenuItem key={catetgoryCode} value={catetgoryCode}>
                  {getCategoryLabelFromCode(catetgoryCode)}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField
              name="unitCost"
              label="Cost"
              type="number"
              InputLabelProps={{ shrink: true }}
            />
            <RHFSelect
              name="unitCostCurrency"
              label="Moneda"
              InputLabelProps={{ shrink: true }}
              disabled={activity ? !activity.isCustom : false}
            >
              {Object.keys(CurrencyEnum).map(currency => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect
              InputLabelProps={{ shrink: true }}
              name="unitCostType"
              label="Tip Cost"
              disabled={activity ? !activity.isCustom : false}
            >
              {Object.keys(UnitCostTypeEnum).map(type => (
                <MenuItem key={type} value={type}>
                  {getUnitCostTypeLabel(type as UnitCostTypeEnum)}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField
              multiline
              rows={5}
              name="description"
              label="Descriere"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              {'<'} Înapoi
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {activity ? 'Salvează' : 'Adaugă Activitate'}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateClientActivity
