import { useAuthContext } from 'auth/hooks/use-auth-context'
import { UserPermissionsEnum } from 'generated/graphql'
import { LANDING_PAGE } from 'routes/paths'
import { Navigate } from 'react-router-dom'

const withUserPermission =
  (requiredPermission: UserPermissionsEnum) => (Component: React.FC<any>) => (props: any) => {
    const { hasPermission } = useAuthContext()

    if (!hasPermission(requiredPermission)) {
      return <Navigate to={LANDING_PAGE} />
    }

    return <Component {...props} />
  }

export default withUserPermission
