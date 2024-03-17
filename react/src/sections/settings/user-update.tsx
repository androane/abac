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
  OrganizationUserFragment,
  useUpdateOrganizationSolutionMutation,
  useOrganizationActivitiesQuery,
  OrganizationUserFragmentDoc,
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import { CATEGORY_CODES, getCategoryLabelFromCode } from 'utils/constants'
import { MenuItem } from '@mui/material'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'

type Props = {
  organizationUuid: string
  user?: OrganizationUserFragment
  onClose: () => void
}

const UpdateUser: React.FC<Props> = ({ organizationUuid, user, onClose }) => {
  const result = useOrganizationActivitiesQuery()

  const [updateOrganizationSolution, { loading }] = useUpdateOrganizationSolutionMutation()
  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: user?.name || '',
    }),
    [user],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(REQUIRED_FIELD_ERROR),
        categoryCode: Yup.string().required(REQUIRED_FIELD_ERROR),
        activityUuids: Yup.array()
          .of(Yup.string().required(REQUIRED_FIELD_ERROR))
          .required(REQUIRED_FIELD_ERROR),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await updateOrganizationSolution({
        variables: {
          userInput: {
            uuid: user?.uuid,
            name: data.name,
          },
        },
        update(cache, { data: cacheData }) {
          cache.modify({
            id: cache.identify({ uuid: organizationUuid, __typename: 'OrganizationType' }),
            fields: {
              solutions(existingSolutions) {
                if (user) {
                  return existingSolutions
                }
                const newSolution = cache.writeFragment({
                  data: cacheData?.updateOrganizationSolution?.solution,
                  fragment: OrganizationUserFragmentDoc,
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
        <DialogTitle>Pachet</DialogTitle>
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
            {user ? (
              <div />
            ) : (
              <RHFSelect name="categoryCode" label="Domeniu">
                <MenuItem value="">Alege</MenuItem>
                {CATEGORY_CODES.map(catetgoryCode => (
                  <MenuItem key={catetgoryCode} value={catetgoryCode}>
                    {getCategoryLabelFromCode(catetgoryCode)}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
          </Box>
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              {'<'} Înapoi
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {user ? 'Salvează' : 'Adaugă Utilizator'}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateUser
