import Container from '@mui/material/Container'

import { LANDING_PAGE, paths } from 'routes/paths'

import CustomBreadcrumbs from 'components/custom-breadcrumbs'

import { withUserPermission } from 'auth/hoc'
import { UserPermissionsEnum } from 'generated/graphql'
import ClientUpdateView from './client-update-view'

const ClientCreateView = () => {
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Adaugă un Client Nou"
        links={[
          {
            name: 'Pagina Principală',
            href: LANDING_PAGE,
          },
          {
            name: 'Clienți',
            href: paths.app.client.list,
          },
          { name: 'Client Nou' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClientUpdateView />
    </Container>
  )
}

export default withUserPermission(UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS)(ClientCreateView)
