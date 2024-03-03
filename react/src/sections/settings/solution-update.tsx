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

import FormProvider, { RHFMultiSelect, RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import {
  SolutionFragment,
  useUpdateOrganizationSolutionMutation,
  SolutionFragmentDoc,
  useOrganizationActivitiesQuery,
} from 'generated/graphql'
import { getCategoryLabelFromCode } from 'sections/settings/constants'
import getErrorMessage from 'utils/api-codes'
import ResponseHandler from 'components/response-handler'

type Props = {
  organizationUuid: string
  categoryCode: string
  solution?: SolutionFragment
  onClose: () => void
}

const UpdateSolution: React.FC<Props> = ({ organizationUuid, categoryCode, solution, onClose }) => {
  const result = useOrganizationActivitiesQuery()

  const [updateOrganizationSolution, { loading }] = useUpdateOrganizationSolutionMutation()
  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: solution?.name || '',
      activityUuids: solution?.activities.map(a => a.uuid) || [],
    }),
    [solution],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required('Acest câmp este obligatoriu'),
        activityUuids: Yup.array()
          .of(Yup.string().required('Acest câmp este obligatoriu'))
          .required('Serviciile incluse sunt obligatorii'),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await updateOrganizationSolution({
        variables: {
          solutionInput: {
            uuid: solution?.uuid,
            categoryCode,
            name: data.name,
            activityUuids: data.activityUuids,
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            id: cache.identify({ uuid: organizationUuid, __typename: 'OrganizationType' }),
            fields: {
              solutions(existingSolutions) {
                if (solution) {
                  return existingSolutions
                }
                const newSolution = cache.writeFragment({
                  data: cacheData?.updateOrganizationSolution?.solution,
                  fragment: SolutionFragmentDoc,
                })
                return [newSolution, ...existingSolutions]
              },
            },
          })
        },
      })
      form.reset()
      enqueueSnackbar('Pachet actualizat cu succes!')
      onClose()
    } catch (error) {
      console.log(error)
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
        <DialogTitle>Pachet {getCategoryLabelFromCode(categoryCode)}</DialogTitle>
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
            <RHFTextField name="name" label="Nume Pachet" />
            <ResponseHandler {...result}>
              {({ organization }) => {
                return (
                  <RHFMultiSelect
                    checkbox
                    name="activityUuids"
                    label="Servicii incluse"
                    options={organization.activities
                      .filter(a => a.category.code === categoryCode)
                      .map(activity => ({
                        value: activity.uuid,
                        label: activity.name,
                      }))}
                  />
                )
              }}
            </ResponseHandler>
          </Box>
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              {'<'} Înapoi
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {solution ? 'Salvează' : 'Adaugă Pachet'}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateSolution
