import Container from '@mui/material/Container'

import { paths } from 'routes/paths'

import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import { useSettingsContext } from 'components/settings'

import ClientNewEditForm from '../client-new-edit-form'

export default function ClientCreateView() {
  const settings = useSettingsContext()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Adauga un Client Nou"
        links={[
          {
            name: 'Panou Principal',
            href: paths.dashboard.client.root,
          },
          {
            name: 'Clienti',
            href: paths.dashboard.client.root,
          },
          { name: 'Client Nou' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClientNewEditForm />
    </Container>
  )
}
