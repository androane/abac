import React, { useState, useEffect, useCallback } from 'react'

import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Dialog, { DialogProps } from '@mui/material/Dialog'

import Iconify from 'components/iconify'
import { Upload } from 'components/upload'
import { useCreateClientFilesMutation } from 'generated/graphql'
import { useSnackbar } from 'notistack'
import LoadingButton from '@mui/lab/LoadingButton'

interface Props extends DialogProps {
  title?: string
  clientUuid: string
  open: boolean
  onClose: VoidFunction
}

const CreateFiles: React.FC<Props> = ({
  title = 'Încarcă Documente',
  clientUuid,
  open,
  onClose,
  ...other
}) => {
  const [createFiles, { loading }] = useCreateClientFilesMutation()

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
        clientUuid,
        clientFilesInput: files.map(file => ({
          file,
        })),
      },
    })
    enqueueSnackbar('Documentele au fost încărcate!')

    onClose()
  }

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter(file => file !== inputFile)
    setFiles(filtered)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: theme => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <LoadingButton
          loading={loading}
          disabled={!files.length}
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
          color="success"
        >
          Incarcă
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default CreateFiles
