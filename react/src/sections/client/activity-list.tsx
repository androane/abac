import isEqual from 'lodash/isEqual'
import React, { useCallback, useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { useSnackbar } from 'components/snackbar'
import { startOfMonth } from 'date-fns'

import Scrollbar from 'components/scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  emptyRows,
  getComparator,
  useTable,
} from 'components/table'

import ResponseHandler from 'components/response-handler'
import {
  useOrganizationActivitiesQuery,
  useClientActivitiesQuery,
  useDeleteClientActivityMutation,
} from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import ActivityTableFiltersResult from 'sections/settings/activity-table-filters-result'
import ActivityTableToolbar from 'sections/client/activity-table-toolbar'
import ActivityTableRow from 'sections/client/activity-table-row'
import { ClientActivityTableFilters, ClientActivityType } from 'sections/client/types'
import UpdateClientActivity from 'sections/client/activity-update'
import UpdateClientActivityLogs from 'sections/client/activity-logs-update'

const defaultFilters = {
  name: '',
  category: '',
  isCustom: '',
}

const TABLE_HEAD = [
  { id: 'isExecuted', label: 'Efectuat?' },
  { id: 'name', label: 'Nume' },
  { id: 'isCustom', label: 'Este specifică clientului?' },
  { id: 'category', label: 'Domeniu' },
  { id: 'unitCost', label: 'Suma' },
  { id: 'unitCostType', label: 'Tip Cost' },
]

type ActivityListCardProps = {
  clientUuid: string
  activities: ClientActivityType[]
  date: Date
  onChangeDate: (newDate: Date) => void
}

const ActivityListCard: React.FC<ActivityListCardProps> = ({
  clientUuid,
  activities,
  date,
  onChangeDate,
}) => {
  const showCreateActivity = useBoolean()

  const [deleteActivity, { loading }] = useDeleteClientActivityMutation()

  const [activityIdToEdit, setActivityIdToEdit] = useState<null | string>(null)
  const [activityIdLogsToEdit, setActivityIdLogsToEdit] = useState<undefined | string>(undefined)

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(activities)

  useEffect(() => {
    setTableData(activities)
  }, [activities])

  const table = useTable({ defaultOrderBy: 'isCustom', defaultOrder: 'asc' })

  const denseHeight = table.dense ? 56 : 56 + 20

  const [filters, setFilters] = useState(defaultFilters)

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  })

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  )

  const canReset = !isEqual(defaultFilters, filters)

  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage()
      setFilters(prevState => ({
        ...prevState,
        [name]: value,
      }))
    },
    [table],
  )

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const handleDeleteRow = async (uuid: string) => {
    await deleteActivity({
      variables: { uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'ActivityType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Activitatea a fost ștersă!')

    showCreateActivity.onFalse()

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  const handleEditRow = useCallback(
    (id: null | string) => {
      setActivityIdToEdit(id)
      showCreateActivity.onTrue()
    },
    [showCreateActivity, setActivityIdToEdit],
  )

  return (
    <Card>
      {showCreateActivity.value && (
        <UpdateClientActivity
          date={date}
          clientUuid={clientUuid}
          activity={activities.find(_ => _.activityUuid === activityIdToEdit)!}
          onClose={showCreateActivity.onFalse}
        />
      )}
      {activityIdLogsToEdit && (
        <UpdateClientActivityLogs
          date={date}
          activityName={activities.find(_ => _.clientActivityUuid === activityIdLogsToEdit)!.name}
          clientActivityUuid={activityIdLogsToEdit}
          onClose={() => setActivityIdLogsToEdit(undefined)}
        />
      )}
      <ActivityTableToolbar
        onAddActivity={() => handleEditRow(null)}
        date={date}
        onChangeDate={onChangeDate}
        filters={filters}
        onFilters={handleFilters}
      />

      {canReset && (
        <ActivityTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage,
                )
                .map(row => (
                  <ActivityTableRow
                    key={row.uuid}
                    clientUuid={clientUuid}
                    date={date}
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row.uuid)}
                    onEditRow={() => handleEditRow(row.uuid)}
                    onEditLogs={() => setActivityIdLogsToEdit(row.clientActivityUuid)}
                    loadingDelete={loading}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  )
}

type Props = {
  clientId: string
}

const ActivityListView: React.FC<Props> = ({ clientId }) => {
  const [date, setDate] = useState(startOfMonth(new Date()))

  const clientActivitiesResult = useClientActivitiesQuery({
    variables: {
      clientUuid: clientId,
      month: date ? date.getMonth() + 1 : null,
      year: date?.getFullYear(),
    },
  })

  const activitiesResult = useOrganizationActivitiesQuery()

  return (
    <ResponseHandler {...clientActivitiesResult}>
      {({ clientActivities }) => {
        return (
          <ResponseHandler {...activitiesResult}>
            {({ organization }) => {
              const organizationActivities = organization.activities.map(organizationActivity => {
                const clientActivity = clientActivities.find(
                  ca => ca.activity.name === organizationActivity.name,
                )

                // This means that a system/organization activity has been overriden by a custom activity
                if (clientActivity) {
                  return {
                    ...organizationActivity,
                    ...clientActivity.activity,
                    activityUuid: organizationActivity.uuid,
                    clientActivityUuid: clientActivity.uuid,
                    isExecuted: clientActivity.isExecuted,
                    isCustom: false,
                  }
                }

                return {
                  ...organizationActivity,
                  activityUuid: organizationActivity.uuid,
                  isExecuted: false,
                  isCustom: false,
                }
              })

              const customActivities = clientActivities
                .filter(clientActivity => {
                  // It's a custom activity if it's not an overriden organization activity
                  const isCustomActivity = !organization.activities.some(
                    a => a.name === clientActivity.activity.name,
                  )
                  return isCustomActivity
                })
                .map(clientActivity => ({
                  ...clientActivity.activity,
                  activityUuid: clientActivity.activity.uuid,
                  clientActivityUuid: clientActivity.uuid,
                  isExecuted: clientActivity.isExecuted,
                  isCustom: true,
                }))

              return (
                <ActivityListCard
                  clientUuid={clientId}
                  activities={[...organizationActivities, ...customActivities]}
                  date={date}
                  onChangeDate={setDate}
                />
              )
            }}
          </ResponseHandler>
        )
      }}
    </ResponseHandler>
  )
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: ClientActivityType[]
  comparator: (a: any, b: any) => number
  filters: ClientActivityTableFilters
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const)

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  inputData = stabilizedThis.map(el => el[0])

  if (filters.name) {
    inputData = inputData.filter(
      invoice => invoice.name.toLowerCase().indexOf(filters.name.toLowerCase()) !== -1,
    )
  }

  if (filters.category) {
    inputData = inputData.filter(activity => activity.category.code === filters.category)
  }

  if (filters.isCustom) {
    inputData = inputData.filter(activity =>
      filters.isCustom === 'yes' ? activity.isCustom : !activity.isCustom,
    )
  }

  return inputData
}

export default ActivityListView
