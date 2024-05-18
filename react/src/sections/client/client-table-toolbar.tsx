import React, { useCallback, useEffect } from 'react'

import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useLocalStorageContext } from 'components/local-storage'

import FormControl from '@mui/material/FormControl'
import { SelectChangeEvent } from '@mui/material/Select'
import Iconify from 'components/iconify'
import InputLabel from '@mui/material/InputLabel'
import ProgramManagerSelect from 'components/program-manager-select'
import { APIOrganizationUsers, ClientTableFilters } from './types'

type Props = {
  users: APIOrganizationUsers
  filters: ClientTableFilters
  onFilters: (name: string, value: string) => void
}

const ClientTableToolbar: React.FC<Props> = ({ users, filters, onFilters }) => {
  const localStorage = useLocalStorageContext()

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value)
    },
    [onFilters],
  )

  const { pmUuid } = localStorage

  useEffect(() => {
    onFilters('programManagerId', pmUuid)
  }, [pmUuid, onFilters])

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
        <ProgramManagerSelect users={users} onChange={handleFilterProgramManager} />
      </FormControl>
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Caută..."
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

export default ClientTableToolbar
