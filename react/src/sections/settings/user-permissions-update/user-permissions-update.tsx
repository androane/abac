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
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import ResponseHandler from 'components/response-handler'
import { Tab, Tabs } from '@mui/material'
import React, { useCallback, useState } from 'react'
import Iconify from 'components/iconify'
import ClientPermissionsTab from 'sections/settings/user-permissions-update/user-client-permissions'
import CategoryPermissionsTab from 'sections/settings/user-permissions-update/user-category-permissions'
import GeneralPermissionsTab from 'sections/settings/user-permissions-update/user-general-permissions'

enum TABS_VALUES {
  GENERAL = 'g',
  CATEGORIES = 'ca',
  CLIENTS = 'cl',
}

const TABS = [
  {
    value: TABS_VALUES.GENERAL,
    label: 'Permisiuni Generale',
  },
  {
    value: TABS_VALUES.CATEGORIES,
    label: 'Access Domeniu',
  },
  {
    value: TABS_VALUES.CLIENTS,
    label: 'Acces Clienți',
  },
]

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
        sx: { maxWidth: 720, minHeight: 600 },
      }}
    >
      <DialogTitle>Permisiuni {user.name}</DialogTitle>
      <DialogContent>
        <br />
        <Tabs
          variant="fullWidth"
          textColor="primary"
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
        {currentTab === TABS_VALUES.CATEGORIES && (
          <CategoryPermissionsTab user={user} loading={loading} />
        )}
        {currentTab === TABS_VALUES.CLIENTS && (
          <ClientPermissionsTab
            user={user}
            onTogglePermission={onTogglePermission}
            loading={loading}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<Iconify icon="ic:outline-arrow-back" />}
          variant="outlined"
          onClick={onClose}
        >
          Înapoi
        </Button>
      </DialogActions>
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
