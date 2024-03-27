import { useCallback, useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { useSnackbar } from 'components/snackbar'
import { LANDING_PAGE } from 'routes/paths'

import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Scrollbar from 'components/scrollbar'
import { useSettingsContext } from 'components/settings'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  emptyRows,
  useTable,
} from 'components/table'

import ResponseHandler from 'components/response-handler'
import { useClientGroupsQuery, useDeleteClientGroupMutation } from 'generated/graphql'
import AddButton from 'components/add-button'
import { useBoolean } from 'hooks/use-boolean'
import UpdateGroup from 'sections/client/group-update'
import ClientGroupTableRow from '../client-group-table-row'
import { APIClientGroup } from '../types'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: 'clients', label: 'Clienți' },
  { id: '', width: 88 },
]

type Props = {
  organizationUuid: string
  groups: APIClientGroup[]
}

const ClientGroupListCard: React.FC<Props> = ({ organizationUuid, groups }) => {
  const showCreateGroup = useBoolean()

  const [groupUuidToEdit, setGroupUuidToEdit] = useState<undefined | string>()

  const [deleteClientGroup, { loading }] = useDeleteClientGroupMutation()

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(groups)

  const table = useTable()

  useEffect(() => {
    setTableData(groups)
  }, [groups])

  const denseHeight = table.dense ? 56 : 56 + 20

  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  )

  const handleDeleteRow = async (uuid: string) => {
    await deleteClientGroup({
      variables: { uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'ClientGroupType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Grupul a fost șters!')

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  const handleEditRow = useCallback(
    (uuid?: string) => {
      setGroupUuidToEdit(uuid)
      showCreateGroup.onTrue()
    },
    [showCreateGroup, setGroupUuidToEdit],
  )

  return (
    <>
      <AddButton
        count={groups.length}
        label="Grupuri"
        onClick={() => {
          showCreateGroup.onTrue()
          setGroupUuidToEdit(undefined)
        }}
      />
      {showCreateGroup.value && (
        <UpdateGroup
          organizationUuid={organizationUuid}
          group={groups.find(_ => _.uuid === groupUuidToEdit)}
          onClose={showCreateGroup.onFalse}
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
                    <ClientGroupTableRow
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
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </>
  )
}

const ClientGroupListView = () => {
  const settings = useSettingsContext()
  const result = useClientGroupsQuery()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Grupuri de Clienți"
        links={[{ name: 'Pagina Principală', href: LANDING_PAGE }, { name: 'Grupuri Clienți' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ResponseHandler {...result}>
        {({ organization }) => {
          return (
            <ClientGroupListCard
              organizationUuid={organization.uuid}
              groups={organization.clientGroups}
            />
          )
        }}
      </ResponseHandler>
    </Container>
  )
}

export default ClientGroupListView
