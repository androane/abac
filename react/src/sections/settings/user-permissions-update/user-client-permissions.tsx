import { useSnackbar } from 'components/snackbar'
import {
  OrganizationUserQuery,
  UserPermissionsEnum,
  useOrganizationClientsQuery,
  useOrganizationToggleUserClientPermissionMutation,
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import ResponseHandler from 'components/response-handler'
import { Box, Checkbox, Divider, FormControlLabel, Switch } from '@mui/material'
import React from 'react'

type Props = {
  onTogglePermission(permission: UserPermissionsEnum): void
  user: OrganizationUserQuery['organization']['user']
  loading: boolean
}

const ClientPermissionsTab: React.FC<Props> = ({ user, onTogglePermission, loading }) => {
  const { enqueueSnackbar } = useSnackbar()

  const result = useOrganizationClientsQuery()

  const [toggleClientPermission, { loading: loadingClientPerm }] =
    useOrganizationToggleUserClientPermissionMutation()

  const onToggleClientPermission = async (clientUuid: string) => {
    try {
      await toggleClientPermission({
        variables: {
          userUuid: user.uuid,
          clientUuid,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleUserClientPermission: {
            __typename: 'ToggleUserClientPermission',
            error: null,
            user: {
              ...user,
              clients: user.clients.find(c => c.uuid === clientUuid)
                ? user.clients.filter(c => c.uuid !== clientUuid)
                : [
                    ...user.clients,
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
              color="success"
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
              color="success"
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
                    user.clients.find(c => c.uuid === client.uuid),
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
                          color="success"
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

export default ClientPermissionsTab
