import { useSnackbar } from 'components/snackbar'
import { useUpdateClientActivityMutation } from 'generated/graphql'
import React from 'react'

type Props = {
  clientId: string
  date: null | Date
  onClose: () => void
}

const UpdateClientActivity: React.FC<Props> = ({ clientId, date, onClose }) => {
  const [updateClientActivity, { loading }] = useUpdateClientActivityMutation()

  const { enqueueSnackbar } = useSnackbar()
  return <></>
}

export default UpdateClientActivity
