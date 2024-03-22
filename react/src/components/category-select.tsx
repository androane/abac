import React from 'react'

import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import { APP_STORAGE_KEYS, useLocalStorageContext } from 'components/local-storage'

import { CATEGORY_CODES, getCategoryLabelFromCode } from 'utils/constants'

type Props = {
  onChange(event: SelectChangeEvent<string>): void
}

const CategorySelect: React.FC<Props> = ({ onChange }) => {
  const localStorage = useLocalStorageContext()
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
      {CATEGORY_CODES.map(c => (
        <MenuItem key={c} value={c}>
          <Checkbox disableRipple size="small" checked={category === c} />
          {getCategoryLabelFromCode(c)}
        </MenuItem>
      ))}
    </Select>
  )
}

export default CategorySelect
