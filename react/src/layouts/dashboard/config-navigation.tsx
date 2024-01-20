import { paths } from 'routes/paths'

import SvgColor from 'components/svg-color'

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const ICONS = {
  user: icon('ic_user'),
}

export function useNavData() {
  const data = [
    {
      subheader: 'Management',
      items: [
        {
          title: 'Clienti',
          path: paths.clients.root,
          icon: ICONS.user,
        },
      ],
    },
  ]

  return data
}
