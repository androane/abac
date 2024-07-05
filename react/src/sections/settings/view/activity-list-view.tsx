import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { useSnackbar } from 'components/snackbar'
import { getLandingPage, paths } from 'routes/paths'

import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Scrollbar from 'components/scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  emptyRows,
  getComparator,
  useTable,
} from 'components/table'

import ResponseHandler from 'components/response-handler'
import {
  useOrganizationActivitiesQuery,
  ActivityFragment,
  useDeleteOrganizationActivityMutation,
  UserPermissionsEnum,
} from 'generated/graphql'
import { ActivityTableFilters } from 'sections/settings/types'
import ActivityTableFiltersResult from 'sections/settings/activity-table-filters-result'
import ActivityTableRow from 'sections/settings/activity-table-row'
import AddButton from 'components/add-button'
import { useBoolean } from 'hooks/use-boolean'
import UpdateActivity from 'sections/settings/activity-update'
import ActivityTableToolbar from 'sections/settings/activity-table-toolbar'
import { withUserPermission } from 'auth/hoc'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: 'category', label: 'Domeniu' },
  { id: 'unitCost', label: 'Cost' },
  { id: 'unitCostCurrency', label: 'Moneda' },
  { id: 'unitCostType', label: 'Tip tarif' },
  { id: '', width: 88 },
]

type Props = {
  organizationUuid: string
  activities: ActivityFragment[]
}

const ActivityList: React.FC<Props> = ({ organizationUuid, activities }) => {
  const showCreateActivity = useBoolean()

  const [deleteActivity, { loading }] = useDeleteOrganizationActivityMutation()

  const [activityIdToEdit, setActivityIdToEdit] = useState<null | string>(null)

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(activities)

  useEffect(() => {
    setTableData(activities)
  }, [activities])

  const table = useTable()

  const denseHeight = table.dense ? 56 : 56 + 20

  const defaultFilters = useMemo(
    () => ({
      name: '',
      category: '',
    }),
    [],
  )
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

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length

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
  }, [defaultFilters])

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
    <>
      <AddButton
        count={activities.length}
        label="Servicii"
        onClick={() => {
          setActivityIdToEdit(null)
          showCreateActivity.onTrue()
        }}
      />
      <Card>
        {showCreateActivity.value && (
          <UpdateActivity
            organizationUuid={organizationUuid}
            activity={activities.find(_ => _.uuid === activityIdToEdit)}
            onClose={showCreateActivity.onFalse}
          />
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

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </>
  )
}

const ActivityListView = () => {
  const result = useOrganizationActivitiesQuery()

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Servicii"
        links={[
          { name: 'Pagina Principală', href: getLandingPage() },
          { name: 'Servicii', href: paths.app.settings.activities },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ResponseHandler {...result}>
        {({ organization }) => {
          return (
            <ActivityList
              organizationUuid={organization.uuid}
              activities={organization.activities}
            />
          )
        }}
      </ResponseHandler>
    </Container>
  )
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: ActivityFragment[]
  comparator: (a: any, b: any) => number
  filters: ActivityTableFilters
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
      client => client.name.toLowerCase().indexOf(filters.name.toLowerCase()) !== -1,
    )
  }

  if (filters.category) {
    inputData = inputData.filter(activity => activity.category.code === filters.category)
  }

  return inputData
}

export default withUserPermission(UserPermissionsEnum.HAS_SETTINGS_ACCESS)(ActivityListView)
