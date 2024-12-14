import ResponseHandler from 'components/response-handler'
import Box from '@mui/material/Box'
import {
  OrganizationClientFileTypeChoices,
  useClientFilesQuery,
  useDeleteClientFileMutation,
} from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import EmptyContent from 'components/empty-content'
import CreateOPCSBFiles from 'sections/client/opcsb-file-create'
import AddButton from 'components/add-button'
import OPCSBFileDetails from 'sections/client/opcsb-file-details'
import { enqueueSnackbar } from 'notistack'
import { APIClient } from 'sections/client/types'

type Props = {
  client: APIClient
}

const ClientOPCSBFilesView: React.FC<Props> = ({ client }) => {
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
      {({ client: { files: allFiles } }) => {
        const files = allFiles.filter(file => file.type === OrganizationClientFileTypeChoices.OPCSB)
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
                  <OPCSBFileDetails
                    key={file.name}
                    onDeleteFile={() => handleDeleteFile(file.uuid)}
                    clientUuid={client.uuid}
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
            <CreateOPCSBFiles
              clientUuid={client.uuid}
              open={upload.value}
              onClose={upload.onFalse}
            />
          </>
        )
      }}
    </ResponseHandler>
  )
}

export default ClientOPCSBFilesView
