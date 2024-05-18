import React from 'react'

import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import { APP_STORAGE_KEYS, useLocalStorageContext } from 'components/local-storage'
import { APIOrganizationUsers } from 'sections/client/types'

type Props = {
  users: APIOrganizationUsers
  onChange(event: SelectChangeEvent<string>): void
}

const ProgramManagerSelect: React.FC<Props> = ({ users, onChange }) => {
  const localStorage = useLocalStorageContext()

  const { pmUuid } = localStorage

  const handleChange = (event: SelectChangeEvent<string>) => {
    localStorage.onUpdate(APP_STORAGE_KEYS.PROGRAM_MANAGER, event.target.value)
    onChange(event)
  }

  return (
    <Select
      value={pmUuid}
      onChange={handleChange}
      input={<OutlinedInput label="Responsabil" />}
      MenuProps={{
        PaperProps: {
          sx: { maxHeight: 240 },
        },
      }}
    >
      <MenuItem key="all" value="">
        <Checkbox disableRipple size="small" checked={!pmUuid} />
        Toti
      </MenuItem>
      {users.map(user => (
        <MenuItem key={user.uuid} value={user.uuid}>
          <Checkbox disableRipple size="small" checked={pmUuid === user.uuid} />
          {user.name}
        </MenuItem>
      ))}
    </Select>
  )
}

export default ProgramManagerSelect
