import isEqual from 'lodash/isEqual'
import { useCallback, useState } from 'react'

import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { useSnackbar } from 'components/snackbar'

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
import { useCustomerOrganizationInvoiceQuery } from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import InvoiceNewEditForm from 'sections/client/invoice-item-new-edit-form'
import InvoiceTableFiltersResult from '../invoice-table-filters-result'
import InvoiceTableRow from '../invoice-table-row'
import InvoiceTableToolbar from '../invoice-table-toolbar'
import { InvoiceItem, InvoiceTableFilters } from '../types'

const defaultFilters = {
  description: '',
}

const TABLE_HEAD = [
  { id: 'description', label: 'Descriere' },
  { id: 'itemDate', label: 'Data' },
  { id: 'unitPrice', label: 'Suma' },
  { id: 'unitPriceCurrency', label: 'Moneda' },
  { id: '', width: 88 },
]

type InvoiceDetailsCardProps = {
  invoiceItems: InvoiceItem[]
  invoiceDate: null | Date
  onChangeInvoiceDate: (newDate: null | Date) => void
}

const InvoiceDetailsCard: React.FC<InvoiceDetailsCardProps> = ({
  invoiceItems,
  invoiceDate,
  onChangeInvoiceDate,
}) => {
  const showCreateInvoiceItem = useBoolean()
  const [invoiceItemIdToEdit, setInvoiceItemIdToEdit] = useState<null | String>(null)

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(invoiceItems)

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
    (id: string) => {
      showCreateInvoiceItem.onTrue()
      setInvoiceItemIdToEdit(id)
    },
    [showCreateInvoiceItem, setInvoiceItemIdToEdit],
  )

  if (showCreateInvoiceItem.value) {
    return (
      <InvoiceNewEditForm
        invoiceItem={invoiceItems.find(_ => _.id === invoiceItemIdToEdit)}
        onBack={showCreateInvoiceItem.onFalse}
      />
    )
  }

  return (
    <Card>
      <InvoiceTableToolbar
        filters={filters}
        onFilters={handleFilters}
        onAddInvoiceItem={showCreateInvoiceItem.onTrue}
        invoiceDate={invoiceDate}
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
  customerOrganizationUuid: string
}

export default function InvoiceDetailsView({ customerOrganizationUuid }: Props) {
  const [invoiceDate, setInvoiceDate] = useState<null | Date>(new Date())

  const result = useCustomerOrganizationInvoiceQuery({
    variables: {
      customerOrganizationUuid,
      month: invoiceDate ? invoiceDate.getMonth() + 1 : null,
      year: invoiceDate?.getFullYear(),
    },
  })

  return (
    <ResponseHandler {...result}>
      {({ customerOrganizationInvoice }) => {
        const invoiceItems = customerOrganizationInvoice.items?.map(invoice => ({
          id: invoice.uuid,
          description: invoice.description,
          itemDate: invoice?.itemDate,
          unitPrice: invoice?.unitPrice,
          unitPriceCurrency: invoice?.unitPriceCurrency,
          minutesAllocated: invoice?.minutesAllocated,
        }))
        return (
          <InvoiceDetailsCard
            invoiceItems={invoiceItems}
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
