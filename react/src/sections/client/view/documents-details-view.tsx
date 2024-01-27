import ResponseHandler from 'components/response-handler'
import { useClientDocumentsQuery } from 'generated/graphql'
import { APIClientDocument } from '../types'

type InvoiceDetailsCardProps = {
  clientId: string
  clientDocuments: APIClientDocument[]
}

const DocumentsDetailsCard: React.FC<InvoiceDetailsCardProps> = ({ clientId, clientDocuments }) => {
  console.log(clientDocuments)
  return <div>AAA</div>
}

type Props = {
  clientId: string
}

export default function DocumentsDetailsView({ clientId }: Props) {
  const result = useClientDocumentsQuery({
    variables: {
      clientUuid: clientId,
    },
  })

  return (
    <ResponseHandler {...result}>
      {({ clientDocuments }) => {
        return <DocumentsDetailsCard clientId={clientId} clientDocuments={clientDocuments} />
      }}
    </ResponseHandler>
  )
}
