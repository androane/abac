import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'

import FormProvider, { RHFSelect, RHFSwitch, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import {
  useUpdateClientActivityMutation,
  CurrencyEnum,
  UnitCostTypeEnum,
  ClientActivityFragmentDoc,
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import { MenuItem } from '@mui/material'
import { CombinedActivityType } from 'sections/client/types'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'
import { useLocalStorageContext } from 'components/local-storage'
import DialogActions from 'components/dialog-actions'
import { useAuthContext } from 'auth/hooks'
import { CATEGORY_CODE_TO_LABEL, getUnitCostTypeLabel } from 'utils/constants'

type Props = {
  activity: null | CombinedActivityType
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
  const isDisabledField = Boolean(activity && !activity.isCustom)

  const localStorage = useLocalStorageContext()

  const { user } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()

  const [updateClientActivity, { loading }] = useUpdateClientActivityMutation()

  const defaultValues = useMemo(
    () => ({
      name: activity?.name || '',
      description: activity?.description || '',
      categoryCode: activity?.category.code || localStorage.category,
      unitCost: activity?.unitCost || 0,
      unitCostCurrency: activity?.unitCostCurrency || CurrencyEnum.RON,
      unitCostType: activity?.unitCostType || UnitCostTypeEnum.HOURLY,
      isRecurrent: activity?.isRecurrent || false,
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
        isRecurrent: Yup.boolean(),
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
            uuid: activity?.uuid,
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
            isRecurrent: data.isRecurrent,
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            id: cache.identify({ uuid: clientUuid, __typename: 'ClientType' }),
            fields: {
              activities(existingActivities = []) {
                if (activity?.clientActivityUuid) {
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
      enqueueSnackbar(activity ? 'Activitatea a fost actualizată!' : 'Activitatea a fost adăugată!')
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
            <RHFTextField name="name" label="Nume" disabled={isDisabledField} />

            <RHFSelect name="categoryCode" label="Domeniu">
              <MenuItem value="" sx={{ color: 'text.secondary' }}>
                Alege
              </MenuItem>
              {user?.categories.map(c => (
                <MenuItem key={c.code} value={c.code}>
                  {CATEGORY_CODE_TO_LABEL[c.code as keyof typeof CATEGORY_CODE_TO_LABEL]}
                </MenuItem>
              ))}
            </RHFSelect>
            {canSeeCosts && (
              <>
                <RHFTextField name="unitCost" label="Cost" type="number" />
                <RHFSelect name="unitCostCurrency" label="Moneda">
                  {Object.keys(CurrencyEnum).map(currency => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </>
            )}
            <RHFSelect name="unitCostType" label="Tip Cost">
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
            <RHFSwitch
              name="isRecurrent"
              labelPlacement="start"
              label="Este activitate recurentă care se transferă automat în luna următoare?"
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
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
