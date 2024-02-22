import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'

import FormProvider, { RHFTextField } from 'components/hook-form'
import Iconify from 'components/iconify'
import { useBoolean } from 'hooks/use-boolean'
import { API_CODES } from 'utils/api-codes'
import { useChangePasswordMutation } from 'generated/graphql'
import { useSnackbar } from 'notistack'
import { Box, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material'

type Props = {
  onClose(): void
}

const ChangePassword: React.FC<Props> = ({ onClose }) => {
  const [changePassword, { loading }] = useChangePasswordMutation()

  const { enqueueSnackbar } = useSnackbar()

  const [errorMsg, setErrorMsg] = useState('')

  const password = useBoolean()

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        currentPassword: Yup.string().required('Parola este obligatorie'),
        newPassword1: Yup.string().required('Parola este obligatorie'),
        newPassword2: Yup.string()
          .required('Parola este obligatorie')
          .oneOf([Yup.ref('newPassword1')], 'Parolele nu sunt identice'),
      }),
    ),
  })

  const { reset, handleSubmit } = methods

  const onSubmit = handleSubmit(async data => {
    try {
      const response = await changePassword({
        variables: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword1,
        },
      })
      if (response.data?.changePassword?.error) {
        throw new Error(response.data.changePassword.error.message)
      }
      enqueueSnackbar('Parola a fost schimbata cu success')
      reset()
      onClose()
    } catch (error) {
      reset()
      setErrorMsg(error instanceof Error ? API_CODES[error.message] : 'Ceva a mers gresit')
    }
  })

  const renderForm = (
    <Stack spacing={2.5} sx={{ mt: 3, mb: 3 }}>
      <Grid xs={12} md={8}>
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
            name="currentPassword"
            label="Parola Actuala"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div />
          <RHFTextField
            name="newPassword1"
            label="Alege o Parola Noua"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <RHFTextField
            name="newPassword2"
            label="Confirma Parola Noua"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>

      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
        >
          Schimba Parola
        </LoadingButton>
      </Stack>
    </Stack>
  )

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
      <DialogTitle>Schimba Parola</DialogTitle>
      <DialogContent>
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePassword
