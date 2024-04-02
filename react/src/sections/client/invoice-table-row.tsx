import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { InvoiceItemType } from 'generated/graphql'
import { CATEGORY_CODE_TO_LABEL } from 'utils/constants'

type Props = {
  index: number
  row: InvoiceItemType
}

const InvoiceTableRow: React.FC<Props> = ({ index, row }) => {
  const suffix = CATEGORY_CODE_TO_LABEL[row.category.code as keyof typeof CATEGORY_CODE_TO_LABEL]

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
          {row.solutionName ? `${row.solutionName} ${suffix}` : `Servicii suplimentare ${suffix}`}
        </Box>
      </TableCell>
      <TableCell>{row.quantity}</TableCell>
      <TableCell>{`${row.cost} ${row.currency}`}</TableCell>
    </TableRow>
  )
}

export default InvoiceTableRow
