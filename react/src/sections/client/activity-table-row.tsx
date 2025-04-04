import LoadingButton from '@mui/lab/LoadingButton'
import { Box, IconButton, Switch, Tooltip, Typography } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { ConfirmDialog } from 'components/custom-dialog'

import CustomPopover, { usePopover } from 'components/custom-popover'
import Iconify from 'components/iconify'
import {
  ClientActivityFragmentDoc,
  useToggleClientActivityMutation,
  useUpdateClientActivityMutation,
} from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import React from 'react'
import { CombinedActivityType } from 'sections/client/types'
import { primary } from 'theme/palette'
import { CATEGORY_CODE_TO_LABEL, getUnitCostTypeLabel } from 'utils/constants'

type Props = {
  clientUuid: string
  date: Date
  loadingDelete: boolean
  row: CombinedActivityType
  onEditRow(clientActivityUuid?: string): void
  onDeleteRow: VoidFunction
  onEditLogs: VoidFunction
  canSeeCosts: boolean
}

const ActivityTableRow: React.FC<Props> = ({
  clientUuid,
  date,
  loadingDelete,
  row,
  onEditRow,
  onDeleteRow,
  onEditLogs,
  canSeeCosts,
}) => {
  const [updateClientActivity, { loading: loadingAdd }] = useUpdateClientActivityMutation()
  const [toggleClientActivity, { loading: loadingToggle }] = useToggleClientActivityMutation()

  const confirm = useBoolean()

  const popover = usePopover()

  const handleToggleClientActivity = (clientActivityUuid: string) => {
    toggleClientActivity({
      variables: {
        clientUuid,
        clientActivityUuid,
      },
      // optimisticResponse: {
      //   __typename: 'Mutation',
      //   toggleClientActivity: {
      //     __typename: 'ToggleClientActivity',
      //     error: null,
      //     user: {
      //       ...user,
      //       permissions: user.permissions.includes(permission)
      //         ? user.permissions.filter(p => p !== permission)
      //         : [...user.permissions, permission],
      //       __typename: 'UserType',
      //     },
      //   },
      // },
      update(cache) {
        cache.modify({
          id: cache.identify({ uuid: clientActivityUuid, __typename: 'ClientActivityType' }),
          fields: {
            isExecuted(currentIsExecuted) {
              return !currentIsExecuted
            },
          },
        })
      },
    })
  }

  const handleOnAddClientActivity = () => {
    updateClientActivity({
      variables: {
        clientUuid,
        activityInput: {
          uuid: row.uuid,
          name: row.name,
          description: row.description,
          categoryCode: row.category.code,
          unitCost: row.unitCost,
          unitCostCurrency: row.unitCostCurrency,
          unitCostType: row.unitCostType,
        },
        clientActivityInput: {
          uuid: row.clientActivityUuid,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          quantity: row.quantity,
        },
      },
      update(cache, { data: cacheData }) {
        cache.modify({
          id: cache.identify({ uuid: clientUuid, __typename: 'ClientType' }),
          fields: {
            activities(existingActivities = []) {
              const newActivity = cache.writeFragment({
                data: cacheData?.updateClientActivity?.clientActivity,
                fragment: ClientActivityFragmentDoc,
              })
              return [newActivity, ...existingActivities]
            },
          },
        })
      },
    })
  }

  return (
    <>
      <TableRow>
        <TableCell style={{ width: 150 }}>
          <Switch
            checked={row.isExecuted}
            onChange={() => {
              if (row.clientActivityUuid) {
                handleToggleClientActivity(row.clientActivityUuid)
              } else {
                handleOnAddClientActivity()
              }
            }}
            disabled={loadingToggle || loadingAdd}
            color="success"
          />
          {row.isExecuted && (
            <IconButton size="small" onClick={onEditLogs} color="warning">
              <Iconify icon="solar:clock-circle-outline" width={24} />
            </IconButton>
          )}
        </TableCell>
        <TableCell
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          <ListItemText
            primary={
              <Box display="flex" alignItems="center">
                <Typography
                  component="div"
                  variant="body2"
                  onClick={() => onEditRow(row.uuid)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {row.name}
                </Typography>
                &nbsp;&nbsp;&nbsp;
                {row.isCustom && (
                  <Tooltip
                    arrow
                    title={
                      <Typography sx={{ p: 1 }} variant="subtitle2">
                        Această activitate a fost creată special pentru acest client
                      </Typography>
                    }
                  >
                    <Iconify width={24} icon="solar:bill-outline" color={primary.main} />
                  </Tooltip>
                )}
                {row.isRecurrent && (
                  <Tooltip
                    arrow
                    title={
                      <Typography sx={{ p: 1 }} variant="subtitle2">
                        Această activitate este recurentă și va fi transferată automat și în luna
                        următoare
                      </Typography>
                    }
                  >
                    <Iconify width={24} icon="solar:repeat-outline" color={primary.main} />
                  </Tooltip>
                )}
              </Box>
            }
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={
              CATEGORY_CODE_TO_LABEL[row.category.code as keyof typeof CATEGORY_CODE_TO_LABEL]
            }
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        {canSeeCosts && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            <ListItemText
              primary={row.unitCost ? `${row.unitCost} ${row.unitCostCurrency}` : ''}
              secondary=""
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            />
          </TableCell>
        )}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={getUnitCostTypeLabel(row.unitCostType)}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={row.quantity}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
      </TableRow>

      {row.clientActivityUuid && (
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem
            onClick={() => {
              confirm.onTrue()
              popover.onClose()
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Șterge
          </MenuItem>
        </CustomPopover>
      )}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Șterge Serviciu"
        content="Ești sigur că vrei să ștergi acest serviciu?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={onDeleteRow}
            loading={loadingDelete}
          >
            Șterge
          </LoadingButton>
        }
      />
    </>
  )
}

export default ActivityTableRow
