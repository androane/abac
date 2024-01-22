import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Iconify from 'components/iconify'
import ResponseHandler from 'components/response-handler'
import { useSettingsContext } from 'components/settings'
import { useCustomerOrganizationsQuery } from 'generated/graphql'
import { useCallback, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { paths } from 'routes/paths'
import ClientBilling from '../client-billing'
import ClientNewEditForm from '../client-new-edit-form'

type Props = {
  id: string
}

const TABS = [
  {
    value: 'general',
    label: 'Informatii Generale',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'billing',
    label: 'Facturare',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
]

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext()

  const result = useCustomerOrganizationsQuery()

  const [currentTab, setCurrentTab] = useState('general')

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ResponseHandler {...result}>
        {({ customerOrganizations }) => {
          const currentClient = customerOrganizations.find(client => client.uuid === id)
          if (!currentClient) {
            return <Navigate to={paths.page404} replace />
          }
          return (
            <>
              <CustomBreadcrumbs
                heading="Edit"
                links={[
                  {
                    name: 'Panou Principal',
                    href: paths.dashboard.client.list,
                  },
                  {
                    name: 'Clienti',
                    href: paths.dashboard.client.list,
                  },
                  { name: currentClient?.name },
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

              {currentTab === 'general' && <ClientNewEditForm currentClient={currentClient} />}
              {currentTab === 'billing' && <ClientBilling currentClient={currentClient} />}
            </>
          )
        }}
      </ResponseHandler>
    </Container>
  )
}
