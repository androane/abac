import { yupResolver } from '@hookform/resolvers/yup'
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

import { fData } from 'utils/format-number'

import FormProvider, { RHFTextField, RHFUploadAvatar } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import { APICustomerOrganization } from './types'

type Props = {
  client?: APICustomerOrganization
}

export default function CustomerOrganizationNewEditForm({ client }: Props) {
  const router = useRouter()

  const { enqueueSnackbar } = useSnackbar()

  const NewClientSchema = Yup.object().shape({
    name: Yup.string().required('Numele este obligatoriu'),
    description: Yup.string().nullable(),
    imageUrl: Yup.mixed<any>().nullable(),
  })

  const defaultValues = useMemo(
    () => ({
      name: client?.name || '',
      description: client?.description,
      imageUrl: null,
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
      await new Promise(resolve => setTimeout(resolve, 500))
      reset()
      enqueueSnackbar(client ? 'Client actualizat cu succes!' : 'Client creat cu succes!')
      router.push(paths.dashboard.client.list)
      console.info('DATA', data)
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
              <RHFTextField name="description" label="Descriere" multiline rows={5} />
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
