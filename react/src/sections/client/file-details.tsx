import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextMaxLine from 'components/text-max-line'
import { fDateTime } from 'utils/format-time'
import { ConfirmDialog } from 'components/custom-dialog'
import { fData } from 'utils/format-number'
import FileThumbnail, { fileFormat } from 'components/file-thumbnail'
import CustomPopover, { usePopover } from 'components/custom-popover'
import MenuItem from '@mui/material/MenuItem'
import { useBoolean } from 'hooks/use-boolean'
import Iconify from 'components/iconify'
import IconButton from '@mui/material/IconButton'
import { Link } from 'react-router-dom'
import { APIClientFile } from './types'

type Props = {
  clientUuid: string
  file: APIClientFile
  onDeleteFile(): void
}

const FileDetails: React.FC<Props> = ({ onDeleteFile, clientUuid, file, ...other }) => {
  const popover = usePopover()

  const confirm = useBoolean()

  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>
  )

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        alignItems="flex-start"
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'unset',
          position: 'relative',
          maxWidth: 'auto',
        }}
        {...other}
      >
        <Link to={file.url} download={file.name} target="_blank" rel="noreferrer">
          <Stack direction="row" alignItems="center" spacing={1}>
            <FileThumbnail file={fileFormat(file.name)} sx={{ width: 36, height: 36 }} />
          </Stack>
        </Link>
        <TextMaxLine persistent variant="subtitle2" sx={{ width: 1, mt: 2, mb: 0.5 }}>
          {file.name}
        </TextMaxLine>

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            maxWidth: 0.99,
            whiteSpace: 'nowrap',
            typography: 'caption',
            color: 'text.disabled',
          }}
        >
          {fData(file.size)}

          <Box
            component="span"
            sx={{
              mx: 0.75,
              width: 2,
              height: 2,
              flexShrink: 0,
              borderRadius: '50%',
              bgcolor: 'currentColor',
            }}
          />
          <Typography noWrap component="span" variant="caption">
            {fDateTime(file.updated)}
          </Typography>
        </Stack>
        {renderAction}
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue()
            popover.onClose()
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Șterge
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Șterge"
        content="Ești sigur că vrei să ștergi acest document?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteFile}>
            Șterge
          </Button>
        }
      />
    </>
  )
}

export default FileDetails
