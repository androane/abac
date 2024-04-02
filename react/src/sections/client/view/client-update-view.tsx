import { yupResolver } from '@hookform/resolvers/yup'
import FormProvider, { RHFSelect, RHFTextField } from 'components/hook-form'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import * as Yup from 'yup'

import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import { Button, Divider, List, ListItemText, MenuItem, Typography } from '@mui/material'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { useRouter } from 'routes/hooks'
import { paths } from 'routes/paths'

import ResponseHandler from 'components/response-handler'
import { useSnackbar } from 'components/snackbar'
import {
  useUpdateClientMutation,
  useOrganizationSolutionsQuery,
  ClientClientQuery,
  CurrencyEnum,
  useOrganizationUsersQuery,
  UserPermissionsEnum,
  SoftwareEnum,
  ClientInput,
  BaseClientFragmentDoc,
} from 'generated/graphql'
import { useAuthContext } from 'auth/hooks'
import getErrorMessage from 'utils/api-codes'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'
import Iconify from 'components/iconify'
import { CATEGORY_CODE_TO_LABEL } from 'utils/constants'
import { TABS_VALUES } from 'sections/client/constants'

type ClientInfoProps = {
  client: ClientClientQuery['client']
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client }) => {
  const router = useRouter()

  return (
    <div>
      {client.group && (
        <div>
          <Typography variant="subtitle2">
            Acest client face parte din grupul de firme <strong>{client.group.name}</strong>:
          </Typography>
          <List>
            {client.group.clients.map(c => (
              <Box
                key={c.uuid}
                onClick={() => router.push(paths.app.client.detail(c.uuid, TABS_VALUES.GENERAL))}
                sx={{
                  ml: 2,
                  mt: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <ListItemText primaryTypographyProps={{ typography: 'body2' }}>
                  &rarr;&nbsp;&nbsp;{c.name}
                </ListItemText>
              </Box>
            ))}
          </List>
          <Divider sx={{ borderStyle: 'dashed', mt: 2, mb: 6 }} />
        </div>
      )}
    </div>
  )
}

const UpdateClientSolutions: React.FC<{ canUpdate: boolean }> = ({ canUpdate }) => {
  const { user, hasPermission } = useAuthContext()

  const canSeeCosts = hasPermission(UserPermissionsEnum.HAS_CLIENT_ACTIVITY_COSTS_ACCESS)
  const canSeeInformation = hasPermission(UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS)
  const resultSolutions = useOrganizationSolutionsQuery()

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Pachete de servicii
      </Typography>

      <Box
        sx={{ pt: 3 }}
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
      >
        <ResponseHandler {...resultSolutions}>
          {({ organization }) => {
            return (
              <>
                {user?.categories.map((category, index) => {
                  return (
                    <React.Fragment key={category.code}>
                      <RHFSelect
                        disabled={!canUpdate}
                        name={`clientSolutions[${index}].solutionUuid`}
                        label={`Pachet ${CATEGORY_CODE_TO_LABEL[category.code as keyof typeof CATEGORY_CODE_TO_LABEL]}`}
                      >
                        <MenuItem value="" sx={{ color: 'text.secondary' }}>
                          Alege
                        </MenuItem>
                        {organization.solutions
                          .filter(s => s.category.code === category.code)
                          .map(s => (
                            <MenuItem key={s.uuid} value={s.uuid}>
                              {s.name}
                            </MenuItem>
                          ))}
                      </RHFSelect>
                      {canSeeInformation && canSeeCosts ? (
                        <>
                          <RHFTextField
                            disabled={!canUpdate}
                            name={`clientSolutions[${index}].unitCost`}
                            label="Cost"
                            type="number"
                          />
                          <RHFSelect
                            disabled={!canUpdate}
                            name={`clientSolutions[${index}].unitCostCurrency`}
                            label="Moneda"
                          >
                            {Object.keys(CurrencyEnum).map(currency => (
                              <MenuItem key={currency} value={currency}>
                                {currency}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </>
                      ) : (
                        <>
                          <div />
                          <div />
                        </>
                      )}
                    </React.Fragment>
                  )
                })}
              </>
            )
          }}
        </ResponseHandler>
      </Box>
      <Divider sx={{ borderStyle: 'dashed', mt: 6, mb: 6 }} />
    </>
  )
}

const UpdateClientGeneralInformation: React.FC<{ canUpdate: boolean }> = ({ canUpdate }) => {
  const result = useOrganizationUsersQuery()

  return (
    <>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <RHFTextField disabled={!canUpdate} name="name" label="Nume firmă" />
        <ResponseHandler {...result}>
          {({ organization }) => {
            return (
              <RHFSelect disabled={!canUpdate} name="programManagerUuid" label="Responsabil">
                <MenuItem value="" sx={{ color: 'text.secondary' }}>
                  Alege
                </MenuItem>
                {organization.users.map(u => (
                  <MenuItem key={u.uuid} value={u.uuid}>
                    {u.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            )
          }}
        </ResponseHandler>
        <RHFTextField disabled={!canUpdate} name="cui" label="Cod Unic de Identificare (CUI)" />
        <div />
      </Box>

      <Box sx={{ pt: 3 }}>
        <RHFTextField
          disabled={!canUpdate}
          name="description"
          label="Descriere (opțional)"
          multiline
          rows={5}
        />
      </Box>

      <Divider sx={{ borderStyle: 'dashed', mt: 6, mb: 4 }} />
    </>
  )
}

const SoftwareEnumToLabel = {
  [SoftwareEnum.ONE_C]: '1C',
  [SoftwareEnum.ONE_C_ALIN]: '1C Alin',
  [SoftwareEnum.SAGA]: 'SAGA',
  [SoftwareEnum.TEAMAPP]: 'Team App',
  [SoftwareEnum.NEXTUP]: 'NextUp',
  [SoftwareEnum.WIND]: 'Wind',
  [SoftwareEnum.NEXUS]: 'Nexus',
  [SoftwareEnum.SMARTBILL]: 'SmartBill',
  [SoftwareEnum.SENIOR_ERP]: 'Senior ERP',
  [SoftwareEnum.SENIOR_ERP_CLIENT]: 'Senior ERP Client',
  [SoftwareEnum.SICO_GESTIUNI]: 'SICO Gestiuni',
  [SoftwareEnum.SICO_FINANCIAR]: 'SICO Financiar',
}

const DEFAULT_SOFTWARE = {
  uuid: '',
  software: undefined,
  username: '',
  password: '',
}

const UpdateClientSoftware: React.FC<{ canUpdate: boolean }> = ({ canUpdate }) => {
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'softwares',
  })

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Software și Conturi
      </Typography>

      <Box
        sx={{ pt: 3 }}
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(4, 1fr)',
        }}
      >
        <RHFTextField disabled={!canUpdate} name="spvUsername" label="Utilizator SPV" />
        <RHFTextField disabled={!canUpdate} name="spvPassword" label="Parolă SPV" />
        <div />
      </Box>

      <Box sx={{ pt: 0 }}>
        {fields.map((item, index) => {
          return (
            <Box
              key={item.id}
              sx={{ pt: 3 }}
              rowGap={3}
              columnGap={2}
              display="grid"
              alignItems="center"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)',
              }}
            >
              <RHFSelect
                disabled={!canUpdate}
                name={`softwares[${index}].software`}
                label="Software"
              >
                <MenuItem value="" sx={{ color: 'text.secondary' }}>
                  Alege
                </MenuItem>
                {Object.keys(SoftwareEnum).map(s => (
                  <MenuItem key={s} value={s}>
                    {SoftwareEnumToLabel[s as SoftwareEnum]}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name={`softwares[${index}].username`} label="Utilizator" />
              <RHFTextField name={`softwares[${index}].password`} label="Parola" />
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => remove(index)}
              >
                Șterge
              </Button>
            </Box>
          )
        })}

        <Button
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => append(DEFAULT_SOFTWARE)}
          sx={{ flexShrink: 0, mt: 2 }}
        >
          Adaugă
        </Button>
      </Box>

      <Divider sx={{ borderStyle: 'dashed', mt: 6, mb: 6 }} />
    </>
  )
}

type Props = {
  client?: ClientClientQuery['client']
}

const ClientUpdateView: React.FC<Props> = ({ client }) => {
  const router = useRouter()

  const { user, hasPermission } = useAuthContext()

  const canUpdate = hasPermission(UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS)

  const [updateClient, { loading }] = useUpdateClientMutation()

  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(() => {
    const softwares = client?.softwares.map(s => ({
      uuid: s.uuid,
      software: s.software,
      username: s.username,
      password: s.password,
    }))
    return {
      name: client?.name || '',
      description: client?.description || '',
      imageUrl: null,
      programManagerUuid: client?.programManager?.uuid || user?.uuid,
      spvUsername: client?.spvUsername || '',
      spvPassword: client?.spvPassword || '',
      cui: client?.cui || '',
      clientSolutions: user!.categories.map(c => {
        const clientSolution = client?.solutions.find(cs => cs.solution.category.code === c.code)
        return {
          uuid: clientSolution?.uuid || '',
          solutionUuid: clientSolution?.solution.uuid || '',
          unitCost: clientSolution?.unitCost,
          unitCostCurrency: clientSolution?.unitCostCurrency || CurrencyEnum.RON,
        }
      }),
      softwares: softwares?.length ? softwares : [DEFAULT_SOFTWARE],
    }
  }, [client, user])

  const form = useForm({
    resolver: yupResolver(
      Yup.object({
        name: Yup.string().required(REQUIRED_FIELD_ERROR),
        description: Yup.string().nullable(),
        imageUrl: Yup.mixed<any>().nullable(),
        programManagerUuid: Yup.string().nullable(),
        spvUsername: Yup.string().nullable(),
        spvPassword: Yup.string().nullable(),
        cui: Yup.string().nullable(),
        clientSolutions: Yup.array()
          .of(
            Yup.object({
              uuid: Yup.string(),
              solutionUuid: Yup.string(),
              unitCost: Yup.number().nullable(),
              unitCostCurrency: Yup.mixed<CurrencyEnum>().oneOf(Object.values(CurrencyEnum)),
            }),
          )
          .required(REQUIRED_FIELD_ERROR),
        softwares: Yup.array().of(
          Yup.object().shape({
            uuid: Yup.string(),
            software: Yup.mixed<SoftwareEnum>().oneOf(Object.values(SoftwareEnum)),
            username: Yup.string().nullable(),
            password: Yup.string().nullable(),
          }),
        ),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    const softwares = data.softwares?.filter(s => Boolean(s.software)) as ClientInput['softwares']

    try {
      const response = await updateClient({
        variables: {
          clientInput: {
            uuid: client?.uuid,
            name: data.name,
            description: data.description,
            programManagerUuid: data.programManagerUuid,
            spvUsername: data.spvUsername,
            spvPassword: data.spvPassword,
            cui: data.cui,
            clientSolutions: data.clientSolutions,
            softwares,
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            id: cache.identify({ uuid: user?.organization.uuid, __typename: 'OrganizationType' }),
            fields: {
              clients(existingClients = []) {
                if (client) {
                  return existingClients
                }
                const newClient = cache.writeFragment({
                  data: cacheData?.updateClient?.client,
                  fragment: BaseClientFragmentDoc,
                })
                return [newClient, ...existingClients]
              },
            },
          })
        },
      })
      if (!client) {
        if (response.data?.updateClient?.error) {
          throw new Error(response.data?.updateClient?.error.message)
        } else {
          enqueueSnackbar('Clientul a fost creat!')
          router.push(paths.app.client.list)
        }
      } else if (response.data?.updateClient?.client?.uuid) {
        enqueueSnackbar('Clientul a fost actualizat!')
        router.push(
          paths.app.client.detail(response.data.updateClient.client.uuid, TABS_VALUES.GENERAL),
        )
      }
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
            {client && <ClientInfo client={client} />}
            <UpdateClientGeneralInformation canUpdate={canUpdate} />
            <UpdateClientSolutions canUpdate={canUpdate} />
            <UpdateClientSoftware canUpdate={canUpdate} />

            {canUpdate && (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={loading} color="success">
                  {client ? 'Salvează' : 'Adaugă Client'}
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

export default ClientUpdateView
