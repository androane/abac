import React, { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { startOfMonth } from 'date-fns'
import { styled } from '@mui/material/styles'
import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import map from 'lodash/map'

import Scrollbar from 'components/scrollbar'
import { TableEmptyRows, TableHeadCustom, TableNoData, emptyRows, useTable } from 'components/table'

import ResponseHandler from 'components/response-handler'
import { ClientClientQuery, UserPermissionsEnum, useClientInvoiceQuery } from 'generated/graphql'
import { ListItemText, TableCell, TableRow } from '@mui/material'
import InvoiceTableRow from 'sections/client/invoice-table-row'
import { withUserPermission } from 'auth/hoc'
import InvoiceTableToolbar from '../invoice-table-toolbar'
import { APIClientInvoice } from '../types'

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: 'name', label: 'Nume' },
  { id: 'quantity', label: 'Cantiate' },
  { id: 'cost', label: 'Suma' },
]

const TotalsRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    borderBottom: 'none',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}))

type InvoiceDetailsCardProps = {
  invoice: APIClientInvoice
  date: Date
  onChangeDate: (newDate: Date) => void
}

const InvoiceDetailsCard: React.FC<InvoiceDetailsCardProps> = ({ invoice, date, onChangeDate }) => {
  const [tableData, setTableData] = useState(invoice.items)

  useEffect(() => {
    setTableData(invoice.items)
  }, [invoice])

  const table = useTable()

  const denseHeight = table.dense ? 56 : 56 + 20

  const grouped = groupBy(invoice.items, 'currency')
  const totalsByCurrency = map(grouped, (items, currency) => {
    return {
      currency,
      total: sumBy(items, 'cost'),
    }
  })

  return (
    <Card>
      <InvoiceTableToolbar
        invoiceDate={date}
        invoiceId={invoice.uuid}
        invoiceDateSent={invoice.dateSent}
        onChangeDate={onChangeDate}
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
                  <InvoiceTableRow key={index} index={index + 1} row={row} />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />

              <TableNoData notFound={!tableData.length} />
              {totalsByCurrency.map(({ currency, total }, index) => {
                return (
                  <TotalsRow key={currency}>
                    <TableCell colSpan={2} />
                    <TableCell sx={{ typography: 'subtitle1' }} align="right">
                      {index === 0 && 'Total'}
                    </TableCell>
                    <TableCell sx={{ typography: 'subtitle1' }} align="left">
                      <ListItemText>
                        {total.toFixed(2)} {currency}
                      </ListItemText>
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
  client: ClientClientQuery['client']
}

const ClientInvoiceView: React.FC<Props> = ({ client }) => {
  const [date, setDate] = useState(startOfMonth(new Date()))

  const result = useClientInvoiceQuery({
    variables: {
      clientUuid: client.uuid,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    },
    fetchPolicy: 'network-only',
  })

  return (
    <ResponseHandler {...result}>
      {({ client: { invoice } }) => {
        return <InvoiceDetailsCard invoice={invoice} date={date} onChangeDate={setDate} />
      }}
    </ResponseHandler>
  )
}

export default withUserPermission(UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS)(ClientInvoiceView)
