import { yupResolver } from '@hookform/resolvers/yup'
import FormProvider, { RHFSelect, RHFTextField } from 'components/hook-form'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import * as Yup from 'yup'

import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'

import { useRouter } from 'routes/hooks'
import { paths } from 'routes/paths'

import ResponseHandler from 'components/response-handler'
import { useSnackbar } from 'components/snackbar'
import {
  useClientProgramManagersQuery,
  useUpdateClientMutation,
  ClientFragmentDoc,
  useOrganizationSolutionsQuery,
} from 'generated/graphql'
import { useAuthContext } from 'auth/hooks'
import getErrorMessage from 'utils/api-codes'
import { MenuItem } from '@mui/material'
import { CATEGORY_CODES, getCategoryLabelFromCode } from 'utils/constants'
import { APIClient } from './types'

type Props = {
  client?: APIClient
}

const UpdateClient: React.FC<Props> = ({ client }) => {
  const router = useRouter()

  const { user } = useAuthContext()

  const resultProgramManagers = useClientProgramManagersQuery()
  const resultSolutions = useOrganizationSolutionsQuery()

  const [updateClient, { loading }] = useUpdateClientMutation()

  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: client?.name || '',
      description: client?.description || '',
      imageUrl: null,
      programManagerUuid: client?.programManager?.uuid || user?.uuid,
      spvUsername: client?.spvUsername,
      spvPassword: client?.spvPassword,
      cui: client?.cui,
    }),
    [client, user],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required('Numele este obligatoriu'),
        description: Yup.string().nullable(),
        imageUrl: Yup.mixed<any>().nullable(),
        programManagerUuid: Yup.string().nullable(),
        spvUsername: Yup.string().nullable(),
        spvPassword: Yup.string().nullable(),
        cui: Yup.string().nullable(),
        solutions: Yup.array().of(Yup.string().nullable()),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await updateClient({
        variables: {
          clientInput: {
            uuid: client?.uuid,
            name: data.name,
            description: data.description,
            programManagerUuid: data.programManagerUuid,
            spvUsername: data.spvUsername,
            spvPassword: data.spvPassword,
            cui: data.cui,
            clientSolutions: [],
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            fields: {
              clients(existingClients = []) {
                if (client) {
                  return existingClients
                }
                const newClient = cache.writeFragment({
                  data: cacheData?.updateClient?.client,
                  fragment: ClientFragmentDoc,
                })
                return [newClient, ...existingClients]
              },
            },
          })
        },
      })
      form.reset()
      enqueueSnackbar(client ? 'Client actualizat cu succes!' : 'Client creat cu succes!')
      router.push(paths.app.client.list)
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  })

  return (
    <FormProvider methods={form} onSubmit={onSubmit}>
      <Grid container spacing={3}>
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
              <RHFTextField name="name" label="Nume firmă" InputLabelProps={{ shrink: true }} />
              <ResponseHandler {...resultProgramManagers}>
                {({ clientProgramManagers }) => {
                  return (
                    <RHFSelect name="programManagerUuid" label="Responsabil">
                      <MenuItem value="">Alege</MenuItem>
                      {clientProgramManagers.map(pm => (
                        <MenuItem key={pm.uuid} value={pm.uuid}>
                          {pm.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  )
                }}
              </ResponseHandler>
              <ResponseHandler {...resultSolutions}>
                {({ organization }) => (
                  <>
                    {CATEGORY_CODES.map(categoryCode => {
                      return (
                        <RHFSelect
                          key={categoryCode}
                          name={`solutions${categoryCode}`}
                          label={`Pachet ${getCategoryLabelFromCode(categoryCode)}`}
                        >
                          <MenuItem value="">Alege</MenuItem>
                          {organization.solutions
                            .filter(s => s.category.code === categoryCode)
                            .map(s => (
                              <MenuItem key={s.uuid} value={s.uuid}>
                                {s.name}
                              </MenuItem>
                            ))}
                        </RHFSelect>
                      )
                    })}
                  </>
                )}
              </ResponseHandler>
              <RHFTextField name="cui" label="CUI" InputLabelProps={{ shrink: true }} />
            </Box>
            <Box sx={{ pt: 3 }}>
              <RHFTextField
                name="description"
                label="Descriere"
                multiline
                rows={5}
                InputLabelProps={{ shrink: true }}
              />
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
              <RHFTextField
                name="spvUsername"
                label="Utilizator SPV"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="spvPassword"
                label="Parolă SPV"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                {client ? 'Salvează' : 'Adaugă Client'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

export default UpdateClient
