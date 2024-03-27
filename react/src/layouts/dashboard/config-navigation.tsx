import { paths } from 'routes/paths'

import { useAuthContext } from 'auth/hooks'
import SvgColor from 'components/svg-color'
import SettingsIcon from '@mui/icons-material/Settings'
import { UserPermissionsEnum } from 'generated/graphql'

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const useNavData = () => {
  const { hasPermission, user } = useAuthContext()

  const data = [
    {
      subheader: user?.organization.name || '',
      items: [
        {
          title: 'Clienți',
          path: paths.app.client.root,
          icon: icon('ic_user'),
          children: [
            { title: 'Listă', path: paths.app.client.list },
            {
              title: 'Adaugă',
              requiredPermission: UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS,
              path: paths.app.client.new,
            },
            {
              title: 'Grupuri',
              path: paths.app.client.groups,
            },
          ],
        },
        {
          title: 'Configurări',
          requiredPermission: UserPermissionsEnum.HAS_SETTINGS_ACCESS,
          path: paths.app.settings.root,
          icon: <SettingsIcon />,
          children: [
            {
              title: 'Servicii',
              path: paths.app.settings.activities,
            },
            {
              title: 'Pachete',
              path: paths.app.settings.solutions,
            },
            {
              title: 'Utilizatori',
              path: paths.app.settings.users,
            },
          ],
        },
      ],
    },
  ]

  const filteredData = data
    .filter(
      section =>
        !('requiredPermission' in section) ||
        hasPermission(section.requiredPermission as UserPermissionsEnum) !== false,
    )
    .map(section => {
      return {
        ...section,
        items: section.items
          .filter(
            item =>
              !('requiredPermission' in item) ||
              hasPermission(item.requiredPermission as UserPermissionsEnum) !== false,
          )
          .map(item => {
            return {
              ...item,
              children: item.children
                ? item.children.filter(
                    child =>
                      !('requiredPermission' in child) ||
                      hasPermission(child.requiredPermission as UserPermissionsEnum) !== false,
                  )
                : undefined,
            }
          }),
      }
    })

  return filteredData
}

export default useNavData
