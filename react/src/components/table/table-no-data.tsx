import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { SxProps, Theme } from '@mui/material/styles'

import EmptyContent from '../empty-content'

type Props = {
  notFound: boolean
  sx?: SxProps<Theme>
}

export default function F({ notFound, sx }: Props) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            filled
            title="Nu există date"
            sx={{
              py: 10,
              ...sx,
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  )
}
