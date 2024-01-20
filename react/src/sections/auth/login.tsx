import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'

import { useRouter, useSearchParams } from 'routes/hooks'

import { useBoolean } from 'hooks/use-boolean'

import { PATH_AFTER_LOGIN } from 'config/config-global'

import { useAuthContext } from 'auth/hooks'
import FormProvider, { RHFTextField } from 'components/hook-form'
import Iconify from 'components/iconify'
import { API_CODES } from 'utils/api-codes'

const Login = () => {
  const { login } = useAuthContext()

  const router = useRouter()

  const [errorMsg, setErrorMsg] = useState('')

  const searchParams = useSearchParams()

  const returnTo = searchParams.get('returnTo')

  const password = useBoolean()

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required('Adresa de email este obligatorie')
      .email('Adresa de email nu este valida'),
    password: Yup.string().required('Parola este obligatorie'),
  })

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = handleSubmit(async data => {
    try {
      await login?.(data.email, data.password)

      router.push(returnTo || PATH_AFTER_LOGIN)
    } catch (error) {
      reset()
      setErrorMsg(error instanceof Error ? API_CODES[error.message] : 'Ceva a mers gresit')
    }
  })

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Adresa de email" />

      <RHFTextField
        name="password"
        label="Parola"
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

      <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Ai uitat parola?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Intra in cont
      </LoadingButton>
    </Stack>
  )

  return (
    <>
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  )
}

export default Login
