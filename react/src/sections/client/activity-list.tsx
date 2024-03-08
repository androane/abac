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

const defaultFilters = {
  name: '',
  category: '',
}

const TABLE_HEAD = [
  { id: 'isExecuted', label: 'Efectuat?' },
  { id: 'name', label: 'Nume' },
  { id: 'unitCost', label: 'Suma' },
  { id: 'unitCostType', label: 'Tip Cost' },
  { id: '', width: 88 },
]

type ActivityListCardProps = {
  activities: ClientActivityType[]
  date: Date
  onChangeDate: (newDate: Date) => void
}

const ActivityListCard: React.FC<ActivityListCardProps> = ({ activities, date, onChangeDate }) => {
  const showCreateActivity = useBoolean()

  const [deleteActivity, { loading }] = useDeleteClientActivityMutation()

  const [activityIdToEdit, setActivityIdToEdit] = useState<null | string>(null)

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(activities)

  useEffect(() => {
    setTableData(activities)
  }, [activities])

  const table = useTable({ defaultOrderBy: 'name', defaultOrder: 'asc' })

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

    enqueueSnackbar('Serviciul a fost șters!')

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
        <></>
        // <UpdateActivity
        //   organizationServices={organizationServices}
        //   invoiceId={clientInvoice.uuid}
        //   invoiceDate={invoiceDate}
        //   invoiceItem={clientInvoice.items.find(item => item.uuid === invoiceItemIdToEdit)}
        //   onClose={showCreateActivity.onFalse}
        // />
      )}
      <ActivityTableToolbar filters={filters} onFilters={handleFilters} />

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
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row.uuid)}
                    onEditRow={() => handleEditRow(row.uuid)}
                    loading={loading}
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
              const systemActivities = organization.activities.map(organizationActivity => {
                const clientActivity = clientActivities.find(
                  ca => ca.activity.name === organizationActivity.name,
                )

                if (clientActivity) {
                  return {
                    ...organizationActivity,
                    ...clientActivity.activity,
                    isExecuted: clientActivity.isExecuted,
                  }
                }
                return { ...organizationActivity, isExecuted: false }
              })

              const customActivities = clientActivities
                .filter(clientActivity => {
                  const isCustomActivity = !organization.activities.some(
                    a => a.name === clientActivity.activity.name,
                  )
                  return isCustomActivity
                })
                .map(clientActivity => ({
                  ...clientActivity.activity,
                  isExecuted: clientActivity.isExecuted,
                }))

              return (
                <>
                  <ActivityListCard
                    activities={systemActivities}
                    date={date}
                    onChangeDate={setDate}
                  />
                  {/* <ActivityListCard
                    activities={customActivities}
                    date={date}
                    onChangeDate={setDate}
                  /> */}
                </>
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

  return inputData
}

export default ActivityListView
