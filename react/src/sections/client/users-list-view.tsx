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
  useTable,
} from 'components/table'

import ResponseHandler from 'components/response-handler'
import { useClientUsersQuery } from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import { ClientUser } from 'sections/client/types'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import Iconify from 'components/iconify'
import UserNewEditForm from 'sections/client/users-new-edit-form'
import UserTableRow from './user-table-row'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Rol' },
  { id: 'spvUsername', label: 'Utilizator SPV' },
  { id: 'spvPassword', label: 'Parola SPV' },
  { id: '', width: 88 },
]

type CardProps = {
  clientId: string
  users: ClientUser[]
}

const UserListCard: React.FC<CardProps> = ({ clientId, users }) => {
  const showCreateUser = useBoolean()
  const [userIdToEdit, setUserIdToEdit] = useState<null | string>(null)

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(users)

  const table = useTable()

  const denseHeight = table.dense ? 56 : 56 + 20

  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  )

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
      setUserIdToEdit(id)
      showCreateUser.onTrue()
    },
    [showCreateUser, setUserIdToEdit],
  )

  return (
    <Card>
      <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
        <Stack flexGrow={1}>
          <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
            <Typography variant="h6"> Fisiere </Typography>

            <IconButton
              size="small"
              color="primary"
              onClick={showCreateUser.onTrue}
              sx={{
                width: 24,
                height: 24,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          </Stack>

          <Box
            sx={{ typography: 'body2', color: 'text.disabled', mt: 0.5 }}
          >{`${users.length} fisere`}</Box>
        </Stack>
      </Stack>
      {showCreateUser.value && (
        <UserNewEditForm
          clientId={clientId}
          user={users.find(_ => _.id === userIdToEdit)}
          onClose={showCreateUser.onFalse}
        />
      )}
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
                .map(row => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />

              <TableNoData notFound={!tableData.length} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      <TablePaginationCustom
        count={tableData.length}
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

export default function UserListView({ clientId }: Props) {
  const result = useClientUsersQuery({
    variables: {
      clientUuid: clientId,
    },
  })

  return (
    <ResponseHandler {...result}>
      {({ clientUsers: apiClientUsers }) => {
        const users = apiClientUsers?.map(user => ({
          id: user.uuid,
          name: user.name,
          email: user.email,
          role: user.clientProfile.role,
          spvUsername: user.clientProfile.spvUsername,
          spvPassword: user.clientProfile.spvPassword,
        }))
        return <UserListCard clientId={clientId} users={users} />
      }}
    </ResponseHandler>
  )
}
