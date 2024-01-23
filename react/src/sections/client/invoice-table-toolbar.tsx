import { useCallback } from 'react'

import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { RouterLink } from 'routes/components'

import Iconify from 'components/iconify'

import { InvoiceTableFilters } from './types'

type Props = {
  filters: InvoiceTableFilters
  onFilters: (name: string, value: string) => void
  onAddInvoiceItem: () => void
}

export default function UserTableToolbar({ filters, onFilters, onAddInvoiceItem }: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value)
    },
    [onFilters],
  )

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexGrow={1}
        sx={{ width: 1 }}
      >
        <TextField
          value={filters.description}
          onChange={handleFilterName}
          placeholder="Cauta..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          onClick={onAddInvoiceItem}
          component={RouterLink}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Factura Noua
        </Button>
      </Stack>
    </Stack>
  )
}
