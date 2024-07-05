import { useAuthContext } from 'auth/hooks'
import { UserPermissionsEnum } from 'generated/graphql'
import { getLandingPage } from 'routes/paths'
import { Navigate } from 'react-router-dom'

const withUserPermission =
  (requiredPermission: UserPermissionsEnum) => (Component: React.FC<any>) => (props: any) => {
    const { hasPermission } = useAuthContext()

    if (!hasPermission(requiredPermission)) {
      return <Navigate to={getLandingPage()} />
    }

    return <Component {...props} />
  }

export default withUserPermission
