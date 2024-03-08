import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { APIInvoiceItem } from './types'

type Props = {
  index: number
  invoiceIsLocked: boolean
  row: APIInvoiceItem
}

const InvoiceTableRow: React.FC<Props> = ({ index, invoiceIsLocked, row }) => {
  return (
    <TableRow hover>
      <TableCell>{index}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Box
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {row.name}
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default InvoiceTableRow
