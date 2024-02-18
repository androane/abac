import { paths } from 'routes/paths'

import SvgColor from 'components/svg-color'
import SettingsIcon from '@mui/icons-material/Settings'

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

export function useNavData() {
  const data = [
    {
      subheader: 'Gestiune',
      items: [
        {
          title: 'Clienti',
          path: paths.app.client.root,
          icon: icon('ic_user'),
          children: [
            { title: 'Lista', path: paths.app.client.list },
            { title: 'Adauga', path: paths.app.client.new },
          ],
        },
        {
          title: 'Configurari',
          path: paths.app.settings.root,
          icon: <SettingsIcon />,
          children: [{ title: 'Servicii', path: paths.app.settings.service.list }],
        },
      ],
    },
  ]

  return data
}
