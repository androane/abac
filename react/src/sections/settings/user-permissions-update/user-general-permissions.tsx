import { OrganizationUserQuery, UserPermissionsEnum } from 'generated/graphql'
import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'

const PERMISSIONS: [UserPermissionsEnum, string][] = [
  [
    UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS,
    'Are permisiunea de a adăuga clienți și de a actualiza informații despre aceștia?',
  ],
  [
    UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS,
    'Are permisiunea de a vedea informații detaliate despre clienți (Asociați, prețuri pachete de bază etc)?',
  ],
  [
    UserPermissionsEnum.HAS_CLIENT_ACTIVITY_COSTS_ACCESS,
    'Are permisiunea de a vedea prețurile pentru pachete și servicii?',
  ],
  [
    UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS,
    'Are permisiunea de a accesa modulul de facturare de pe pagina clienților?',
  ],
  [
    UserPermissionsEnum.HAS_SETTINGS_ACCESS,
    'Are permisiunea de a accessa modulul de Configurări pentru a modifica Serviciile și Pachetele oferite?',
  ],
]

type Props = {
  user: OrganizationUserQuery['organization']['user']
  onTogglePermission(permission: UserPermissionsEnum): void
  loading: boolean
}

const GeneralPermissionsTab: React.FC<Props> = ({ user, onTogglePermission, loading }) => {
  return PERMISSIONS.map(([perm, label]) => (
    <FormControlLabel
      sx={{ mb: 2 }}
      label={label}
      key={perm}
      control={
        <Switch
          checked={user.permissions.includes(perm)}
          onChange={() => onTogglePermission(perm)}
          disabled={loading}
          color="success"
        />
      }
    />
  ))
}

export default GeneralPermissionsTab
