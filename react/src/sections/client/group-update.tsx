import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

import FormProvider, { RHFMultiSelect, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import {
  useOrganizationClientsQuery,
  useUpdateClientGroupMutation,
  ClientGroupFragmentDoc,
} from 'generated/graphql'
import { APIClientGroup } from 'sections/client/types'
import getErrorMessage from 'utils/api-codes'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'
import DialogActions from 'components/dialog-actions'
import ResponseHandler from 'components/response-handler'
import { Box } from '@mui/material'

type Props = {
  organizationUuid: string
  group?: APIClientGroup
  onClose: () => void
}

const UpdateGroup: React.FC<Props> = ({ organizationUuid, group, onClose }) => {
  const [updateClientGroup, { loading }] = useUpdateClientGroupMutation()

  const result = useOrganizationClientsQuery()

  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: group?.name || '',
      clientUuids: group?.clients.map(c => c.uuid) || [],
    }),
    [group],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(REQUIRED_FIELD_ERROR),
        clientUuids: Yup.array()
          .of(Yup.string().required(REQUIRED_FIELD_ERROR))
          .required(REQUIRED_FIELD_ERROR),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await updateClientGroup({
        variables: {
          clientGroupInput: {
            uuid: group?.uuid,
            name: data.name,
            clientUuids: data.clientUuids,
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            id: cache.identify({ uuid: organizationUuid, __typename: 'OrganizationType' }),
            fields: {
              clientGroups(existingGroups) {
                if (group) {
                  return existingGroups
                }
                const newSolution = cache.writeFragment({
                  data: cacheData?.updateClientGroup?.clientGroup,
                  fragment: ClientGroupFragmentDoc,
                })
                return [newSolution, ...existingGroups]
              },
            },
          })
        },
      })

      form.reset()
      enqueueSnackbar('Grupul a fost actualizat!')
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
        <DialogTitle>Grup de Clienți</DialogTitle>
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
            <RHFTextField name="name" label="Nume" />
            <div />
            <ResponseHandler {...result}>
              {({ organization }) => {
                return (
                  <RHFMultiSelect
                    checkbox
                    name="clientUuids"
                    label="Clienți"
                    options={organization.clients.map(client => ({
                      value: client.uuid,
                      label: client.name,
                    }))}
                  />
                )
              }}
            </ResponseHandler>
          </Box>
          <DialogActions
            label={group ? 'Salvează' : 'Adaugă'}
            onClose={onClose}
            loading={loading}
          />
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateGroup
