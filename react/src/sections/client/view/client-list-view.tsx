import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { useSnackbar } from 'components/snackbar'
import { RouterLink } from 'routes/components'
import { LANDING_PAGE, paths } from 'routes/paths'

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
import {
  useClientProgramManagersQuery,
  useClientsQuery,
  useDeleteClientMutation,
} from 'generated/graphql'
import { useRouter } from 'routes/hooks'
import { useAuthContext } from 'auth/hooks'
import ClientTableFiltersResult from '../client-table-filters-result'
import ClientTableRow from '../client-table-row'
import ClientTableToolbar from '../client-table-toolbar'
import { APIClient, ClientTableFilters } from '../types'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: 'programManagerName', label: 'Responsabil' },
  { id: 'phoneNumber1', label: 'Telefon 1' },
  { id: 'phoneNumber2', label: 'Telefon 2' },
  { id: '', width: 88 },
]

type Props = {
  clients: APIClient[]
}

const ClientListCard: React.FC<Props> = ({ clients }) => {
  const [deleteClient, { loading }] = useDeleteClientMutation()
  const { user } = useAuthContext()
  const result = useClientProgramManagersQuery()

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(clients)

  const table = useTable()

  useEffect(() => {
    setTableData(clients)
  }, [clients])

  const denseHeight = table.dense ? 56 : 56 + 20

  const router = useRouter()

  const defaultFilters = useMemo(
    () => ({
      name: '',
      programManagerId: '',
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
    await deleteClient({
      variables: { clientUuid: uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'ClientType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Clientul a fost șters!')

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  const handleEditRow = useCallback(
    (uuid: string) => {
      router.push(paths.app.client.edit(uuid))
    },
    [router],
  )

  return (
    <Card>
      <ResponseHandler {...result}>
        {({ clientProgramManagers }) => {
          return (
            <ClientTableToolbar
              filters={filters}
              programManagers={clientProgramManagers.map(programManager => ({
                id: programManager.uuid,
                label: programManager.name,
              }))}
              onFilters={handleFilters}
            />
          )
        }}
      </ResponseHandler>

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
                    loading={loading}
                    key={row.uuid}
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row.uuid)}
                    onEditRow={() => handleEditRow(row.uuid)}
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

const ClientListView = () => {
  const settings = useSettingsContext()
  const result = useClientsQuery()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Lista Clienti"
        links={[
          { name: 'Pagina Principală', href: LANDING_PAGE },
          { name: 'Clienti', href: paths.app.client.list },
          { name: 'Listă' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.app.client.new}
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
        {({ clients }) => {
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
  inputData: APIClient[]
  comparator: (a: any, b: any) => number
  filters: ClientTableFilters
}) {
  const { name, programManagerId } = filters

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

  if (programManagerId) {
    inputData = inputData.filter(client => programManagerId === client.programManager?.uuid)
  }

  return inputData
}

export default ClientListView
