import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import Iconify from 'components/iconify'
import ResponseHandler from 'components/response-handler'
import { useClientClientQuery } from 'generated/graphql'
import { Link, Navigate, useParams } from 'react-router-dom'
import { paths } from 'routes/paths'
import { primary } from 'theme/palette'
import ClientFilesView from 'sections-client/view/client-files-view'
import { TABS_VALUES } from 'sections-client/constants'

const getIcon = (icon: string) => <Iconify icon={icon} width={24} color={primary.main} />

const getTabs = (clientUuid: string) => {
  return [
    {
      value: TABS_VALUES.FILES,
      path: paths.clientApp.detail(clientUuid, TABS_VALUES.FILES),
      component: ClientFilesView,
      name: 'Documente',
      icon: 'solar:gallery-wide-outline',
    },
  ]
}

const ClientNavigation = () => {
  const params = useParams()
  const uuid = params.uuid!

  const result = useClientClientQuery({
    variables: {
      uuid,
    },
  })

  const tabs = getTabs(uuid)

  if (!tabs.find(tab => tab.value === params.tab)) {
    return <Navigate to={paths.clientApp.root} replace />
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
                    name: 'Firme',
                    href: paths.clientApp.root,
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
