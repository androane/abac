import ResponseHandler from 'components/response-handler'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import TextMaxLine from 'components/text-max-line'
import { fDateTime } from 'utils/format-time'
import { fData } from 'utils/format-number'
import FileThumbnail, { fileFormat } from 'components/file-thumbnail'
import { useClientFilesQuery } from 'generated/graphql'
import CustomPopover, { usePopover } from 'components/custom-popover'
import MenuItem from '@mui/material/MenuItem'
import { useBoolean } from 'hooks/use-boolean'
import Iconify from 'components/iconify'
import IconButton from '@mui/material/IconButton'
import EmptyContent from 'components/empty-content'
import { APIClientFile } from '../types'

type FileDetailsProps = {
  clientId: string
  file: APIClientFile
}

const FileDetails: React.FC<FileDetailsProps> = ({ clientId, file, ...other }) => {
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
          cursor: 'pointer',
          position: 'relative',
          maxWidth: 'auto',
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <FileThumbnail file={fileFormat(file.url)} sx={{ width: 36, height: 36 }} />

          <TextMaxLine persistent variant="subtitle2" sx={{ width: 1, mt: 2, mb: 0.5 }}>
            {file.name}
          </TextMaxLine>
        </Stack>

        <TextMaxLine persistent variant="subtitle2" sx={{ width: 1, mt: 1, mb: 0.5 }}>
          {file.description}
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
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  )
}

type Props = {
  clientId: string
}

export default function FilesListView({ clientId }: Props) {
  const result = useClientFilesQuery({
    variables: {
      clientUuid: clientId,
    },
  })

  return (
    <ResponseHandler {...result}>
      {({ clientFiles }) => {
        if (!clientFiles.length) {
          return (
            <EmptyContent
              filled
              title="Nu exista documente"
              sx={{
                py: 10,
              }}
            />
          )
        }
        return (
          <Collapse in={Boolean(clientFiles.length)} unmountOnExit>
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={3}
            >
              {clientFiles.map(file => (
                <FileDetails key={file.url} clientId={clientId} file={file} />
              ))}
            </Box>
          </Collapse>
        )
      }}
    </ResponseHandler>
  )
}
