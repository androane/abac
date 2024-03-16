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
  UnitCostTypeEnum,
} from 'generated/graphql'
import ActivityTableFiltersResult from 'sections/settings/activity-table-filters-result'
import ActivityTableToolbar from 'sections/client/activity-table-toolbar'
import ActivityTableRow from 'sections/client/activity-table-row'
import { ClientActivityTableFilters, ClientActivityType } from 'sections/client/types'
import UpdateClientActivity from 'sections/client/activity-update'
import { UpdateClientActivityLogs, UpdateClientSolutionLogs } from 'sections/client/logs-update'

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
  const [deleteActivity, { loading }] = useDeleteClientActivityMutation()

  const [activityUuidToEdit, setActivityUuidToEdit] = useState<undefined | string>()
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

    setActivityUuidToEdit(undefined)

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  const handleEditRow = useCallback(
    (uuid?: string) => {
      setActivityUuidToEdit(uuid)
    },
    [setActivityUuidToEdit],
  )

  return (
    <Card>
      {activityUuidToEdit && (
        <UpdateClientActivity
          date={date}
          clientUuid={clientUuid}
          activity={activities.find(_ => _.activityUuid === activityUuidToEdit)!}
          onClose={() => setActivityUuidToEdit(undefined)}
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
            activities.find(_ => _.clientSolutionUuid === clientSolutionUuidLogsToEdit)!.name
          }
          clientSolutionUuid={clientSolutionUuidLogsToEdit}
          onClose={() => setClientSolutionUuidLogsToEdit(undefined)}
        />
      )}
      <ActivityTableToolbar
        onAddActivity={handleEditRow}
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
                    onEditRow={handleEditRow}
                    onEditLogs={() => {
                      if (row.clientSolutionUuid) {
                        setClientSolutionUuidLogsToEdit(row.clientSolutionUuid)
                      } else {
                        setClientActivityUuidLogsToEdit(row.clientActivityUuid)
                      }
                    }}
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
  clientUuid: string
}

const ActivityListView: React.FC<Props> = ({ clientUuid }) => {
  const [date, setDate] = useState(startOfMonth(new Date()))

  const clientActivitiesResult = useClientActivitiesQuery({
    variables: {
      clientUuid,
      month: date ? date.getMonth() + 1 : null,
      year: date?.getFullYear(),
    },
  })

  const activitiesResult = useOrganizationActivitiesQuery()

  return (
    <ResponseHandler {...clientActivitiesResult}>
      {({ client }) => {
        const solutionActivities = client.solutions.map(cs => {
          return {
            uuid: cs.uuid,
            name: cs.solution.name,
            clientSolutionUuid: cs.uuid,
            activityUuid: cs.solution.uuid,
            category: cs.solution.category,
            description: '',
            unitCost: cs.unitCost,
            unitCostCurrency: cs.unitCostCurrency,
            unitCostType: UnitCostTypeEnum.FIXED,
            isCustom: true,
            isExecuted: true,
          }
        })

        return (
          <ResponseHandler {...activitiesResult}>
            {({ organization }) => {
              const organizationActivities = organization.activities.map(organizationActivity => {
                const overwrittenOrganizationAcitivty = client.activities.find(
                  ca => ca.activity.name === organizationActivity.name,
                )
                // Organization activities can be overwritten
                const activity = overwrittenOrganizationAcitivty
                  ? {
                      ...overwrittenOrganizationAcitivty.activity,
                      clientActivityUuid: overwrittenOrganizationAcitivty.uuid,
                      isExecuted: overwrittenOrganizationAcitivty.isExecuted,
                    }
                  : {
                      ...organizationActivity,
                      isExecuted: false,
                    }
                return {
                  ...activity,
                  activityUuid: organizationActivity.uuid,
                  isCustom: false,
                }
              })

              const customActivities = client.activities
                .filter(ca => {
                  // Overrwritten organization activities are not considered custom
                  const isCustomActivity = !organization.activities.some(
                    a => a.name === ca.activity.name,
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
                  clientUuid={clientUuid}
                  activities={[
                    ...solutionActivities,
                    ...organizationActivities,
                    ...customActivities,
                  ]}
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
    // Make the solution activities appear first
    if (!a[0].clientSolutionUuid && b[0].clientSolutionUuid) {
      return 1
    }
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
