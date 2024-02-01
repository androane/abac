import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import { useMemo } from 'react'
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
import { ClientUser } from 'sections/client/types'
import { ROLE_LABELS } from 'sections/client/constants'

type Props = {
  clientId: string
  user?: ClientUser
  onClose: () => void
}

export default function UserNewEditForm({ clientId, user, onClose }: Props) {
  const [updateClientUser] = useUpdateClientUserMutation()

  const { enqueueSnackbar } = useSnackbar()

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Acest camp este obligatoriu'),
    lastName: Yup.string().required('Acest camp este obligatoriu'),
    email: Yup.string().required('Acest camp este obligatoriu'),
    ownershipPercentage: Yup.number().min(0).max(100).nullable(),
    role: Yup.mixed<ClientUserRoleEnum>().oneOf(Object.values(ClientUserRoleEnum)).nullable(),
    spvUsername: Yup.string().nullable(),
    spvPassword: Yup.string().nullable(),
  })

  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      ownershipPercentage: user?.ownershipPercentage,
      role: user?.role,
      spvUsername: user?.spvUsername,
      spvPassword: user?.spvPassword,
    }),
    [user],
  )

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = handleSubmit(async data => {
    try {
      await updateClientUser({
        variables: {
          clientUuid: clientId,
          clientUserInput: {
            uuid: user?.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            ownershipPercentage: data.ownershipPercentage,
            spvUsername: data.spvUsername,
            spvPassword: data.spvPassword,
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
      reset()
      enqueueSnackbar('Persoana actualizata cu succes!')
      onClose()
    } catch (error) {
      console.error(error)
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
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Persoana de Contact</DialogTitle>
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
            <RHFTextField name="firstName" label="Prenume" />
            <RHFTextField name="lastName" label="Nume" />
            <RHFTextField name="email" label="Email" />
            <RHFSelect native name="role" label="Rol" InputLabelProps={{ shrink: true }}>
              <option key="null" value="" />
              {Object.keys(ClientUserRoleEnum).map(role => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role as ClientUserRoleEnum]}
                </option>
              ))}
            </RHFSelect>
            <RHFTextField name="ownershipPercentage" label="Procent din firma" />
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
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Salveaza Schimbarile
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}
