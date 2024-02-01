import { yupResolver } from '@hookform/resolvers/yup'
import FormProvider, { RHFSelect, RHFTextField, RHFUploadAvatar } from 'components/hook-form'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import * as Yup from 'yup'

import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'

import { useRouter } from 'routes/hooks'
import { paths } from 'routes/paths'

import ResponseHandler from 'components/response-handler'
import { useSnackbar } from 'components/snackbar'
import { useClientProgramManagersQuery, useUpdateClientMutation } from 'generated/graphql'
import { fData } from 'utils/format-number'
import { APIClient } from './types'

type Props = {
  client?: APIClient
}

export default function ClientNewEditForm({ client }: Props) {
  const router = useRouter()

  const result = useClientProgramManagersQuery()

  const [updateClient] = useUpdateClientMutation()

  const { enqueueSnackbar } = useSnackbar()

  const NewClientSchema = Yup.object().shape({
    name: Yup.string().required('Numele este obligatoriu'),
    description: Yup.string().nullable(),
    imageUrl: Yup.mixed<any>().nullable(),
    phoneNumber1: Yup.string().nullable(),
    phoneNumber2: Yup.string().nullable(),
    programManagerUuid: Yup.string().nullable(),
    spvUsername: Yup.string().nullable(),
    spvPassword: Yup.string().nullable(),
    cui: Yup.string().nullable(),
  })

  const defaultValues = useMemo(
    () => ({
      name: client?.name || '',
      description: client?.description || '',
      imageUrl: null,
      phoneNumber1: client?.phoneNumber1,
      phoneNumber2: client?.phoneNumber2,
      programManagerUuid: client?.programManager?.uuid,
      spvUsername: client?.spvUsername,
      spvPassword: client?.spvPassword,
      cui: client?.cui,
    }),
    [client],
  )

  const methods = useForm({
    resolver: yupResolver(NewClientSchema),
    defaultValues,
  })

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = handleSubmit(async data => {
    try {
      await updateClient({
        variables: {
          uuid: client?.uuid,
          name: data.name,
          description: data.description,
          phoneNumber1: data.phoneNumber1,
          phoneNumber2: data.phoneNumber2,
          programManagerUuid: data.programManagerUuid,
          spvUsername: data.spvUsername,
          spvPassword: data.spvPassword,
          cui: data.cui,
        },
      })
      reset()
      enqueueSnackbar(client ? 'Client actualizat cu succes!' : 'Client creat cu succes!')
      router.push(paths.dashboard.client.list)
    } catch (error) {
      console.error(error)
    }
  })

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })

      if (file) {
        setValue('imageUrl', newFile, { shouldValidate: true })
      }
    },
    [setValue],
  )

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="imageUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Sunt permise *.jpeg, *.jpg, *.png, *.gif
                    <br /> dimensiunea maxima de {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

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
              <RHFTextField name="name" label="Nume" />
              <ResponseHandler {...result}>
                {({ clientProgramManagers }) => {
                  return (
                    <RHFSelect
                      native
                      name="programManagerUuid"
                      label="Responsabil"
                      InputLabelProps={{ shrink: true }}
                    >
                      <option key="null" value="" />
                      {clientProgramManagers.map(pm => (
                        <option key={pm.uuid} value={pm.uuid}>
                          {pm.name}
                        </option>
                      ))}
                    </RHFSelect>
                  )
                }}
              </ResponseHandler>
              <RHFTextField name="phoneNumber1" label="Telefon 1" />
              <RHFTextField name="phoneNumber2" label="Telefon 2" />
              <RHFTextField name="cui" label="CUI" />
            </Box>
            <Box sx={{ pt: 3 }}>
              <RHFTextField name="description" label="Descriere" multiline rows={5} />
            </Box>

            <Box
              sx={{ pt: 3 }}
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="spvUsername" label="Utilizator SPV" />
              <RHFTextField name="spvPassword" label="Parola SPV" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!client ? 'Adauga Client' : 'Salveaza Schimbarile'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
