import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'

import { useAuthContext } from 'auth/hooks'
import FormProvider, { RHFCheckbox, RHFTextField } from 'components/hook-form'
import Iconify from 'components/iconify'
import { useBoolean } from 'hooks/use-boolean'
import getErrorMessage from 'utils/api-codes'
import { getLandingPage } from 'routes/paths'
import { useRouter } from 'routes/hooks'

const Login = () => {
  const { login } = useAuthContext()

  const router = useRouter()

  const [errorMsg, setErrorMsg] = useState('')

  const password = useBoolean()

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        email: Yup.string()
          .required('Adresa de email este obligatorie')
          .email('Adresa de email nu este validă'),
        password: Yup.string().required('Parola este obligatorie'),
        rememberMe: Yup.boolean().required(),
      }),
    ),
    defaultValues: useMemo(
      () => ({
        rememberMe: false,
        email: '',
        password: '',
      }),
      [],
    ),
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = handleSubmit(async data => {
    try {
      await login?.(data.email, data.password, data.rememberMe)

      router.replace(getLandingPage())
    } catch (error) {
      reset({
        email: '',
        password: '',
        rememberMe: false,
      })
      setErrorMsg(getErrorMessage((error as Error).message))
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

      <RHFCheckbox name="rememberMe" label="Păstrează-mă logat" />

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
        Intră în cont
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
