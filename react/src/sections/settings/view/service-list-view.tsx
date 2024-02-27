import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { useSnackbar } from 'components/snackbar'
import { LANDING_PAGE, paths } from 'routes/paths'

import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Scrollbar from 'components/scrollbar'
import { useSettingsContext } from 'components/settings'
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
import {
  useOrganizationServicesQuery,
  StandardInvoiceItemFragment,
  useDeleteOrganizationServiceMutation,
} from 'generated/graphql'
import { useAuthContext } from 'auth/hooks'
import { ServiceTableFilters } from 'sections/settings/types'
import ServiceTableFiltersResult from 'sections/settings/service-table-filters-result'
import ServiceTableRow from 'sections/settings/service-table-row'
import AddButton from 'components/add-button'
import { useBoolean } from 'hooks/use-boolean'
import UpdateService from 'sections/settings/service-update'
import { Navigate, useSearchParams } from 'react-router-dom'
import { CATEGORY_CODE_TO_LABEL } from 'sections/settings/constants'

const TABLE_HEAD = [
  { id: 'name', label: 'Nume' },
  { id: 'unitPrice', label: 'Cost' },
  { id: 'unitPriceCurrency', label: 'Moneda' },
  { id: 'unitPriceType', label: 'Tip tarif' },
  { id: '', width: 88 },
]

type Props = {
  categoryCode: string
  services: StandardInvoiceItemFragment[]
}

const ServiceList: React.FC<Props> = ({ services, categoryCode }) => {
  const showCreateService = useBoolean()
  const [deleteService, { loading }] = useDeleteOrganizationServiceMutation()
  const [serviceIdToEdit, setServiceIdToEdit] = useState<null | string>(null)

  const { user } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState(services)

  useEffect(() => {
    setTableData(services)
  }, [services])

  const table = useTable()

  const denseHeight = table.dense ? 56 : 56 + 20

  const defaultFilters = useMemo(
    () => ({
      name: '',
      programManagerId: user?.uuid,
    }),
    [user?.uuid],
  )
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
  }, [defaultFilters])

  const handleDeleteRow = async (uuid: string) => {
    await deleteService({
      variables: { uuid },
      update(cache) {
        const normalizedId = cache.identify({ uuid, __typename: 'StandardInvoiceItemType' })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })

    enqueueSnackbar('Serviciul a fost șters!')

    showCreateService.onFalse()

    table.onUpdatePageDeleteRow(dataInPage.length)
  }

  const handleEditRow = useCallback(
    (id: null | string) => {
      setServiceIdToEdit(id)
      showCreateService.onTrue()
    },
    [showCreateService, setServiceIdToEdit],
  )

  return (
    <>
      <AddButton
        count={services.length}
        label="Servicii"
        onClick={() => {
          setServiceIdToEdit(null)
          showCreateService.onTrue()
        }}
      />
      <Card>
        {showCreateService.value && (
          <UpdateService
            categoryCode={categoryCode}
            service={services.find(_ => _.uuid === serviceIdToEdit)}
            onClose={showCreateService.onFalse}
          />
        )}
        {canReset && (
          <ServiceTableFiltersResult
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
                  .map(row => (
                    <ServiceTableRow
                      key={row.uuid}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.uuid)}
                      onEditRow={() => handleEditRow(row.uuid)}
                      loading={loading}
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
    </>
  )
}

const ServiceListView = () => {
  const [searchParams] = useSearchParams()

  const settings = useSettingsContext()
  const categoryCode = searchParams.get('c')

  const result = useOrganizationServicesQuery()

  if (!categoryCode) {
    return <Navigate replace to={LANDING_PAGE} />
  }

  const label = CATEGORY_CODE_TO_LABEL[categoryCode as keyof typeof CATEGORY_CODE_TO_LABEL]

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Servicii ${label}`}
        links={[
          { name: 'Pagina Principală', href: LANDING_PAGE },
          { name: 'Servicii', href: paths.app.settings.service.list },
          { name: label },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ResponseHandler {...result}>
        {({ organizationServices }) => {
          return (
            <ServiceList
              services={organizationServices.filter(s => s.category?.code === categoryCode)}
              categoryCode={categoryCode}
            />
          )
        }}
      </ResponseHandler>
    </Container>
  )
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: StandardInvoiceItemFragment[]
  comparator: (a: any, b: any) => number
  filters: ServiceTableFilters
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
      client => client.name.toLowerCase().indexOf(filters.name.toLowerCase()) !== -1,
    )
  }

  return inputData
}

export default ServiceListView
