import { useCallback } from 'react'

import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { RouterLink } from 'routes/components'

import Iconify from 'components/iconify'

import { InvoiceTableFilters } from './types'

type Props = {
  filters: InvoiceTableFilters
  onFilters: (name: string, value: string) => void
  onAddInvoiceItem: () => void
  invoiceDate: null | Date
  onChangeInvoiceDate: (newDate: null | Date) => void
}

export default function InvoiceTableToolbar({
  filters,
  onFilters,
  onAddInvoiceItem,
  invoiceDate,
  onChangeInvoiceDate,
}: Props) {
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
      <DatePicker
        label="Data facturii"
        minDate={new Date('2024-01-01')}
        disableFuture
        value={invoiceDate}
        onChange={onChangeInvoiceDate}
        slotProps={{ textField: { fullWidth: true } }}
        views={['month', 'year']}
        sx={{
          maxWidth: { md: 180 },
        }}
      />
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
          Adauga la Factura
        </Button>
      </Stack>
    </Stack>
  )
}
