import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { useSnackbar } from 'components/snackbar'
import { LANDING_PAGE, paths } from 'routes/paths'

import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Scrollbar from 'components/scrollbar'
import { useSettingsContext } from 'components/settings'
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
  useOrganizationSolutionsQuery,
  SolutionFragment,
  useDeleteOrganizationSolutionMutation,
} from 'generated/graphql'
import { useAuthContext } from 'auth/hooks'
import { SolutionTableFilters } from 'sections/settings/types'
import SolutionTableFiltersResult from 'sections/settings/solution-table-filters-result'
import SolutionTableRow from 'sections/settings/solution-table-row'
import AddButton from 'components/add-button'
import { useBoolean } from 'hooks/use-boolean'
import UpdateSolution from 'sections/settings/solution-update'
import { Navigate, useSearchParams } from 'react-router-dom'
import { getSolutionCategoryLabel } from 'sections/settings/constants'
import { CATEGORY_CODES } from 'layouts/dashboard/config-navigation'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: '', width: 88 },
]

type Props = {
  organizationUuid: string
  categoryCode: string
  solutions: SolutionFragment[]
}

const SolutionList: React.FC<Props> = ({ organizationUuid, solutions, categoryCode }) => {
  const showCreateSolution = useBoolean()
  const [deleteSolution, { loading }] = useDeleteOrganizationSolutionMutation()
  const [solutionIdToEdit, setsolutionIdToEdit] = useState<null | string>(null)

  const { user } = useAuthContext()

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
      programManagerId: user?.uuid,
    }),
    [user?.uuid],
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

    enqueueSnackbar('Serviciul a fost șters!')

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
        label="Servicii"
        onClick={() => {
          setsolutionIdToEdit(null)
          showCreateSolution.onTrue()
        }}
      />
      <Card>
        {showCreateSolution.value && (
          <UpdateSolution
            organizationUuid={organizationUuid}
            categoryCode={categoryCode}
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

const SolutionListView = () => {
  const [searchParams] = useSearchParams()

  const settings = useSettingsContext()
  const categoryCode = searchParams.get('c')

  const result = useOrganizationSolutionsQuery()

  if (!categoryCode) {
    return <Navigate replace to={LANDING_PAGE} />
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Pachete ${getSolutionCategoryLabel(categoryCode)}`}
        links={[
          { name: 'Pagina Principală', href: LANDING_PAGE },
          { name: 'Pachete', href: `${paths.app.settings.solution.list}?c=${CATEGORY_CODES[0]}` },
          { name: getSolutionCategoryLabel(categoryCode) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ResponseHandler {...result}>
        {({ organization }) => {
          return (
            <SolutionList
              organizationUuid={organization.uuid}
              solutions={organization.solutions.filter(s => s.category?.code === categoryCode)}
              categoryCode={categoryCode}
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

  return inputData
}

export default SolutionListView
