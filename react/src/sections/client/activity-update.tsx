import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'

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
import { useLocalStorageContext } from 'components/local-storage'
import DialogActions from 'components/dialog-actions'

type Props = {
  activity: null | GenericActivityType
  clientUuid: string
  date: Date
  onClose: () => void
  canSeeCosts: boolean
}

const UpdateClientActivity: React.FC<Props> = ({
  activity,
  clientUuid,
  date,
  onClose,
  canSeeCosts,
}) => {
  const [updateClientActivity, { loading }] = useUpdateClientActivityMutation()

  const localStorage = useLocalStorageContext()

  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: activity?.name || '',
      description: activity?.description || '',
      categoryCode: activity?.category.code || localStorage.category,
      unitCost: activity?.unitCost || undefined,
      unitCostCurrency: activity?.unitCostCurrency || CurrencyEnum.RON,
      unitCostType: activity?.unitCostType || UnitCostTypeEnum.HOURLY,
      quantity: activity?.quantity || 1,
    }),
    [activity, localStorage.category],
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
        quantity: Yup.number()
          .required(REQUIRED_FIELD_ERROR)
          .min(1, 'Cantitatea trebuie să fie mai mare de 0'),
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
            quantity: data.quantity,
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
      enqueueSnackbar('Serviciul a fost actualizat!')
      onClose()
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  })

  const disabled = Boolean(activity)

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
              variant={disabled ? 'filled' : 'outlined'}
            />

            <RHFSelect
              name="categoryCode"
              label="Domeniu"
              disabled={disabled}
              variant={disabled ? 'filled' : 'outlined'}
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
            {canSeeCosts && (
              <>
                <RHFTextField name="unitCost" label="Cost" type="number" />
                <RHFSelect
                  name="unitCostCurrency"
                  label="Moneda"
                  variant={disabled ? 'filled' : 'outlined'}
                  disabled={disabled ? !activity?.isCustom : false}
                >
                  {Object.keys(CurrencyEnum).map(currency => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </>
            )}
            <RHFSelect
              name="unitCostType"
              label="Tip Cost"
              variant={disabled ? 'filled' : 'outlined'}
              disabled={disabled ? !activity?.isCustom : false}
            >
              {Object.keys(UnitCostTypeEnum).map(type => (
                <MenuItem key={type} value={type}>
                  {getUnitCostTypeLabel(type as UnitCostTypeEnum)}
                </MenuItem>
              ))}
            </RHFSelect>
            {form.watch('unitCostType') === UnitCostTypeEnum.FIXED ? (
              <RHFTextField name="quantity" label="Cantitate" type="number" />
            ) : (
              <div />
            )}
            <RHFTextField multiline rows={5} name="description" label="Descriere" />
          </Box>
          <DialogActions
            label={activity ? 'Salvează' : 'Adaugă Activitate'}
            loading={loading}
            onClose={onClose}
          />
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateClientActivity
