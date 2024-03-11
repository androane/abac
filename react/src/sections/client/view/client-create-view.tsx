import Container from '@mui/material/Container'

import { LANDING_PAGE, paths } from 'routes/paths'

import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import { useSettingsContext } from 'components/settings'

import { UpdateClient } from '../client-update'

const ClientCreateView = () => {
  const settings = useSettingsContext()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Adaugă un Client Nou"
        links={[
          {
            name: 'Pagina Principală',
            href: LANDING_PAGE,
          },
          {
            name: 'Clienti',
            href: paths.app.client.list,
          },
          { name: 'Client Nou' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UpdateClient />
    </Container>
  )
}

export default ClientCreateView
