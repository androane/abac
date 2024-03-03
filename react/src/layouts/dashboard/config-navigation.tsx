import { paths } from 'routes/paths'

import SvgColor from 'components/svg-color'
import SettingsIcon from '@mui/icons-material/Settings'
import { getCategoryLabelFromCode } from 'sections/settings/constants'

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

export const CATEGORY_CODES = ['accounting', 'hr']

const useNavData = () => {
  const data = [
    {
      subheader: 'Gestiune',
      items: [
        {
          title: 'Clienți',
          path: paths.app.client.root,
          icon: icon('ic_user'),
          children: [
            { title: 'Listă', path: paths.app.client.list },
            { title: 'Adaugă', path: paths.app.client.new },
          ],
        },
        {
          title: 'Configurări',
          path: paths.app.settings.root,
          icon: <SettingsIcon />,
          children: [
            {
              title: 'Servicii',
              path: `${paths.app.settings.activity.list}?c=${CATEGORY_CODES[0]}`,
              children: CATEGORY_CODES.map(code => ({
                title: getCategoryLabelFromCode(code),
                path: `${paths.app.settings.activity.list}?c=${code}`,
              })),
            },
            {
              title: 'Pachete',
              path: `${paths.app.settings.solution.list}?c=${CATEGORY_CODES[0]}`,
              children: CATEGORY_CODES.map(code => ({
                title: getCategoryLabelFromCode(code),
                path: `${paths.app.settings.solution.list}?c=${code}`,
              })),
            },
          ],
        },
      ],
    },
  ]

  return data
}

export default useNavData
