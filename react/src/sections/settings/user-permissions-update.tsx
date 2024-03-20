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
  useOrganizationToggleUserClientPermissionsMutation,
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import ResponseHandler from 'components/response-handler'
import { Box, Checkbox, Divider, FormControlLabel, Switch, Tab, Tabs } from '@mui/material'
import React, { useCallback, useState } from 'react'

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
    label: 'Permisiuni Clienți',
  },
]

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

type ClientPermissionsTabProps = {
  onTogglePermission(permission: UserPermissionsEnum): void
  user: OrganizationUserQuery['organization']['user']
  loading: boolean
}

const ClientPermissionsTab: React.FC<ClientPermissionsTabProps> = ({
  user,
  onTogglePermission,
  loading,
}) => {
  const { enqueueSnackbar } = useSnackbar()

  const result = useOrganizationClientsQuery()

  const [toggleClientPermission, { loading: loadingClientPerm }] =
    useOrganizationToggleUserClientPermissionsMutation()

  const onToggleClientPermission = async (clientUuid: string) => {
    try {
      await toggleClientPermission({
        variables: {
          userUuid: user.uuid,
          clientUuid,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleUserClientPermissions: {
            __typename: 'ToggleUserClientPermission',
            error: null,
            user: {
              ...user,
              clientsWithAccess: user.clientsWithAccess.find(c => c.uuid === clientUuid)
                ? user.clientsWithAccess.filter(c => c.uuid !== clientUuid)
                : [
                    ...user.clientsWithAccess,
                    {
                      uuid: clientUuid,
                      name: '',
                      __typename: 'ClientType',
                    },
                  ],
              __typename: 'UserType',
            },
          },
        },
      })
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  }

  return (
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
          label="Are access la toți clienții din firmă?"
          control={
            <Switch
              checked={user.permissions.includes(UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS)}
              onChange={() => onTogglePermission(UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS)}
              disabled={loading}
              color="primary"
            />
          }
        />
        <FormControlLabel
          sx={{ mb: 2 }}
          label="Are access la toți clienții de care este responsabil?"
          control={
            <Switch
              checked={user.permissions.includes(UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS)}
              onChange={() => onTogglePermission(UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS)}
              disabled={loading}
              color="primary"
            />
          }
        />
      </Box>
      <Divider sx={{ borderStyle: 'dashed', mt: 3, mb: 3 }} />
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
                {organization.clients.map(client => {
                  const hasClientPermissionAsPM =
                    user.permissions.includes(UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS) &&
                    client.programManager?.uuid === user.uuid

                  const hasAllClientsPermission = user.permissions.includes(
                    UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS,
                  )

                  const hasClientPermission = Boolean(
                    user.clientsWithAccess.find(c => c.uuid === client.uuid),
                  )

                  return (
                    <FormControlLabel
                      key={client.uuid}
                      label={client.name}
                      control={
                        <Checkbox
                          size="medium"
                          checked={
                            hasClientPermission ||
                            hasClientPermissionAsPM ||
                            hasAllClientsPermission
                          }
                          onChange={() => onToggleClientPermission(client.uuid)}
                          disabled={
                            loadingClientPerm ||
                            loading ||
                            hasClientPermissionAsPM ||
                            hasAllClientsPermission
                          }
                          color="primary"
                        />
                      }
                    />
                  )
                })}
              </>
            )
          }}
        </ResponseHandler>
      </Box>
    </>
  )
}

type GeneralPermissionsTabProps = {
  user: OrganizationUserQuery['organization']['user']
  onTogglePermission(permission: UserPermissionsEnum): void
  loading: boolean
}

const GeneralPermissionsTab: React.FC<GeneralPermissionsTabProps> = ({
  user,
  onTogglePermission,
  loading,
}) => {
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
          color="primary"
        />
      }
    />
  ))
}

type Props = {
  user: OrganizationUserQuery['organization']['user']
  onClose: () => void
}

const UpdateUserPermissions: React.FC<Props> = ({ user, onClose }) => {
  const [togglePermission, { loading }] = useOrganizationToggleUserPermissionMutation()

  const { enqueueSnackbar } = useSnackbar()

  const [currentTab, setCurrentTab] = useState(TABS_VALUES.GENERAL)

  const handleChangeTab = useCallback((_: React.SyntheticEvent, newValue: TABS_VALUES) => {
    setCurrentTab(newValue)
  }, [])

  const onTogglePermission = async (permission: UserPermissionsEnum) => {
    try {
      await togglePermission({
        variables: {
          userUuid: user.uuid,
          permission,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleUserPermission: {
            __typename: 'ToggleUserPermission',
            error: null,
            user: {
              ...user,
              permissions: user.permissions.includes(permission)
                ? user.permissions.filter(p => p !== permission)
                : [...user.permissions, permission],
              __typename: 'UserType',
            },
          },
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

        {currentTab === TABS_VALUES.GENERAL && (
          <GeneralPermissionsTab
            user={user}
            onTogglePermission={onTogglePermission}
            loading={loading}
          />
        )}
        {currentTab === TABS_VALUES.CLIENTS && (
          <ClientPermissionsTab
            user={user}
            onTogglePermission={onTogglePermission}
            loading={loading}
          />
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
