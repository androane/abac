import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import { getAuthorizationHeader } from 'config/config-apollo'
import { BACKEND_HOST } from 'config/config-env'
import Iconify from 'components/iconify'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, FormControlLabel, Switch } from '@mui/material'

type Props = {
  onClose(): void
  invoiceId: string
}

const InvoiceEnclosureDialog: React.FC<Props> = ({ onClose, invoiceId }) => {
  const [includeLogsTimes, setIncludeLogsTimes] = useState(false)

  const onDownloadEnclosure = () => {
    let url = `${BACKEND_HOST}/download/invoice-details?invoice_uuid=${invoiceId}`
    if (includeLogsTimes) {
      url += '&include_logs_times=1'
    }

    const headers = new Headers()
    headers.append('Authorization', getAuthorizationHeader())

    fetch(url, { method: 'GET', headers })
      .then(response => response.blob())
      .then(blob => {
        const _url = window.URL.createObjectURL(blob)
        window.open(_url, '_blank')?.focus()
      })
      .catch(error => console.error('Error:', error))
  }

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
      <DialogTitle sx={{ pb: 2 }}>Descarcă Anexa</DialogTitle>
      <DialogContent>
        <FormControlLabel
          sx={{ mb: 2 }}
          label="Dorești să incluzi timpii alocați?"
          control={
            <Switch
              checked={includeLogsTimes}
              onChange={() => setIncludeLogsTimes(!includeLogsTimes)}
              color="success"
            />
          }
        />
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<Iconify icon="ic:outline-arrow-back" />}
          variant="outlined"
          onClick={onClose}
        >
          Înapoi
        </Button>
        <Button type="submit" variant="contained" color="success" onClick={onDownloadEnclosure}>
          Descarcă Anexa
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InvoiceEnclosureDialog
