import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Iconify from 'components/iconify'
import ResponseHandler from 'components/response-handler'
import { useSettingsContext } from 'components/settings'
import { UserPermissionsEnum, useOrganizationClientsQuery } from 'generated/graphql'
import { useCallback, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { LANDING_PAGE, paths } from 'routes/paths'
import { primary } from 'theme/palette'
import { useAuthContext } from 'auth/hooks'
import FilesList from '../file-list'
import UsersList from '../user-list'
import ActivityList from '../activity-list'
import UpdateClient from '../client-update'
import InvoiceDetails from '../invoice-details'

enum TABS_VALUES {
  GENERAL = 'g',
  ACTIVITY = 'a',
  INVOICING = 'i',
  FILES = 'f',
  USERS = 'u',
}

const getIcon = (icon: string) => <Iconify icon={icon} width={24} color={primary.main} />

const TABS = [
  {
    value: TABS_VALUES.GENERAL,
    label: 'Informații Generale',
    icon: 'solar:user-id-outline',
  },
  {
    value: TABS_VALUES.ACTIVITY,
    label: 'Activitate',
    icon: 'solar:bill-list-outline',
  },
  {
    value: TABS_VALUES.INVOICING,
    label: 'Facturare',
    icon: 'solar:dollar-outline',
    requiredPermission: UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS,
  },
  {
    value: TABS_VALUES.FILES,
    label: 'Documente',
    icon: 'solar:gallery-wide-outline',
  },
  {
    value: TABS_VALUES.USERS,
    label: 'Persoane de Contact',
    icon: 'solar:users-group-rounded-outline',
  },
]

const ClientEditView = () => {
  const params = useParams()

  const { hasPermission } = useAuthContext()

  const { uuid } = params

  const settings = useSettingsContext()

  const result = useOrganizationClientsQuery()

  const tabs = TABS.filter(
    tab =>
      !('requiredPermission' in tab) ||
      hasPermission(tab.requiredPermission as UserPermissionsEnum),
  )

  const [currentTab, setCurrentTab] = useState(tabs[0].value)

  const handleChangeTab = useCallback((_: React.SyntheticEvent, newValue: TABS_VALUES) => {
    setCurrentTab(newValue)
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ResponseHandler {...result}>
        {({ organization }) => {
          const client = organization.clients.find(_ => _.uuid === uuid)
          if (!client) {
            return <Navigate to={paths.app.client.list} replace />
          }
          return (
            <>
              <CustomBreadcrumbs
                heading={client.name}
                links={[
                  {
                    name: 'Pagina Principală',
                    href: LANDING_PAGE,
                  },
                  {
                    name: 'Clienți',
                    href: paths.app.client.list,
                  },
                  {
                    name: 'Listă',
                    href: paths.app.client.list,
                  },
                  { name: client.name },
                ]}
                sx={{
                  mb: { xs: 3, md: 5 },
                }}
              />

              <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                sx={{
                  mb: { xs: 3, md: 5 },
                }}
              >
                {tabs.map(tab => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    icon={getIcon(tab.icon)}
                    value={tab.value}
                  />
                ))}
              </Tabs>

              {currentTab === TABS_VALUES.GENERAL && <UpdateClient clientUuid={client.uuid} />}
              {currentTab === TABS_VALUES.ACTIVITY && <ActivityList clientUuid={client.uuid} />}
              {currentTab === TABS_VALUES.INVOICING && <InvoiceDetails clientUuid={client.uuid} />}
              {currentTab === TABS_VALUES.FILES && <FilesList clientUuid={client.uuid} />}
              {currentTab === TABS_VALUES.USERS && <UsersList clientUuid={client.uuid} />}
            </>
          )
        }}
      </ResponseHandler>
    </Container>
  )
}

export default ClientEditView
