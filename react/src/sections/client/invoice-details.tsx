import React, { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { startOfMonth } from 'date-fns'
import { styled } from '@mui/material/styles'

import Scrollbar from 'components/scrollbar'
import { TableEmptyRows, TableHeadCustom, TableNoData, emptyRows, useTable } from 'components/table'

import ResponseHandler from 'components/response-handler'
import { useClientInvoiceQuery } from 'generated/graphql'
import { TableCell, TableRow } from '@mui/material'
import InvoiceTableRow from 'sections/client/invoice-table-row'
import InvoiceTableToolbar from './invoice-table-toolbar'
import { APIClientInvoice } from './types'

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: 'name', label: 'Nume' },
  { id: 'description', label: 'Explicatie' },
  { id: 'itemDate', label: 'Data' },
  { id: 'unitCostType', label: 'Tip Cost' },
  { id: 'unitCost', label: 'Suma' },
  { id: 'totalCost', label: 'Suma Totala' },
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
  const [tableData, setTableData] = useState(clientInvoice.items)

  useEffect(() => {
    setTableData(clientInvoice.items)
  }, [clientInvoice])

  const table = useTable()

  const denseHeight = table.dense ? 56 : 56 + 20

  const invoiceIsLocked = Boolean(clientInvoice.dateSent)

  return (
    <Card>
      <InvoiceTableToolbar
        invoiceDate={invoiceDate}
        invoiceId={clientInvoice.uuid}
        invoiceDateSent={clientInvoice.dateSent}
        onChangeInvoiceDate={onChangeInvoiceDate}
      />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {tableData
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
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />

              <TableNoData notFound={!tableData.length} />
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

export default InvoiceDetailsView
