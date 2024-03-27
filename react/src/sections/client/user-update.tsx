import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'

import FormProvider, { RHFSelect, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import {
  useUpdateClientUserMutation,
  ClientUserRoleEnum,
  ClientUserFragmentDoc,
} from 'generated/graphql'
import { APIClientUser } from 'sections/client/types'
import { ROLE_LABELS } from 'sections/client/constants'
import getErrorMessage from 'utils/api-codes'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'
import DialogActions from 'components/dialog-actions'
import { MenuItem } from '@mui/material'

type Props = {
  clientUuid: string
  user?: APIClientUser
  onClose: () => void
  canSeeInformation: boolean
}

const UpdateUser: React.FC<Props> = ({ clientUuid, user, onClose, canSeeInformation }) => {
  const [updateClientUser, { loading }] = useUpdateClientUserMutation()

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
        firstName: Yup.string().required(REQUIRED_FIELD_ERROR),
        lastName: Yup.string().required(REQUIRED_FIELD_ERROR),
        email: Yup.string(),
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
      await updateClientUser({
        variables: {
          clientUuid,
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
            id: cache.identify({ uuid: clientUuid, __typename: 'ClientType' }),
            fields: {
              users(existingUsers = []) {
                if (user) {
                  return existingUsers
                }
                const newUser = cache.writeFragment({
                  data: cacheData?.updateClientUser?.clientUser,
                  fragment: ClientUserFragmentDoc,
                })
                return [newUser, ...existingUsers]
              },
            },
          })
        },
      })

      form.reset()
      enqueueSnackbar('Persoana de contact a fost actualizată!')
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
        <DialogTitle>Persoană de Contact</DialogTitle>
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
            <RHFTextField name="phoneNumber" label="Telefon" />
            {canSeeInformation && (
              <>
                <RHFSelect native name="role" label="Rol" InputLabelProps={{ shrink: true }}>
                  <MenuItem value="" />
                  {Object.keys(ClientUserRoleEnum).map(role => (
                    <MenuItem key={role} value={role}>
                      {ROLE_LABELS[role as ClientUserRoleEnum]}
                    </MenuItem>
                  ))}
                </RHFSelect>
                {form.watch('role') === ClientUserRoleEnum.ASSOCIATE ? (
                  <RHFTextField
                    name="ownershipPercentage"
                    label="Procent din firmă"
                    type="number"
                  />
                ) : (
                  <div />
                )}
              </>
            )}
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
            <RHFTextField name="spvPassword" label="Parolă SPV" />
          </Box>

          <DialogActions label={user ? 'Salvează' : 'Adaugă'} onClose={onClose} loading={loading} />
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateUser
