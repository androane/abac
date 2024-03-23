import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import DialogActions from '@mui/material/DialogActions'

import Iconify from 'components/iconify'

type Props = {
  onClose(): void
  loading: boolean
  label?: string
}

const DialogActionsContainer: React.FC<Props> = ({ onClose, loading, label = 'Salvează' }) => {
  return (
    <DialogActions>
      <Button
        startIcon={<Iconify icon="ic:outline-arrow-back" />}
        variant="outlined"
        onClick={onClose}
      >
        Înapoi
      </Button>
      <LoadingButton type="submit" variant="contained" color="success" loading={loading}>
        {label}
      </LoadingButton>
    </DialogActions>
  )
}

export default DialogActionsContainer
