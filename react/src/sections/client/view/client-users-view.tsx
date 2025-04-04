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
import {
  UserPermissionsEnum,
  useClientUsersQuery,
  useDeleteClientUserMutation,
} from 'generated/graphql'
import { useBoolean } from 'hooks/use-boolean'
import UpdateUser from 'sections/client/user-update'
import AddButton from 'components/add-button'
import { APIClient, APIClientUser } from 'sections/client/types'
import { useAuthContext } from 'auth/hooks'
import UserTableRow from '../user-table-row'

type CardProps = {
  clientUuid: string
  users: APIClientUser[]
  clientIsInGroup: boolean
}

const UserListCard: React.FC<CardProps> = ({ clientUuid, users, clientIsInGroup }) => {
  const [deleteUser, { loading }] = useDeleteClientUserMutation()

  const { hasPermission } = useAuthContext()

  let TABLE_HEAD = [
    { id: 'name', label: 'Nume' },
    { id: 'email', label: 'Email' },
    { id: 'phoneNumber', label: 'Telefon' },
    { id: 'role', label: 'Rol' },
    { id: 'showInGroup', label: 'Este persoana de contact pentru grup?' },
    { id: '', width: 88 },
  ]

  if (!clientIsInGroup) {
    TABLE_HEAD = TABLE_HEAD.filter(_ => _.id !== 'showInGroup')
  }

  const canSeeInformation = hasPermission(UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS)

  if (!canSeeInformation) {
    TABLE_HEAD = TABLE_HEAD.filter(_ => _.id !== 'role')
  }
  const showCreateUser = useBoolean()
  const [userUuidToEdit, setUserUuidToEdit] = useState<undefined | string>()

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

    enqueueSnackbar('Persoana de Contact a fost ștearsă!')

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  const handleEditRow = useCallback(
    (uuid?: string) => {
      setUserUuidToEdit(uuid)
      showCreateUser.onTrue()
    },
    [showCreateUser, setUserUuidToEdit],
  )

  return (
    <>
      <AddButton
        count={users.length}
        label="Persoane"
        onClick={() => {
          showCreateUser.onTrue()
          setUserUuidToEdit(undefined)
        }}
      />
      {showCreateUser.value && (
        <UpdateUser
          clientIsInGroup={clientIsInGroup}
          clientUuid={clientUuid}
          user={users.find(_ => _.uuid === userUuidToEdit)}
          onClose={showCreateUser.onFalse}
          canSeeInformation={canSeeInformation}
        />
      )}
      <Card>
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
                      clientIsInGroup={clientIsInGroup}
                      loading={loading}
                      key={row.uuid}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.uuid)}
                      onEditRow={() => handleEditRow(row.uuid)}
                      canSeeInformation={canSeeInformation}
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
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </>
  )
}

type Props = {
  client: APIClient
}

const ClientUsersView: React.FC<Props> = ({ client }) => {
  const result = useClientUsersQuery({
    variables: {
      clientUuid: client.uuid,
    },
    fetchPolicy: 'network-only',
  })

  return (
    <ResponseHandler {...result}>
      {({ client: { users, group } }) => {
        return (
          <UserListCard clientUuid={client.uuid} clientIsInGroup={Boolean(group)} users={users} />
        )
      }}
    </ResponseHandler>
  )
}

export default ClientUsersView
