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

import { useRouter } from 'routes/hooks'
import { paths } from 'routes/paths'

import ResponseHandler from 'components/response-handler'
import { useSnackbar } from 'components/snackbar'
import {
  useClientProgramManagersQuery,
  useUpdateClientMutation,
  ClientFragmentDoc,
  useOrganizationSolutionsQuery,
  useClientQuery,
  ClientQuery,
  CurrencyEnum,
} from 'generated/graphql'
import { useAuthContext } from 'auth/hooks'
import getErrorMessage from 'utils/api-codes'
import { MenuItem } from '@mui/material'
import { CATEGORY_CODES, getCategoryLabelFromCode } from 'utils/constants'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'

type Props = {
  client?: ClientQuery['client']
}

export const UpdateClient: React.FC<Props> = ({ client }) => {
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
      // clientSolutions:
      //   client?.clientSolutions.map(cs => ({
      //     uuid: cs.uuid,
      //     solutionUuid: cs.solution.uuid,
      //     unitCost: cs.unitCost,
      //     unitCostCurrency: cs.unitCostCurrency,
      //   })) || [],
      clientSolutions: CATEGORY_CODES.map(categoryCode => {
        const clientSolution = client?.clientSolutions.find(
          cs => cs.solution.category.code === categoryCode,
        )
        return {
          uuid: clientSolution?.uuid,
          solutionUuid: clientSolution?.solution.uuid,
          unitCost: clientSolution?.unitCost,
          unitCostCurrency: clientSolution?.unitCostCurrency || CurrencyEnum.RON,
        }
      }),
    }),
    [client, user],
  )

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
              unitCost: Yup.number(),
              unitCostCurrency: Yup.mixed<CurrencyEnum>().oneOf(Object.values(CurrencyEnum)),
            }),
          )
          .required(REQUIRED_FIELD_ERROR),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      console.log(data)
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
            clientSolutions: data.clientSolutions,
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
              <RHFTextField name="cui" label="CUI" InputLabelProps={{ shrink: true }} />
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
                      {CATEGORY_CODES.map((categoryCode, index) => {
                        return (
                          <React.Fragment key={categoryCode}>
                            <RHFSelect
                              InputLabelProps={{ shrink: true }}
                              name={`clientSolutions[${index}].solutionUuid`}
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
                            <RHFTextField
                              name={`clientSolutions[${index}].unitCost`}
                              label="Cost"
                              type="number"
                              InputLabelProps={{ shrink: true }}
                            />
                            <RHFSelect
                              name={`clientSolutions[${index}].unitCostCurrency`}
                              label="Moneda"
                              InputLabelProps={{ shrink: true }}
                            >
                              {Object.keys(CurrencyEnum).map(currency => (
                                <MenuItem key={currency} value={currency}>
                                  {currency}
                                </MenuItem>
                              ))}
                            </RHFSelect>
                          </React.Fragment>
                        )
                      })}
                    </>
                  )
                }}
              </ResponseHandler>
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

const UpdateClientContainer: React.FC<{ clientUuid: string }> = ({ clientUuid }) => {
  const result = useClientQuery({ variables: { uuid: clientUuid } })

  return (
    <ResponseHandler {...result}>
      {({ client }) => {
        return <UpdateClient client={client} />
      }}
    </ResponseHandler>
  )
}

export default UpdateClientContainer
