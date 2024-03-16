import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { InvoiceItemType } from 'generated/graphql'

type Props = {
  index: number
  row: InvoiceItemType
}

const InvoiceTableRow: React.FC<Props> = ({ index, row }) => {
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
      <TableCell>{row.quantity}</TableCell>
      <TableCell>{`${row.cost} ${row.currency}`}</TableCell>
    </TableRow>
  )
}

export default InvoiceTableRow
