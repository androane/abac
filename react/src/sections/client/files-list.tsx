import ResponseHandler from 'components/response-handler'
import Box from '@mui/material/Box'
import { useClientFilesQuery, useDeleteClientFileMutation } from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import EmptyContent from 'components/empty-content'
import CreateFiles from 'sections/client/files-create'
import AddButton from 'components/add-button'
import FileDetails from 'sections/client/files-details'
import { enqueueSnackbar } from 'notistack'

type Props = {
  clientUuid: string
}

const FilesList: React.FC<Props> = ({ clientUuid }) => {
  const upload = useBoolean()

  const [deleteFile] = useDeleteClientFileMutation()

  const result = useClientFilesQuery({
    variables: {
      clientUuid,
    },
  })

  const handleDeleteFile = async (uuid: string) => {
    await deleteFile({
      variables: { fileUuid: uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'ClientFileType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Documentul a fost șters!')
  }

  return (
    <ResponseHandler {...result}>
      {({ client: { files } }) => {
        return (
          <>
            <AddButton count={files.length} label="Fisiere" onClick={upload.onTrue} />
            {files.length ? (
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
                {files.map(file => (
                  <FileDetails
                    key={file.name}
                    onDeleteFile={() => handleDeleteFile(file.uuid)}
                    clientUuid={clientUuid}
                    file={file}
                  />
                ))}
              </Box>
            ) : (
              <EmptyContent
                filled
                title="Nu exista documente"
                sx={{
                  py: 10,
                }}
              />
            )}
            <CreateFiles clientUuid={clientUuid} open={upload.value} onClose={upload.onFalse} />
          </>
        )
      }}
    </ResponseHandler>
  )
}

export default FilesList
