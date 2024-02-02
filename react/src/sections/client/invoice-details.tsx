import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useState } from 'react'

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
  TableNoData,
  TablePaginationCustom,
  emptyRows,
  getComparator,
  useTable,
} from 'components/table'

import ResponseHandler from 'components/response-handler'
import { useClientInvoiceQuery } from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import InvoiceItemNewEditForm from 'sections/client/invoice-item-new-edit-form'
import InvoiceTableFiltersResult from './invoice-table-filters-result'
import InvoiceTableRow from './invoice-table-row'
import InvoiceTableToolbar from './invoice-table-toolbar'
import { APIClientInvoice, InvoiceItem, InvoiceTableFilters } from './types'

const defaultFilters = {
  description: '',
}

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: 'description', label: 'Descriere' },
  { id: 'itemDate', label: 'Data' },
  { id: 'unitPrice', label: 'Suma' },
  { id: 'minutesAllocated', label: 'Minute Alocate' },
  { id: '', width: 88 },
]

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
  const invoiceItems = clientInvoice.items?.map((invoice, index) => ({
    id: invoice.uuid,
    index: index + 1,
    description: invoice.description,
    itemDate: invoice?.itemDate,
    unitPrice: invoice?.unitPrice,
    unitPriceCurrency: invoice?.unitPriceCurrency,
    minutesAllocated: invoice?.minutesAllocated,
    isRecurring: invoice?.isRecurring,
  }))

  const showCreateInvoiceItem = useBoolean()
  const [invoiceItemIdToEdit, setInvoiceItemIdToEdit] = useState<null | string>(null)

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(invoiceItems)

  useEffect(() => {
    setTableData(invoiceItems)
  }, [invoiceItems])

  const table = useTable()

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

      enqueueSnackbar('Factura a fost stersa cu success!')

      setTableData(deleteRow)

      table.onUpdatePageDeleteRow(dataInPage.length)
    },
    [dataInPage.length, enqueueSnackbar, table, tableData],
  )

  const handleEditRow = useCallback(
    (id: null | string) => {
      setInvoiceItemIdToEdit(id)
      showCreateInvoiceItem.onTrue()
    },
    [showCreateInvoiceItem, setInvoiceItemIdToEdit],
  )

  return (
    <Card>
      {showCreateInvoiceItem.value && (
        <InvoiceItemNewEditForm
          invoiceId={clientInvoice.uuid}
          invoiceDate={invoiceDate}
          invoiceItem={invoiceItems.find(_ => _.id === invoiceItemIdToEdit)}
          onClose={showCreateInvoiceItem.onFalse}
        />
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
                  <InvoiceTableRow
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

type Props = {
  clientId: string
}

export default function InvoiceDetailsView({ clientId }: Props) {
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
  inputData: InvoiceItem[]
  comparator: (a: any, b: any) => number
  filters: InvoiceTableFilters
}) {
  const { description } = filters

  const stabilizedThis = inputData.map((el, index) => [el, index] as const)

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  inputData = stabilizedThis.map(el => el[0])

  if (description) {
    inputData = inputData.filter(
      invoice => invoice.description.toLowerCase().indexOf(description.toLowerCase()) !== -1,
    )
  }

  return inputData
}
