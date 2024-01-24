import merge from 'lodash/merge'
// date fns
import { ro as roROAdapter } from 'date-fns/locale'

// date pickers (MUI)
import { roRO as roRODate } from '@mui/x-date-pickers/locales'
// core (MUI)
import { enUS as roROCore } from '@mui/material/locale'
// data grid (MUI)
import { roRO as roRODataGrid } from '@mui/x-data-grid'

export const defaultLang = {
  label: 'English',
  value: 'en',
  systemValue: merge(roRODate, roRODataGrid, roROCore),
  adapterLocale: roROAdapter,
  numberFormat: {
    code: 'ro-RO',
    currency: 'RON',
  },
}
