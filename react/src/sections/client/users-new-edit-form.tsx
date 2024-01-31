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
  ClientInvoiceQuery,
  ClientInvoiceDocument,
  ClientUserRoleEnum,
} from 'generated/graphql'
import { ClientUser } from 'sections/client/types'

type Props = {
  clientId: string
  user: ClientUser
  onClose: () => void
}

export default function UserNewEditForm({ clientId, user, onClose }: Props) {
  const [updateClientUser] = useUpdateClientUserMutation()

  const { enqueueSnackbar } = useSnackbar()

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Acest camp este obligatoriu'),
    lastName: Yup.string().required('Acest camp este obligatoriu'),
    email: Yup.string().required('Acest camp este obligatoriu'),
    role: Yup.mixed<ClientUserRoleEnum>().oneOf(Object.values(ClientUserRoleEnum)).nullable(),
    spvUsername: Yup.string().nullable(),
    spvPassword: Yup.string().nullable(),
  })

  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email,
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
            spvUsername: data.spvUsername,
            spvPassword: data.spvPassword,
          },
        },
        // update(cache) {
        //   cache.modify({
        //     fields: {
        //       clientInvoice(result: ClientInvoiceQuery['clientInvoice'], { readField }) {
        //         return {
        //           ...result,
        //           items: result.items.map(item =>
        //             readField('uuid', item) === invoiceItem?.id ? item : invoiceItem,
        //           ),
        //         }
        //       },
        //     },
        //   })
        // },
        update: (cache, { data: responseData }) => {
          const cacheClientsInvoiceQuery = {
            query: ClientInvoiceDocument,
            variables: {
              uuid: clientId,
              month: 1,
              year: 2024,
            },
          }
          if (!responseData?.updateClientUser?.clientUser) return
          const cachedData = cache.readQuery<ClientInvoiceQuery>(cacheClientsInvoiceQuery)

          console.log('cachedData', cachedData)

          if (!cachedData?.clientInvoice) return
          cache.writeQuery({
            ...cacheClientsInvoiceQuery,
            data: {
              ...cachedData.clientInvoice,
              items: cachedData.clientInvoice.items.map(item =>
                item.uuid === invoiceItem?.id
                  ? responseData?.updateClientInvoiceItem?.invoiceItem
                  : item,
              ),
            },
          })
        },
      })
      reset()
      enqueueSnackbar('Factura actualizata cu succes!')
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
        <DialogTitle>Factura</DialogTitle>
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
            <RHFTextField name="spvUsername" label="Utilizator SPV" />
            <RHFTextField name="spvPassword" label="Partola SPV" />
            <RHFSelect native name="role" label="Rol" InputLabelProps={{ shrink: true }}>
              <option key="null" value="" />
              {Object.keys(ClientUserRoleEnum).map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </RHFSelect>
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
