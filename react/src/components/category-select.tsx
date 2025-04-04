import React from 'react'

import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import { APP_STORAGE_KEYS, useLocalStorageContext } from 'components/local-storage'

import { useAuthContext } from 'auth/hooks'
import { CATEGORY_CODE_TO_LABEL } from 'utils/constants'

type Props = {
  onChange(event: SelectChangeEvent<string>): void
}

const CategorySelect: React.FC<Props> = ({ onChange }) => {
  const localStorage = useLocalStorageContext()

  const { user } = useAuthContext()

  const { category } = localStorage

  const handleChange = (event: SelectChangeEvent<string>) => {
    localStorage.onUpdate(APP_STORAGE_KEYS.CATEGORY, event.target.value)
    onChange(event)
  }

  return (
    <Select
      value={category}
      onChange={handleChange}
      input={<OutlinedInput label="Domeniu" />}
      MenuProps={{
        PaperProps: {
          sx: { maxHeight: 240 },
        },
      }}
    >
      <MenuItem key="all" value="">
        <Checkbox disableRipple size="small" checked={!category} />
        Toate
      </MenuItem>
      {user?.categories.map(c => (
        <MenuItem key={c.code} value={c.code}>
          <Checkbox disableRipple size="small" checked={category === c.code} />
          {CATEGORY_CODE_TO_LABEL[c.code as keyof typeof CATEGORY_CODE_TO_LABEL]}
        </MenuItem>
      ))}
    </Select>
  )
}

export default CategorySelect
