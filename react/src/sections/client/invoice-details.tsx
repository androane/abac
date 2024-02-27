import isEqual from 'lodash/isEqual'
import React, { useCallback, useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { useSnackbar } from 'components/snackbar'
import { startOfMonth } from 'date-fns'
import { styled } from '@mui/material/styles'

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
  useClientInvoiceQuery,
  useDeleteClientInvoiceItemMutation,
  useOrganizationServicesQuery,
} from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import UpdateInvoiceItem from 'sections/client/invoice-item-update'
import { Box, TableCell, TableRow } from '@mui/material'
import InvoiceTableFiltersResult from './invoice-table-filters-result'
import InvoiceTableRow from './invoice-table-row'
import InvoiceTableToolbar from './invoice-table-toolbar'
import { APIClientInvoice, APIInvoiceItem, InvoiceTableFilters } from './types'

const defaultFilters = {
  name: '',
}

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: 'name', label: 'Nume' },
  { id: 'description', label: 'Explicatie' },
  { id: 'itemDate', label: 'Data' },
  { id: 'unitPriceType', label: 'Tip tarifare' },
  { id: 'minutesAllocated', label: 'Minute Alocate' },
  { id: 'unitPrice', label: 'Suma' },
  { id: 'quantity', label: 'Cantitate' },
  { id: 'totalPrice', label: 'Suma Totala' },
  { id: '', width: 88 },
]

const TotalsRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

type InvoiceDetailsCardProps = {
  clientInvoice: APIClientInvoice
  invoiceDate: null | Date
  onChangeInvoiceDate: (newDate: null | Date) => void
}

const InvoiceDetailsCard: React.FC<InvoiceDetailsCardProps> = ({
  clientInvoice,
  invoiceDate,
  onChangeInvoiceDate,
}) => {
  const showCreateInvoiceItem = useBoolean()

  const [deleteInvoiceItem, { loading }] = useDeleteClientInvoiceItemMutation()
  const servicesResult = useOrganizationServicesQuery()

  const [invoiceItemIdToEdit, setInvoiceItemIdToEdit] = useState<null | string>(null)

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(clientInvoice.items)

  useEffect(() => {
    setTableData(clientInvoice.items)
  }, [clientInvoice])

  const table = useTable({ defaultOrderBy: 'isRecurring', defaultOrder: 'desc' })

  const denseHeight = table.dense ? 56 : 56 + 20

  const [filters, setFilters] = useState(defaultFilters)

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  })

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

  const handleDeleteRow = async (uuid: string) => {
    await deleteInvoiceItem({
      variables: { invoiceItemUuid: uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'InvoiceItemType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Intrarea a fost ștearsă!')
  }

  const handleEditRow = useCallback(
    (id: null | string) => {
      setInvoiceItemIdToEdit(id)
      showCreateInvoiceItem.onTrue()
    },
    [showCreateInvoiceItem, setInvoiceItemIdToEdit],
  )

  const invoiceIsLocked = Boolean(clientInvoice.dateSent)

  return (
    <Card>
      {showCreateInvoiceItem.value && (
        <ResponseHandler {...servicesResult}>
          {({ organizationServices }) => {
            return (
              <UpdateInvoiceItem
                organizationServices={organizationServices}
                invoiceId={clientInvoice.uuid}
                invoiceDate={invoiceDate}
                invoiceItem={clientInvoice.items.find(item => item.uuid === invoiceItemIdToEdit)}
                onClose={showCreateInvoiceItem.onFalse}
              />
            )
          }}
        </ResponseHandler>
      )}
      <InvoiceTableToolbar
        onAddInvoiceItem={() => handleEditRow(null)}
        invoiceDate={invoiceDate}
        invoiceId={clientInvoice.uuid}
        invoiceDateSent={clientInvoice.dateSent}
        onChangeInvoiceDate={onChangeInvoiceDate}
      />

      {canReset && (
        <InvoiceTableFiltersResult
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
                .map((row, index) => (
                  <InvoiceTableRow
                    invoiceIsLocked={invoiceIsLocked}
                    key={row.uuid}
                    index={index + 1}
                    row={row}
                    loading={loading}
                    onDeleteRow={() => handleDeleteRow(row.uuid)}
                    onEditRow={() => handleEditRow(row.uuid)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
              <Box mt={5} />
              {clientInvoice.totalsByCurrency.map(({ currency, total }, index) => {
                return (
                  <TotalsRow key={currency}>
                    <TableCell colSpan={7} />
                    <TableCell sx={{ typography: 'subtitle1' }}>{index === 0 && 'Total'}</TableCell>
                    <TableCell width={140} sx={{ typography: 'subtitle1' }}>
                      {total.toFixed(2)} {currency}
                    </TableCell>
                  </TotalsRow>
                )
              })}
              <Box mb={5} />
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

const InvoiceDetailsView: React.FC<Props> = ({ clientId }) => {
  const [invoiceDate, setInvoiceDate] = useState<null | Date>(startOfMonth(new Date()))

  const result = useClientInvoiceQuery({
    variables: {
      clientUuid: clientId,
      month: invoiceDate ? invoiceDate.getMonth() + 1 : null,
      year: invoiceDate?.getFullYear(),
    },
  })

  return (
    <ResponseHandler {...result}>
      {({ clientInvoice }) => {
        return (
          <InvoiceDetailsCard
            clientInvoice={clientInvoice}
            invoiceDate={invoiceDate}
            onChangeInvoiceDate={setInvoiceDate}
          />
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
  inputData: APIInvoiceItem[]
  comparator: (a: any, b: any) => number
  filters: InvoiceTableFilters
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

  return inputData
}

export default InvoiceDetailsView
