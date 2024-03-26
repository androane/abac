import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Iconify from 'components/iconify'

import { ConfirmDialogProps } from './types'

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  content,
  action,
  open,
  onClose,
  ...other
}) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
        <Button
          startIcon={<Iconify icon="ic:outline-arrow-back" />}
          variant="outlined"
          onClick={onClose}
        >
          Înapoi
        </Button>
        {action}
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
