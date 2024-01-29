import { useState, useEffect, useCallback } from 'react'

import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Dialog, { DialogProps } from '@mui/material/Dialog'

import Iconify from 'components/iconify'
import { Upload } from 'components/upload'
import { useCreateClientFilesMutation } from 'generated/graphql'
import { useSnackbar } from 'notistack'

interface Props extends DialogProps {
  title?: string
  clientId: string
  open: boolean
  onClose: VoidFunction
}

export default function CreateFilesDialog({
  title = 'Incarca Fisiere',
  clientId,
  open,
  onClose,
  ...other
}: Props) {
  const [createFiles] = useCreateClientFilesMutation()

  const { enqueueSnackbar } = useSnackbar()

  const [files, setFiles] = useState<(File | string)[]>([])

  useEffect(() => {
    if (!open) {
      setFiles([])
    }
  }, [open])

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      )

      setFiles([...files, ...newFiles])
    },
    [files],
  )

  const handleUpload = async () => {
    await createFiles({
      variables: {
        clientUuid: clientId,
        clientFilesInput: files.map(file => ({
          file,
        })),
      },
    })
    enqueueSnackbar('Fisierele au fost incarcate cu success')

    onClose()
  }

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter(file => file !== inputFile)
    setFiles(filtered)
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: theme => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <Button
          disabled={!files.length}
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          Incarca
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Sterge tot
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
