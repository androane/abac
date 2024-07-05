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
  emptyRows,
  getComparator,
  useTable,
} from 'components/table'

import ResponseHandler from 'components/response-handler'
import {
  useOrganizationSolutionsQuery,
  SolutionFragment,
  useDeleteOrganizationSolutionMutation,
  UserPermissionsEnum,
} from 'generated/graphql'
import { SolutionTableFilters } from 'sections/settings/types'
import SolutionTableFiltersResult from 'sections/settings/solution-table-filters-result'
import SolutionTableRow from 'sections/settings/solution-table-row'
import AddButton from 'components/add-button'
import { useBoolean } from 'hooks/use-boolean'
import UpdateSolution from 'sections/settings/solution-update'
import { withUserPermission } from 'auth/hoc'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: 'category', label: 'Domeniu' },
  { id: '', width: 88 },
]

type Props = {
  organizationUuid: string
  solutions: SolutionFragment[]
}

const SolutionList: React.FC<Props> = ({ organizationUuid, solutions }) => {
  const showCreateSolution = useBoolean()
  const [deleteSolution, { loading }] = useDeleteOrganizationSolutionMutation()
  const [solutionIdToEdit, setsolutionIdToEdit] = useState<null | string>(null)

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(solutions)

  useEffect(() => {
    setTableData(solutions)
  }, [solutions])

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
    await deleteSolution({
      variables: { uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'SolutionType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Pachetul a fost șters!')

    showCreateSolution.onFalse()

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  const handleEditRow = useCallback(
    (id: null | string) => {
      setsolutionIdToEdit(id)
      showCreateSolution.onTrue()
    },
    [showCreateSolution, setsolutionIdToEdit],
  )

  return (
    <>
      <AddButton
        count={solutions.length}
        label="Pachete"
        onClick={() => {
          setsolutionIdToEdit(null)
          showCreateSolution.onTrue()
        }}
      />
      <Card>
        {showCreateSolution.value && (
          <UpdateSolution
            organizationUuid={organizationUuid}
            solution={solutions.find(_ => _.uuid === solutionIdToEdit)}
            onClose={showCreateSolution.onFalse}
          />
        )}
        {canReset && (
          <SolutionTableFiltersResult
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
                    <SolutionTableRow
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
      </Card>
    </>
  )
}

const SolutionListView = () => {
  const result = useOrganizationSolutionsQuery()

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Pachete"
        links={[
          { name: 'Pagina Principală', href: getLandingPage() },
          { name: 'Pachete', href: paths.app.settings.solutions },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ResponseHandler {...result}>
        {({ organization }) => {
          return (
            <SolutionList organizationUuid={organization.uuid} solutions={organization.solutions} />
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
  inputData: SolutionFragment[]
  comparator: (a: any, b: any) => number
  filters: SolutionTableFilters
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

export default withUserPermission(UserPermissionsEnum.HAS_SETTINGS_ACCESS)(SolutionListView)
