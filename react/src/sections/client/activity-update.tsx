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
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'

import FormProvider, { RHFSelect, RHFSwitch, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import {
  CurrencyEnum,
  OrganizationServicesQuery,
  UnitCostTypeEnum,
  useUpdateClientInvoiceItemMutation,
} from 'generated/graphql'
import { Button, DialogActions, ListSubheader, MenuItem, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import getErrorMessage from 'utils/api-codes'
import { getCategoryLabelFromCode } from 'sections/settings/constants'
import React from 'react'
import { APIInvoiceItem } from './types'

const NON_STANDARD_SERVICE = 'non-standard'

type Props = {
  invoiceId: string
  invoiceDate: null | Date
  onClose: () => void
  invoiceItem?: APIInvoiceItem
  organizationServices: OrganizationServicesQuery['organizationServices']
}

const UpdateInvoiceItem: React.FC<Props> = ({
  organizationServices,
  invoiceId,
  invoiceDate,
  invoiceItem,
  onClose,
}) => {
  const [updateInvoiceItem, { loading }] = useUpdateClientInvoiceItemMutation()

  const { enqueueSnackbar } = useSnackbar()

  const [itemDate, setItemDate] = useState(invoiceItem?.itemDate)

  let standardServiceUuid = ''
  if (invoiceItem?.standardInvoiceItem?.uuid) {
    standardServiceUuid = invoiceItem.standardInvoiceItem.uuid
  } else if (invoiceItem) {
    standardServiceUuid = NON_STANDARD_SERVICE
  }

  const isHourlyService = (serviceUuid: string) =>
    Boolean(
      organizationServices
        .filter(s => s.unitCostType === UnitCostTypeEnum.HOURLY)
        .find(s => s.uuid === serviceUuid),
    )
  const isFixedService = (serviceUuid: string) =>
    Boolean(
      organizationServices
        .filter(s => s.unitCostType === UnitCostTypeEnum.FIXED)
        .find(s => s.uuid === serviceUuid),
    )

  const groupedOrganizationServices = groupBy(organizationServices, s => s.category?.code)

  const defaultValues = useMemo(
    () => ({
      standardServiceUuid,
      name: invoiceItem?.name || '',
      serviceCategoryCode: invoiceItem?.category.code || '',
      description: invoiceItem?.description,
      unitCost: invoiceItem?.unitCost,
      unitCostCurrency: invoiceItem?.unitCostCurrency || CurrencyEnum.RON,
      quantity: invoiceItem?.quantity || 1,
      minutesAllocated: invoiceItem?.minutesAllocated,
      isRecurring: invoiceItem?.isRecurring || false,
    }),
    [invoiceItem, standardServiceUuid],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string()
          .nullable()
          .when('standardServiceUuid', (uuids, schema) => {
            if (uuids[0] === NON_STANDARD_SERVICE)
              return schema.required('Acest câmp este obligatoriu')
            return schema
          }),
        serviceCategoryCode: Yup.string()
          .nullable()
          .when('standardServiceUuid', (uuids, schema) => {
            if (uuids[0] === NON_STANDARD_SERVICE)
              return schema.required('Acest câmp este obligatoriu')
            return schema
          }),
        standardServiceUuid: Yup.string().required('Acest câmp este obligatoriu'),
        unitCost: Yup.number()
          .nullable()
          .when('standardServiceUuid', (uuids, schema) => {
            if (uuids[0] === NON_STANDARD_SERVICE)
              return schema.required('Acest câmp este obligatoriu')
            return schema
          }),
        unitCostCurrency: Yup.mixed<CurrencyEnum>().oneOf(Object.values(CurrencyEnum)).nullable(),
        description: Yup.string().nullable(),
        minutesAllocated: Yup.number()
          .nullable()
          .when('standardServiceUuid', (uuids, schema) => {
            if (isHourlyService(uuids[0])) return schema.required('Acest câmp este obligatoriu')
            return schema
          }),
        quantity: Yup.number().required('Acest câmp este obligatoriu'),
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
              data.standardServiceUuid === NON_STANDARD_SERVICE ? null : data.standardServiceUuid,
            itemDate,
            name: data.name,
            serviceCategoryCode: data.serviceCategoryCode,
            description: data.description,
            unitCost: data.unitCost,
            unitCostCurrency: data.unitCostCurrency,
            quantity: data.quantity,
            minutesAllocated: data.minutesAllocated,
            isRecurring: data.isRecurring,
          },
        },
      })
      form.reset()
      enqueueSnackbar('Factură actualizată cu succes!')
      onClose()
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  })

  const isNonStandardService = form.watch('standardServiceUuid') === NON_STANDARD_SERVICE

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
            <RHFSelect name="standardServiceUuid" label="Serviciu">
              <MenuItem value={NON_STANDARD_SERVICE}>Serviciu non-standard</MenuItem>
              {Object.entries(groupedOrganizationServices).map(([categoryCode, services]) => {
                return [
                  <ListSubheader sx={{ color: 'primary.main' }}>
                    {getCategoryLabelFromCode(categoryCode)}
                  </ListSubheader>,
                  ...orderBy(services, 'name').map(service => (
                    <MenuItem key={service.uuid} value={service.uuid}>
                      {service.name}
                    </MenuItem>
                  )),
                ]
              })}
            </RHFSelect>
            <div />
            {isNonStandardService && (
              <>
                <RHFTextField name="name" label="Nume" />
                <RHFSelect name="serviceCategoryCode" label="Domeniu">
                  {Object.keys(groupedOrganizationServices).map(categoryCode => (
                    <MenuItem key={categoryCode} value={categoryCode}>
                      {getCategoryLabelFromCode(categoryCode)}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </>
            )}
            <RHFTextField name="description" label="Explicație (opțional)" multiline rows={5} />
            <RHFSwitch
              name="isRecurring"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Este serviciu lunar?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Bifează această opțiune dacă vrei ca acest serviciu să fie transferat recurent
                    și automat pe factura din luna următoare.
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
            {isNonStandardService && (
              <>
                <RHFTextField name="unitCost" label="Suma" />
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
              </>
            )}
            {isHourlyService(form.watch('standardServiceUuid')) && (
              <RHFTextField name="minutesAllocated" label="Număr de minute alocate" />
            )}
            {isFixedService(form.watch('standardServiceUuid')) && (
              <RHFTextField name="quantity" label="Cantitate" />
            )}
            <DatePicker
              label="Ziua din lună"
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
              {'<'} Înapoi
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {invoiceItem ? 'Salvează' : 'Adaugă la Factura'}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateInvoiceItem
