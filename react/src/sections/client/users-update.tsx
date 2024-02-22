import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import LoadingButton from '@mui/lab/LoadingButton'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions'

import FormProvider, { RHFSelect, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import {
  useUpdateClientUserMutation,
  ClientUserRoleEnum,
  ClientUserFragmentDoc,
} from 'generated/graphql'
import { APIClientUser } from 'sections/client/types'
import { ROLE_LABELS } from 'sections/client/constants'
import { Alert } from '@mui/material'
import getErrorMessage from 'utils/api-codes'

type Props = {
  clientId: string
  user?: APIClientUser
  onClose: () => void
}

const UpdateUser: React.FC<Props> = ({ clientId, user, onClose }) => {
  const [updateClientUser, { loading }] = useUpdateClientUserMutation()

  const [errorMsg, setErrorMsg] = useState('')

  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      ownershipPercentage: user?.clientProfile.ownershipPercentage || undefined,
      role: user?.clientProfile.role || undefined,
      spvUsername: user?.clientProfile.spvUsername || '',
      spvPassword: user?.clientProfile.spvPassword || '',
      phoneNumber: user?.clientProfile.phoneNumber || '',
    }),
    [user],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        firstName: Yup.string().required('Acest camp este obligatoriu'),
        lastName: Yup.string().required('Acest camp este obligatoriu'),
        email: Yup.string().required('Acest camp este obligatoriu'),
        ownershipPercentage: Yup.number().min(0).max(100).nullable(),
        role: Yup.mixed<ClientUserRoleEnum>().oneOf(Object.values(ClientUserRoleEnum)).nullable(),
        spvUsername: Yup.string().nullable(),
        spvPassword: Yup.string().nullable(),
        phoneNumber: Yup.string().nullable(),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      const response = await updateClientUser({
        variables: {
          clientUuid: clientId,
          clientUserInput: {
            uuid: user?.uuid,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            ownershipPercentage: data.ownershipPercentage,
            spvUsername: data.spvUsername,
            spvPassword: data.spvPassword,
            phoneNumber: data.phoneNumber,
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            fields: {
              clientUsers(existingClientUsers = []) {
                if (!user) {
                  const newUser = cache.writeFragment({
                    data: cacheData?.updateClientUser?.clientUser,
                    fragment: ClientUserFragmentDoc,
                  })
                  return [newUser, ...existingClientUsers]
                }
                return existingClientUsers
              },
            },
          })
        },
      })
      if (response.data?.updateClientUser?.error) {
        throw new Error(response.data.updateClientUser.error.message)
      }

      form.reset()
      enqueueSnackbar('Persoana actualizata cu succes!')
      onClose()
    } catch (error) {
      setErrorMsg(getErrorMessage((error as Error).message))
    }
  })

  console.log('errorMsg', errorMsg)

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
        <DialogTitle>Persoana de Contact</DialogTitle>
        <DialogContent>
          <br />
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="firstName" label="Prenume" />
            <RHFTextField name="lastName" label="Nume" />
            <RHFTextField name="email" label="Email" />
            <RHFTextField name="phoneNumber" label="Telefon" />
            <RHFTextField name="ownershipPercentage" label="Procent din firma" />
            <RHFSelect native name="role" label="Rol" InputLabelProps={{ shrink: true }}>
              <option key="null" value="" />
              {Object.keys(ClientUserRoleEnum).map(role => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role as ClientUserRoleEnum]}
                </option>
              ))}
            </RHFSelect>
          </Box>

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
            <RHFTextField name="spvUsername" label="Utilizator SPV" />
            <RHFTextField name="spvPassword" label="Parola SPV" />
          </Box>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              {'<'} Inapoi
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {user ? 'Salveaza' : 'Adauga Persoana'}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateUser
