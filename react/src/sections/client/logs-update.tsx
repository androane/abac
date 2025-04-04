import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import FormProvider from 'components/hook-form'
import { format } from 'date-fns'
import { useSnackbar } from 'components/snackbar'

import {
  useUpdateClientActivityLogsMutation,
  useClientActivityLogsQuery,
  useClientSolutionLogsQuery,
  useUpdateClientSolutionLogsMutation,
  ClientActivityLogType,
  ClientSolutionLogType,
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import ResponseHandler from 'components/response-handler'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import Iconify from 'components/iconify'
import { RHFTextField } from 'components/hook-form'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'
import DialogActions from 'components/dialog-actions'
import { Dialog } from '@mui/material'

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
            key={item.id}
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ width: 1, mb: 5 }}
            alignItems="center"
          >
            <RHFTextField
              type="number"
              name={`logs[${index}].minutesAllocated`}
              label="Minute Alocate"
            />
            <RHFTextField name={`logs[${index}].description`} label="Descriere" />
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

      <Button
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
  uuid: string
  logs: ClientActivityLogType[] | ClientSolutionLogType[]
  isSolution?: boolean
  onClose: () => void
}

const UpdateLogs: React.FC<Props> = ({
  date,
  activityName,
  uuid,
  onClose,
  logs: initialLogs,
  isSolution = false,
}) => {
  const [updateClientActivityLogs, { loading: loading1 }] = useUpdateClientActivityLogsMutation()
  const [updateClientSolutionLogs, { loading: loading2 }] = useUpdateClientSolutionLogsMutation()

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
    const logsInput = data.logs
      ? data.logs.map(log => ({
          ...log,
          minutesAllocated: log.minutesAllocated || 0,
          date: format(log.date, 'yyyy-MM-dd'),
        }))
      : []

    try {
      if (isSolution) {
        await updateClientSolutionLogs({
          variables: {
            clientSolutionUuid: uuid,
            logsInput,
          },
        })
      } else {
        await updateClientActivityLogs({
          variables: {
            clientActivityUuid: uuid,
            logsInput,
          },
        })
      }
      form.reset()
      enqueueSnackbar('Timpii au fost actualizați')
      onClose()
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  })

  return (
    <FormProvider methods={form} onSubmit={onSubmit}>
      <DialogTitle>{activityName}</DialogTitle>
      <DialogContent>
        <br />
        <LogUpdate date={date} />
        <DialogActions onClose={onClose} loading={loading1 || loading2} />
      </DialogContent>
    </FormProvider>
  )
}

type UpdateClientActivityLogsProps = {
  clientUuid: string
  date: Date
  activityName: string
  clientActivityUuid: string
  onClose: () => void
}

export const UpdateClientActivityLogs: React.FC<UpdateClientActivityLogsProps> = ({
  clientUuid,
  date,
  activityName,
  clientActivityUuid,
  onClose,
}) => {
  const result = useClientActivityLogsQuery({
    variables: {
      clientUuid,
      clientActivityUuid,
    },
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
      <ResponseHandler {...result}>
        {({ client }) => {
          return (
            <UpdateLogs
              date={date}
              activityName={activityName}
              uuid={clientActivityUuid}
              logs={client.activity.logs}
              onClose={onClose}
            />
          )
        }}
      </ResponseHandler>
    </Dialog>
  )
}

type UpdateClientSolutionLogsProps = {
  clientUuid: string
  date: Date
  activityName: string
  clientSolutionUuid: string
  onClose: () => void
}

export const UpdateClientSolutionLogs: React.FC<UpdateClientSolutionLogsProps> = ({
  clientUuid,
  date,
  activityName,
  clientSolutionUuid,
  onClose,
}) => {
  const result = useClientSolutionLogsQuery({
    variables: {
      clientUuid,
      clientSolutionUuid,
    },
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
      <ResponseHandler {...result}>
        {({ client }) => {
          return (
            <UpdateLogs
              date={date}
              activityName={activityName}
              uuid={clientSolutionUuid}
              logs={client.solution.logs}
              onClose={onClose}
              isSolution
            />
          )
        }}
      </ResponseHandler>
    </Dialog>
  )
}
