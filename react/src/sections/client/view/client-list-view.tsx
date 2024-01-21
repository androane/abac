import isEqual from 'lodash/isEqual'
import { useCallback, useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { useSnackbar } from 'components/snackbar'
import { RouterLink } from 'routes/components'
import { paths } from 'routes/paths'

import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Iconify from 'components/iconify'
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
import { useUsersQuery } from 'generated/graphql'
import { useRouter } from 'routes/hooks'
import ClientTableFiltersResult from '../client-table-filters-result'
import ClientTableRow from '../client-table-row'
import ClientTableToolbar from '../client-table-toolbar'
import { ClientItem, ClientTableFilters } from '../types'

const defaultFilters = {
  name: '',
}

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: '', width: 88 },
]

type Props = {
  clients: ClientItem[]
}

const ClientListCard: React.FC<Props> = ({ clients }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(clients)

  const table = useTable()

  const denseHeight = table.dense ? 56 : 56 + 20

  const router = useRouter()

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
  }, [])

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter(row => row.id !== id)

      enqueueSnackbar('Delete success!')

      setTableData(deleteRow)

      table.onUpdatePageDeleteRow(dataInPage.length)
    },
    [dataInPage.length, enqueueSnackbar, table, tableData],
  )

  const handleEditRow = useCallback(
    (id: string) => {
      // router.push(paths.dashboard.client.edit(id))
      router.push('/')
    },
    [router],
  )

  return (
    <Card>
      <ClientTableToolbar filters={filters} onFilters={handleFilters} />

      {canReset && (
        <ClientTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          //
          onResetFilters={handleResetFilters}
          //
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
                  <ClientTableRow
                    key={row.id}
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
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
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  )
}

export default function ClientListView() {
  const settings = useSettingsContext()
  const result = useUsersQuery()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Lista Clienti"
        links={[
          { name: 'Dashboard', href: paths.dashboard.client.root },
          { name: 'Clienti', href: paths.dashboard.client.root },
          { name: 'Lista' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.client.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Client Nou
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ResponseHandler {...result}>
        {({ users }) => {
          const clients = users?.map(client => ({
            id: client.uuid,
            name: client.name,
          }))
          return <ClientListCard clients={clients} />
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
  inputData: ClientItem[]
  comparator: (a: any, b: any) => number
  filters: ClientTableFilters
}) {
  const { name } = filters

  const stabilizedThis = inputData.map((el, index) => [el, index] as const)

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  inputData = stabilizedThis.map(el => el[0])

  if (name) {
    inputData = inputData.filter(
      client => client.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    )
  }

  return inputData
}
