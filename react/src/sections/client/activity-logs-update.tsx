import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import LoadingButton from '@mui/lab/LoadingButton'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import FormProvider from 'components/hook-form'
import { format } from 'date-fns'
import { useSnackbar } from 'components/snackbar'
import {
  useUpdateClientActivityLogsMutation,
  useClientActivityLogsQuery,
  ClientActivityLogType,
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import ResponseHandler from 'components/response-handler'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

import Iconify from 'components/iconify'
import { RHFTextField } from 'components/hook-form'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'

const DEFAULT_LOG = {
  uuid: undefined,
  minutesAllocated: 0,
  description: '',
  date: new Date(),
}

const LogUpdate: React.FC<{ date: Date }> = ({ date }) => {
  const { control, setValue } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'logs',
  })

  return (
    <Box sx={{ p: 3 }}>
      {fields.map((item, index) => {
        return (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ width: 1, mb: 5 }}
            alignItems="center"
          >
            <RHFTextField
              type="number"
              name={`logs[${index}].minutesAllocated`}
              label="Minute Alocate"
              InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
              name={`logs[${index}].description`}
              label="Descriere"
              InputLabelProps={{ shrink: true }}
            />
            <Controller
              name={`logs[${index}].date`}
              control={control}
              render={({ field }) => {
                return (
                  <DatePicker
                    {...field}
                    label="Ziua din lună"
                    minDate={date}
                    value={field.value}
                    onChange={newDate => newDate && setValue(`logs[${index}].date`, newDate)}
                    disableFuture
                    slotProps={{ textField: { fullWidth: true } }}
                    views={['day']}
                    sx={{
                      maxWidth: { md: 180 },
                    }}
                  />
                )
              }}
            />
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => remove(index)}
            >
              Șterge
            </Button>
          </Stack>
        )
      })}

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Button
        size="small"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={() => append(DEFAULT_LOG)}
        sx={{ flexShrink: 0 }}
      >
        Adaugă
      </Button>
    </Box>
  )
}

type Props = {
  date: Date
  activityName: string
  clientActivityUuid: string
  logs: ClientActivityLogType[]
  onClose: () => void
}

const UpdateClientActivityLogs: React.FC<Props> = ({
  date,
  activityName,
  clientActivityUuid,
  logs: initialLogs,
  onClose,
}) => {
  const [updateClientActivityLogs, { loading }] = useUpdateClientActivityLogsMutation()

  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(() => {
    const logs = initialLogs.map(log => ({
      uuid: log.uuid,
      description: log.description || '',
      minutesAllocated: log.minutesAllocated,
      date: new Date(log.date),
    }))
    return {
      logs: logs.length ? logs : [DEFAULT_LOG],
    }
  }, [initialLogs])

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        logs: Yup.array().of(
          Yup.object().shape({
            uuid: Yup.string(),
            description: Yup.string(),
            minutesAllocated: Yup.number().required(REQUIRED_FIELD_ERROR),
            date: Yup.date().required(REQUIRED_FIELD_ERROR),
          }),
        ),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await updateClientActivityLogs({
        variables: {
          clientActivityUuid,
          clientActivityLogsInput: data.logs
            ? data.logs.map(log => ({
                ...log,
                minutesAllocated: log.minutesAllocated || 0,
                date: format(log.date, 'yyyy-MM-dd'),
              }))
            : [],
        },
      })
      form.reset()
      enqueueSnackbar('Loguri actualizate cu succes!')
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
        <DialogTitle>{activityName}</DialogTitle>
        <DialogContent>
          <br />
          <LogUpdate date={date} />
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              {'<'} Înapoi
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Salvează
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

type ContainerProps = {
  date: Date
  activityName: string
  clientActivityUuid: string
  onClose: () => void
}

const UpdateClientActivityLogsContainer: React.FC<ContainerProps> = ({
  date,
  activityName,
  clientActivityUuid,
  onClose,
}) => {
  const result = useClientActivityLogsQuery({
    variables: {
      clientActivityUuid,
    },
  })

  return (
    <ResponseHandler {...result}>
      {({ clientActivity }) => {
        return (
          <UpdateClientActivityLogs
            date={date}
            activityName={activityName}
            clientActivityUuid={clientActivityUuid}
            logs={clientActivity.logs}
            onClose={onClose}
          />
        )
      }}
    </ResponseHandler>
  )
}

export default UpdateClientActivityLogsContainer
