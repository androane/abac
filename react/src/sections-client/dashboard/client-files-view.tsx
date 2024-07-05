import ResponseHandler from 'components/response-handler'
import Box from '@mui/material/Box'
import { useAuthContext } from 'auth/hooks'
import { useClientFilesQuery, useDeleteClientFileMutation } from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import EmptyContent from 'components/empty-content'
import CreateFiles from 'sections/client/file-create'
import AddButton from 'components/add-button'
import FileDetails from 'sections/client/file-details'
import { enqueueSnackbar } from 'notistack'

const ClientFilesView = () => {
  const { user } = useAuthContext()

  const client = user?.client!

  const upload = useBoolean()

  const [deleteFile] = useDeleteClientFileMutation()

  const result = useClientFilesQuery({
    variables: {
      clientUuid: client.uuid,
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
            <AddButton count={files.length} label="Documente" onClick={upload.onTrue} />
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
                    clientUuid={client?.uuid}
                    file={file}
                  />
                ))}
              </Box>
            ) : (
              <EmptyContent
                filled
                title="Nu există documente"
                sx={{
                  py: 10,
                }}
              />
            )}
            <CreateFiles clientUuid={client.uuid} open={upload.value} onClose={upload.onFalse} />
          </>
        )
      }}
    </ResponseHandler>
  )
}

export default ClientFilesView
