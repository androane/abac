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
  useOrganizationUsersQuery,
  useOrganizationClientsQuery,
  useDeleteClientMutation,
} from 'generated/graphql'
import { APP_STORAGE_KEYS } from 'components/local-storage'
import { useLocalStorageContext } from 'components/local-storage'
import ClientTableFiltersResult from '../client-table-filters-result'
import ClientTableRow from '../client-table-row'
import ClientTableToolbar from '../client-table-toolbar'
import { APIOrganizationClient, ClientTableFilters } from '../types'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: 'programManagerName', label: 'Responsabil' },
  { id: '', width: 88 },
]

type Props = {
  clients: APIOrganizationClient[]
}

const ClientListCard: React.FC<Props> = ({ clients }) => {
  const localStorage = useLocalStorageContext()

  const [deleteClient, { loading }] = useDeleteClientMutation()
  const result = useOrganizationUsersQuery()

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(clients)

  const table = useTable()

  useEffect(() => {
    setTableData(clients)
  }, [clients])

  const denseHeight = table.dense ? 56 : 56 + 20

  const defaultFilters = useMemo(
    () => ({
      name: '',
      programManagerId: '',
    }),
    [],
  )
  const [filters, setFilters] = useState({
    ...defaultFilters,
    programManagerId: localStorage.pmUuid,
  })

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
    localStorage.onResetKey(APP_STORAGE_KEYS.PROGRAM_MANAGER)
  }, [defaultFilters, localStorage])

  const handleDeleteRow = async (uuid: string) => {
    await deleteClient({
      variables: { uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'ClientType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Clientul a fost șters!')

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  return (
    <Card>
      <ResponseHandler {...result}>
        {({ organization }) => {
          return (
            <ClientTableToolbar
              filters={filters}
              users={organization.users}
              onFilters={handleFilters}
            />
          )
        }}
      </ResponseHandler>

      {canReset && (
        <ClientTableFiltersResult
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
                  <ClientTableRow
                    loading={loading}
                    key={row.uuid}
                    client={row}
                    onDeleteRow={() => handleDeleteRow(row.uuid)}
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
  )
}

const ClientListView = () => {
  const result = useOrganizationClientsQuery()

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Listă Clienți"
        links={[
          { name: 'Pagina Principală', href: LANDING_PAGE },
          { name: 'Clienți', href: paths.app.client.list },
          { name: 'Listă' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ResponseHandler {...result}>
        {({ organization }) => {
          return <ClientListCard clients={organization.clients} />
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
  inputData: APIOrganizationClient[]
  comparator: (a: any, b: any) => number
  filters: ClientTableFilters
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

  if (filters.programManagerId) {
    inputData = inputData.filter(client => filters.programManagerId === client.programManager?.uuid)
  }

  return inputData
}

export default ClientListView
