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
  UserPermissionsEnum,
} from 'generated/graphql'
import ActivityTableFiltersResult from 'sections/client/activity-table-filters-result'
import ActivityTableToolbar from 'sections/client/activity-table-toolbar'
import ActivityTableRow from 'sections/client/activity-table-row'
import {
  APIClient,
  APIClientSolution,
  ClientActivityTableFilters,
  CombinedActivityType,
} from 'sections/client/types'
import UpdateClientActivity from 'sections/client/activity-update'
import { UpdateClientActivityLogs, UpdateClientSolutionLogs } from 'sections/client/logs-update'
import { useAuthContext } from 'auth/hooks'
import {
  APP_STORAGE_KEYS,
  DEFAULT_APP_STORAGE,
  useLocalStorageContext,
} from 'components/local-storage'
import SolutionTableRow from 'sections/client/solution-table-row'
import UpdateClientSolution from 'sections/client/solution-update'
import { useBoolean } from 'hooks/use-boolean'

const defaultFilters = {
  name: '',
  isCustom: '',
  category: DEFAULT_APP_STORAGE.category,
}

type ActivityListCardProps = {
  clientUuid: string
  clientSolutions: APIClientSolution[]
  activities: CombinedActivityType[]
  date: Date
  onChangeDate: (newDate: Date) => void
}

const ActivityListCard: React.FC<ActivityListCardProps> = ({
  clientUuid,
  clientSolutions,
  activities,
  date,
  onChangeDate,
}) => {
  let TABLE_HEAD = [
    { id: 'isExecuted', label: 'Efectuat?' },
    { id: 'name', label: 'Nume' },
    { id: 'category', label: 'Domeniu' },
    { id: 'unitCost', label: 'Cost' },
    { id: 'unitCostType', label: 'Tip Cost' },
    { id: 'quantity', label: 'Cantitate' },
  ]

  const showCreateActivity = useBoolean()

  const { hasPermission } = useAuthContext()

  const [deleteActivity, { loading }] = useDeleteClientActivityMutation()

  const canSeeCosts = hasPermission(UserPermissionsEnum.HAS_CLIENT_ACTIVITY_COSTS_ACCESS)

  if (!canSeeCosts) {
    TABLE_HEAD = TABLE_HEAD.filter(_ => _.id !== 'unitCost')
  }

  const [activityUuidToEdit, setActivityUuidToEdit] = useState<undefined | string>()
  const [solutionUuidToEdit, setSolutionUuidToEdit] = useState<undefined | string>()
  const [clientActivityUuidLogsToEdit, setClientActivityUuidLogsToEdit] = useState<
    undefined | string
  >()
  const [clientSolutionUuidLogsToEdit, setClientSolutionUuidLogsToEdit] = useState<
    undefined | string
  >()

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(activities)

  useEffect(() => {
    setTableData(activities)
  }, [activities])

  const table = useTable({
    defaultOrderBy: 'isCustom',
    defaultOrder: 'asc',
    defaultRowsPerPage: 100,
  })

  const denseHeight = table.dense ? 56 : 56 + 20

  const localStorage = useLocalStorageContext()

  const [filters, setFilters] = useState({ ...defaultFilters, category: localStorage.category })

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
    localStorage.onResetKey(APP_STORAGE_KEYS.CATEGORY)
  }, [localStorage])

  const handleDeleteRow = async (uuid: string) => {
    await deleteActivity({
      variables: { uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'ActivityType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Activitatea a fost ștearsă!')

    setActivityUuidToEdit(undefined)

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  return (
    <Card>
      {showCreateActivity.value && (
        <UpdateClientActivity
          date={date}
          clientUuid={clientUuid}
          activity={activities.find(_ => _.uuid === activityUuidToEdit)!}
          onClose={showCreateActivity.onFalse}
          canSeeCosts={canSeeCosts}
        />
      )}
      {solutionUuidToEdit && (
        <UpdateClientSolution
          clientUuid={clientUuid}
          clientSolution={clientSolutions.find(_ => _.uuid === solutionUuidToEdit)!}
          onClose={() => setSolutionUuidToEdit(undefined)}
        />
      )}
      {clientActivityUuidLogsToEdit && (
        <UpdateClientActivityLogs
          clientUuid={clientUuid}
          date={date}
          activityName={
            activities.find(_ => _.clientActivityUuid === clientActivityUuidLogsToEdit)!.name
          }
          clientActivityUuid={clientActivityUuidLogsToEdit}
          onClose={() => setClientActivityUuidLogsToEdit(undefined)}
        />
      )}
      {clientSolutionUuidLogsToEdit && (
        <UpdateClientSolutionLogs
          clientUuid={clientUuid}
          date={date}
          activityName={
            clientSolutions.find(_ => _.uuid === clientSolutionUuidLogsToEdit)!.solution.name
          }
          clientSolutionUuid={clientSolutionUuidLogsToEdit}
          onClose={() => setClientSolutionUuidLogsToEdit(undefined)}
        />
      )}
      <ActivityTableToolbar
        onAddActivity={() => {
          showCreateActivity.onTrue()
          setActivityUuidToEdit(undefined)
        }}
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
              {clientSolutions.map(clientSolution => (
                <SolutionTableRow
                  key={clientSolution.uuid}
                  row={clientSolution}
                  onEditRow={uuid => setSolutionUuidToEdit(uuid)}
                  onEditLogs={() => setClientSolutionUuidLogsToEdit(clientSolution.uuid)}
                  canSeeCosts={canSeeCosts}
                />
              ))}
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
                    onEditRow={uuid => {
                      showCreateActivity.onTrue()
                      setActivityUuidToEdit(uuid)
                    }}
                    onEditLogs={() =>
                      row.clientActivityUuid &&
                      setClientActivityUuidLogsToEdit(row.clientActivityUuid)
                    }
                    loadingDelete={loading}
                    canSeeCosts={canSeeCosts}
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
  client: APIClient
}

const ClientActivityView: React.FC<Props> = ({ client }) => {
  const [date, setDate] = useState(startOfMonth(new Date()))

  const clientActivitiesResult = useClientActivitiesQuery({
    variables: {
      clientUuid: client.uuid,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    },
  })

  const activitiesResult = useOrganizationActivitiesQuery({
    variables: {
      excludeSolutionActivities: true,
    },
  })

  return (
    <ResponseHandler {...clientActivitiesResult}>
      {({ client: { activities, solutions } }) => {
        return (
          <ResponseHandler {...activitiesResult}>
            {({ organization }) => {
              const organizationActivities = organization.activities.map(organizationActivity => {
                const overwrittenOrganizationActivity = activities.find(
                  ca => ca.activity.name === organizationActivity.name,
                )
                // Organization activities can be overwritten
                return overwrittenOrganizationActivity
                  ? {
                      ...overwrittenOrganizationActivity.activity,
                      clientActivityUuid: overwrittenOrganizationActivity.uuid,
                      quantity: overwrittenOrganizationActivity.quantity,
                      isExecuted: overwrittenOrganizationActivity.isExecuted,
                      isRecurrent: overwrittenOrganizationActivity.isRecurrent,
                      isCustom: false,
                    }
                  : {
                      ...organizationActivity,
                      clientActivityUuid: null,
                      quantity: 1,
                      isExecuted: false,
                      isRecurrent: false,
                      isCustom: false,
                    }
              })

              const customActivities = activities
                .filter(ca => {
                  // Overrwritten organization activities are not considered custom
                  const isCustomActivity = !organization.activities.some(
                    a => a.name === ca.activity.name,
                  )
                  return isCustomActivity
                })
                .map(clientActivity => ({
                  ...clientActivity.activity,
                  clientActivityUuid: clientActivity.uuid,
                  quantity: clientActivity.quantity,
                  isExecuted: clientActivity.isExecuted,
                  isRecurrent: clientActivity.isRecurrent,
                  isCustom: true,
                }))

              return (
                <ActivityListCard
                  clientUuid={client.uuid}
                  clientSolutions={solutions}
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
  inputData: CombinedActivityType[]
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

  return inputData
}

export default ClientActivityView
