import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { useSnackbar } from 'components/snackbar'
import {
  useOrganizationToggleUserPermissionMutation,
  useOrganizationUserQuery,
  OrganizationUserQuery,
  UserPermissionsEnum,
  useOrganizationClientsQuery,
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import ResponseHandler from 'components/response-handler'
import { Box, FormControlLabel, Switch, Tab, Tabs } from '@mui/material'
import { useCallback, useState } from 'react'

enum TABS_VALUES {
  GENERAL = 'g',
  CLIENTS = 'c',
}

const TABS = [
  {
    value: TABS_VALUES.GENERAL,
    label: 'Permisiuni Generale',
  },
  {
    value: TABS_VALUES.CLIENTS,
    label: 'Permisiuni Clienti',
  },
]

const Permissions = [
  [
    UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS,
    'Are permisiunea de a adăuga clienți și de a actualiza informații despre aceștia?',
  ],
  [
    UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS,
    'Are permisiunea de a vedea detalii despre clienți (Asociați, prețuri pachete de bază etc)?',
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
  onClose: () => void
}

const UpdateUserPermissions: React.FC<Props> = ({ user, onClose }) => {
  const [togglePermission, { loading }] = useOrganizationToggleUserPermissionMutation()
  const result = useOrganizationClientsQuery()

  const { enqueueSnackbar } = useSnackbar()

  const [currentTab, setCurrentTab] = useState(TABS_VALUES.GENERAL)

  const handleChangeTab = useCallback((_: React.SyntheticEvent, newValue: TABS_VALUES) => {
    setCurrentTab(newValue)
  }, [])

  const onToggle = async (permission: UserPermissionsEnum) => {
    try {
      await togglePermission({
        variables: {
          userUuid: user.uuid,
          permission,
        },
        update(cache) {
          cache.modify({
            id: cache.identify({ uuid: user.uuid, __typename: 'UserType' }),
            fields: {
              permissions(currentPermissions) {
                if (currentPermissions.includes(permission)) {
                  return currentPermissions.filter((p: UserPermissionsEnum) => p !== permission)
                }
                return [...currentPermissions, permission]
              },
            },
          })
        },
      })
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  }

  return (
    <Dialog
      fullWidth
      open
      maxWidth={false}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>Permisiuni {user.name}</DialogTitle>
      <DialogContent>
        <br />
        <Tabs
          variant="fullWidth"
          textColor="secondary"
          indicatorColor="primary"
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map(tab => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>

        {currentTab === TABS_VALUES.GENERAL &&
          Permissions.map(([perm, label]) => (
            <FormControlLabel
              sx={{ mb: 2 }}
              label={label}
              key={perm}
              control={
                <Switch
                  checked={user.permissions.includes(perm as UserPermissionsEnum)}
                  onChange={() => onToggle(perm as UserPermissionsEnum)}
                  disabled={loading}
                  color="primary"
                />
              }
            />
          ))}
        {currentTab === TABS_VALUES.CLIENTS && (
          <>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <FormControlLabel
                sx={{ mb: 2 }}
                label="Access la toti clientii din firma"
                control={
                  <Switch
                    checked={user.permissions.includes(UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS)}
                    onChange={() => onToggle(UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS)}
                    disabled={loading}
                    color="primary"
                  />
                }
              />
              <FormControlLabel
                sx={{ mb: 2 }}
                label="Access la toti clientii de care este responsabil"
                control={
                  <Switch
                    checked={user.permissions.includes(UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS)}
                    onChange={() => onToggle(UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS)}
                    disabled={loading}
                    color="primary"
                  />
                }
              />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <ResponseHandler {...result}>
                {({ organization }) => {
                  return (
                    <>
                      {organization.clients.map(client => (
                        <FormControlLabel
                          key={client.uuid}
                          sx={{ mb: 2 }}
                          label={client.name}
                          control={
                            <Switch
                              checked={false}
                              onChange={() => {}}
                              disabled={loading}
                              color="primary"
                            />
                          }
                        />
                      ))}
                    </>
                  )
                }}
              </ResponseHandler>
            </Box>
          </>
        )}
        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            {'<'} Înapoi
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

type ContainerProps = {
  userUuid: string
  onClose(): void
}

const UpdateUserPermissionsContainer: React.FC<ContainerProps> = ({ userUuid, onClose }) => {
  const result = useOrganizationUserQuery({ variables: { uuid: userUuid } })

  return (
    <ResponseHandler {...result}>
      {({ organization }) => {
        return <UpdateUserPermissions user={organization.user} onClose={onClose} />
      }}
    </ResponseHandler>
  )
}

export default UpdateUserPermissionsContainer
