import { Navigate, RouteProps } from 'react-router-dom'
import { useAppSelector } from '../../redux/types/types'
import PATH from '../../navigation/path'
import { FC, ReactElement } from 'react'

// @ts-ignore
interface PrivateRouteProps extends RouteProps {
  element: any
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element, ...rest }) => {
  const { token } = useAppSelector((state) => state.auth)

  return token ? element : <Navigate to={PATH.authPage} />
}

export default PrivateRoute
