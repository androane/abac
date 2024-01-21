import { paths } from 'routes/paths'

import SvgColor from 'components/svg-color'

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const ICONS = {
  client: icon('ic_user'),
}

export function useNavData() {
  const data = [
    {
      subheader: 'Gestiune',
      items: [
        {
          title: 'Clienti',
          path: paths.dashboard.client.list,
          icon: ICONS.client,
          children: [
            { title: 'Lista', path: paths.dashboard.client.list },
            { title: 'Adauga', path: paths.dashboard.client.create },
          ],
        },
      ],
    },
  ]

  return data
}
