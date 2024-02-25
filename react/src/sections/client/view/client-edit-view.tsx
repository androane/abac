import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Iconify from 'components/iconify'
import ResponseHandler from 'components/response-handler'
import { useSettingsContext } from 'components/settings'
import { useClientsQuery } from 'generated/graphql'
import { useCallback, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { LANDING_PAGE, paths } from 'routes/paths'
import FilesList from '../files-list'
import UsersList from '../users-list'
import UpdateClient from '../client-update'
import InvoiceDetails from '../invoice-details'

enum TABS_VALUES {
  GENERAL = 'g',
  INVOICING = 'i',
  FILES = 'f',
  USERS = 'u',
}

const TABS = [
  {
    value: TABS_VALUES.GENERAL,
    label: 'Informatii Generale',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: TABS_VALUES.INVOICING,
    label: 'Facturare',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: TABS_VALUES.FILES,
    label: 'Documente',
    icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  },
  {
    value: TABS_VALUES.USERS,
    label: 'Persoane de Contact',
    icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  },
]

const ClientEditView = () => {
  const params = useParams()

  const { id } = params

  const settings = useSettingsContext()

  const result = useClientsQuery()

  const [currentTab, setCurrentTab] = useState(TABS_VALUES.GENERAL)

  const handleChangeTab = useCallback((_: React.SyntheticEvent, newValue: TABS_VALUES) => {
    setCurrentTab(newValue)
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ResponseHandler {...result}>
        {({ clients }) => {
          const client = clients.find(_ => _.uuid === id)
          if (!client) {
            return <Navigate to={paths.page404} replace />
          }
          return (
            <>
              <CustomBreadcrumbs
                heading={client.name}
                links={[
                  {
                    name: 'Pagina Principala',
                    href: LANDING_PAGE,
                  },
                  {
                    name: 'Clienti',
                    href: paths.app.client.list,
                  },
                  {
                    name: 'Lista',
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
                {TABS.map(tab => (
                  <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
                ))}
              </Tabs>

              {currentTab === TABS_VALUES.GENERAL && <UpdateClient client={client} />}
              {currentTab === TABS_VALUES.INVOICING && <InvoiceDetails clientId={client.uuid} />}
              {currentTab === TABS_VALUES.FILES && <FilesList clientId={client.uuid} />}
              {currentTab === TABS_VALUES.USERS && <UsersList clientId={client.uuid} />}
            </>
          )
        }}
      </ResponseHandler>
    </Container>
  )
}

export default ClientEditView
