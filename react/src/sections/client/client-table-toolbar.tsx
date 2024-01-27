import { useCallback } from 'react'

import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Iconify from 'components/iconify'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import InputLabel from '@mui/material/InputLabel'
import { ClientTableFilters } from './types'

type ProgramManager = {
  id: string
  label: string
}

type Props = {
  programManagers: ProgramManager[]
  filters: ClientTableFilters
  onFilters: (name: string, value: string) => void
}

export default function CustomerTableToolbar({ programManagers, filters, onFilters }: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value)
    },
    [onFilters],
  )

  const handleFilterProgramManager = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('programManagerId', event.target.value)
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
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Responsabil</InputLabel>

        <Select
          value={filters.programManagerId}
          onChange={handleFilterProgramManager}
          input={<OutlinedInput label="Responsabil" />}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          <MenuItem key="toti" value="">
            <Checkbox disableRipple size="small" checked={!filters.programManagerId} />
            Toti
          </MenuItem>
          {programManagers.map(pm => (
            <MenuItem key={pm.id} value={pm.id}>
              <Checkbox disableRipple size="small" checked={filters.programManagerId === pm.id} />
              {pm.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.name}
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
      </Stack>
    </Stack>
  )
}
