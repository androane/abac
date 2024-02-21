import { useCallback, useEffect, useState } from 'react'

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
import { useClientUsersQuery, useDeleteClientUserMutation } from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import UpdateUser from 'sections/client/users-update'
import AddButton from 'components/add-button'
import { APIClientUser } from 'sections/client/types'
import UserTableRow from './user-table-row'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: 'email', label: 'Email' },
  { id: 'phoneNumber', label: 'Telefon' },
  { id: 'role', label: 'Rol' },
  { id: 'spvUsername', label: 'Utilizator SPV' },
  { id: 'spvPassword', label: 'Parola SPV' },
  { id: '', width: 88 },
]

type CardProps = {
  clientId: string
  users: APIClientUser[]
}

const UserListCard: React.FC<CardProps> = ({ clientId, users }) => {
  const [deleteUser, { loading }] = useDeleteClientUserMutation()

  const showCreateUser = useBoolean()
  const [userIdToEdit, setUserIdToEdit] = useState<null | string>(null)

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(users)

  const table = useTable()

  useEffect(() => {
    setTableData(users)
  }, [users])

  const denseHeight = table.dense ? 56 : 56 + 20

  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  )

  const handleDeleteRow = async (uuid: string) => {
    await deleteUser({
      variables: { userUuid: uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'UserType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Persoana de Contact a fost stearsa cu success!')

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  const handleEditRow = useCallback(
    (id: null | string) => {
      setUserIdToEdit(id)
      showCreateUser.onTrue()
    },
    [showCreateUser, setUserIdToEdit],
  )

  return (
    <>
      <AddButton count={users.length} label="Persoane" onClick={showCreateUser.onTrue} />
      <Card>
        {showCreateUser.value && (
          <UpdateUser
            clientId={clientId}
            user={users.find(_ => _.uuid === userIdToEdit)}
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
                      loading={loading}
                      key={row.uuid}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.uuid)}
                      onEditRow={() => handleEditRow(row.uuid)}
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
    </>
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
      {({ clientUsers }) => {
        return <UserListCard clientId={clientId} users={clientUsers} />
      }}
    </ResponseHandler>
  )
}
