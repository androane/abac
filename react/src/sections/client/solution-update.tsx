import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'

import FormProvider, { RHFTextField } from 'components/hook-form'
import { useSnackbar } from 'components/snackbar'
import { useUpdateClientSolutionMutation } from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import { REQUIRED_FIELD_ERROR } from 'utils/forms'
import DialogActions from 'components/dialog-actions'
import { APIClientSolution } from 'sections/client/types'

type Props = {
  clientSolution: APIClientSolution
  clientUuid: string
  onClose: () => void
}

const UpdateClientSolution: React.FC<Props> = ({ clientSolution, clientUuid, onClose }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [updateClientSolution, { loading }] = useUpdateClientSolutionMutation()

  const defaultValues = useMemo(
    () => ({
      quantity: clientSolution.quantity,
    }),
    [clientSolution],
  )

  const form = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        quantity: Yup.number()
          .required(REQUIRED_FIELD_ERROR)
          .min(1, 'Cantitatea trebuie să fie mai mare de 0'),
      }),
    ),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await updateClientSolution({
        variables: {
          clientUuid,
          clientSolutionInput: {
            uuid: clientSolution.uuid,
            quantity: data.quantity,
          },
        },
      })
      enqueueSnackbar('Pachetul a fost actualizat!')
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
        <DialogTitle>Actualizează {clientSolution.solution.name}</DialogTitle>
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
            <RHFTextField name="quantity" label="Cantitate" type="number" />
          </Box>
          <DialogActions label="Salvează" loading={loading} onClose={onClose} />
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export default UpdateClientSolution
