import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Iconify from 'components/iconify'
import ResponseHandler from 'components/response-handler'
import { UserPermissionsEnum, useClientClientQuery } from 'generated/graphql'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getLandingPage, paths } from 'routes/paths'
import { primary } from 'theme/palette'
import { useAuthContext } from 'auth/hooks'
import ClientUpdateView from 'sections/client/view/client-update-view'
import ClientActivityView from 'sections/client/view/client-activity-view'
import ClientInvoiceView from 'sections/client/view/client-invoice-view'
import ClientFilesView from 'sections/client/view/client-files-view'
import ClientUsersView from 'sections/client/view/client-users-view'
import { TABS_VALUES } from 'sections/client/constants'

const getIcon = (icon: string) => <Iconify icon={icon} width={24} color={primary.main} />

const getTabs = (clientUuid: string) => {
  const getTabPath = (tab: string) => `/client/${clientUuid}/${tab}`

  const tabs = [
    {
      value: TABS_VALUES.GENERAL,
      path: getTabPath(TABS_VALUES.GENERAL),
      component: ClientUpdateView,
      name: 'Informații Generale',
      icon: 'solar:user-id-outline',
    },
    {
      value: TABS_VALUES.ACTIVITY,
      path: getTabPath(TABS_VALUES.ACTIVITY),
      component: ClientActivityView,
      name: 'Activitate',
      icon: 'solar:bill-list-outline',
    },
    {
      value: TABS_VALUES.INVOICE,
      path: getTabPath(TABS_VALUES.INVOICE),
      component: ClientInvoiceView,
      name: 'Facturare',
      icon: 'solar:dollar-outline',
      requiredPermission: UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS,
    },
    {
      value: TABS_VALUES.FILES,
      path: getTabPath(TABS_VALUES.FILES),
      component: ClientFilesView,
      name: 'Documente',
      icon: 'solar:gallery-wide-outline',
    },
    {
      value: TABS_VALUES.USERS,
      path: getTabPath(TABS_VALUES.USERS),
      component: ClientUsersView,
      name: 'Persoane de Contact',
      icon: 'solar:users-group-rounded-outline',
    },
  ]
  return tabs
}

const ClientNavigation = () => {
  const params = useParams()
  const uuid = params.uuid!

  const { hasPermission } = useAuthContext()

  const result = useClientClientQuery({
    variables: {
      uuid,
    },
  })

  const tabs = getTabs(uuid).filter(
    tab =>
      !('requiredPermission' in tab) ||
      hasPermission(tab.requiredPermission as UserPermissionsEnum),
  )

  if (!tabs.find(tab => tab.value === params.tab)) {
    return <Navigate to={paths.app.client.list} replace />
  }

  const Component = tabs.find(tab => tab.value === params.tab)?.component!

  return (
    <Container maxWidth="lg">
      <ResponseHandler {...result}>
        {({ client }) => {
          return (
            <>
              <CustomBreadcrumbs
                heading={client.name}
                links={[
                  {
                    name: 'Pagina Principală',
                    href: getLandingPage(),
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
                value={params.tab}
                sx={{
                  mb: { xs: 3, md: 5 },
                }}
              >
                {tabs.map(tab => (
                  <Tab
                    key={tab.name}
                    label={tab.name}
                    value={tab.value}
                    component={Link}
                    to={tab.path}
                    icon={getIcon(tab.icon)}
                  />
                ))}
              </Tabs>
              <Component client={client} />
            </>
          )
        }}
      </ResponseHandler>
    </Container>
  )
}

export default ClientNavigation
