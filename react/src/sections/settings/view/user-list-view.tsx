import { useCallback, useEffect, useState } from 'react'

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
  TablePaginationCustom,
  emptyRows,
  useTable,
} from 'components/table'

import ResponseHandler from 'components/response-handler'
import {
  useOrganizationUsersQuery,
  BaseUserFragment,
  useDeleteOrganizationSolutionMutation,
  UserPermissionsEnum,
} from 'generated/graphql'
import UpdateUserPermissions from 'sections/settings/user-permissions-update/user-permissions-update'
import { withUserPermission } from 'auth/hoc'
import UserTableRow from 'sections/settings/user-table-row'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: 'permissions', label: 'Permisiuni' },
  { id: '', width: 88 },
]

type Props = {
  users: BaseUserFragment[]
}

const UsersList: React.FC<Props> = ({ users }) => {
  const [deleteSolution, { loading }] = useDeleteOrganizationSolutionMutation()

  const [userUuidToEditPermissions, setUserUuidToEditPermissions] = useState<undefined | string>()

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(users)

  useEffect(() => {
    setTableData(users)
  }, [users])

  const table = useTable()

  const denseHeight = table.dense ? 56 : 56 + 20

  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  )

  const handleDeleteRow = async (uuid: string) => {
    await deleteSolution({
      variables: { uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'UserType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Utilizatorul a fost șters!')

    setUserUuidToEditPermissions(undefined)

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  const handleEditRow = useCallback(
    (uuid?: string) => {
      setUserUuidToEditPermissions(uuid)
    },
    [setUserUuidToEditPermissions],
  )

  return (
    <>
      {/* <AddButton
        count={users.length}
        label="Utilizatori"
        onClick={() => {
          setsolutionIdToEdit(null)
          showCreateSolution.onTrue()
        }}
      /> */}
      <Card>
        {userUuidToEditPermissions && (
          <UpdateUserPermissions
            userUuid={userUuidToEditPermissions}
            onClose={() => setUserUuidToEditPermissions(undefined)}
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
                      key={row.uuid}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.uuid)}
                      onEditRow={() => handleEditRow(row.uuid)}
                      onEditPermissions={() => setUserUuidToEditPermissions(row.uuid)}
                      loading={loading}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />
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

const UserListView = () => {
  const result = useOrganizationUsersQuery()

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Pachete"
        links={[
          { name: 'Pagina Principală', href: LANDING_PAGE },
          { name: 'Utilizatori', href: paths.app.settings.users },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ResponseHandler {...result}>
        {({ organization }) => {
          return <UsersList users={organization.users} />
        }}
      </ResponseHandler>
    </Container>
  )
}

export default withUserPermission(UserPermissionsEnum.HAS_ORGANIZATION_ADMIN)(UserListView)
