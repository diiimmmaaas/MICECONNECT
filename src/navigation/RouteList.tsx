import React from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'
import PATH from './path'
import {
  adminRoutes,
  agentRoutes,
  directorAgentRoutes,
  directorPlatformRoutes,
  platformRoutes,
  superAdminRoutes,
} from './routes'
import { useAppSelector } from '../redux/types/types'
import PrivateRoute from '../pages/PrivateRoute/PrivateRoute'
import AuthPage from '../pages/AuthPage/AuthPage'
import BlockedPage from '../pages/BlockedPage/BlockedPage'
import RegisterConfirmation from '../pages/RegisterConfirmation/RegisterConfirmation'
import PasswordRecoveryConfirmation from '../pages/PasswordRecoveryConfirmation/PasswordRecoveryConfirmation'
import RegistrationPage from '../pages/RegistrationPage/RegistrationPage'
import PasswordRecoveryPage from '../pages/PasswordRecoveryPage/PasswordRecoveryPage'
import PasswordRecoveryCodePage from '../pages/PasswordRecoveryCodePage/PasswordRecoveryCodePage'
import PasswordRecoverResetPasswordPage from '../pages/PasswordRecoverResetPasswordPage/PasswordRecoverResetPasswordPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'

const RouteList = () => {
  let userRole = useAppSelector((state) => state.auth.userRole)

  return (
    <>
      {userRole === 'superAdmin' && (
        <Routes>
          {superAdminRoutes.map((route, index) => (
            <>
              <Route key={route.path} path={PATH.authPage} element={<AuthPage />} />
              <Route key={route.path} path={PATH.blockedPage} element={<BlockedPage />} />
              <Route
                key={route.path}
                path={PATH.registerConfirmation}
                element={<RegisterConfirmation />}
              />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryConfirmation}
                element={<PasswordRecoveryConfirmation />}
              />
              <Route key={route.path} path={PATH.registrationPage} element={<RegistrationPage />} />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryPage}
                element={<PasswordRecoveryPage />}
              />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryCodePage}
                element={<PasswordRecoveryCodePage />}
              />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryResetPasswordPage}
                element={<PasswordRecoverResetPasswordPage />}
              />
              <Route
                key={index}
                path={route.path}
                element={<PrivateRoute element={route.component} />}
              />
            </>
          ))}
          <Route path='*' element={<Navigate to={PATH.error404} />} />
        </Routes>
      )}
      {userRole === 'admin' && (
        <Routes>
          {adminRoutes.map((route, index) => (
            <>
              <Route path={PATH.authPage} element={<AuthPage />} />
              <Route path={PATH.blockedPage} element={<BlockedPage />} />
              <Route path={PATH.registerConfirmation} element={<RegisterConfirmation />} />
              <Route
                path={PATH.passwordRecoveryConfirmation}
                element={<PasswordRecoveryConfirmation />}
              />
              <Route path={PATH.registrationPage} element={<RegistrationPage />} />
              <Route path={PATH.passwordRecoveryPage} element={<PasswordRecoveryPage />} />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryCodePage}
                element={<PasswordRecoveryCodePage />}
              />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryResetPasswordPage}
                element={<PasswordRecoverResetPasswordPage />}
              />
              <Route
                key={index}
                path={route.path}
                element={<PrivateRoute element={route.component} />}
              />
            </>
          ))}
          <Route path='*' element={<Navigate to={PATH.error404} />} />
        </Routes>
      )}
      {userRole === 'directorAgent' && (
        <Routes>
          {directorAgentRoutes.map((route, index) => (
            <>
              <Route path={PATH.authPage} element={<AuthPage />} />
              <Route path={PATH.blockedPage} element={<BlockedPage />} />
              <Route path={PATH.registerConfirmation} element={<RegisterConfirmation />} />
              <Route
                path={PATH.passwordRecoveryConfirmation}
                element={<PasswordRecoveryConfirmation />}
              />
              <Route path={PATH.registrationPage} element={<RegistrationPage />} />
              <Route path={PATH.passwordRecoveryPage} element={<PasswordRecoveryPage />} />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryCodePage}
                element={<PasswordRecoveryCodePage />}
              />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryResetPasswordPage}
                element={<PasswordRecoverResetPasswordPage />}
              />
              <Route
                key={index}
                path={route.path}
                element={<PrivateRoute element={route.component} />}
              />
            </>
          ))}
          <Route path='*' element={<Navigate to={PATH.error404} />} />
        </Routes>
      )}
      {userRole === 'directorPlace' && (
        <Routes>
          {directorPlatformRoutes.map((route, index) => (
            <>
              <Route path={PATH.authPage} element={<AuthPage />} />
              <Route path={PATH.blockedPage} element={<BlockedPage />} />
              <Route path={PATH.registerConfirmation} element={<RegisterConfirmation />} />
              <Route
                path={PATH.passwordRecoveryConfirmation}
                element={<PasswordRecoveryConfirmation />}
              />
              <Route path={PATH.registrationPage} element={<RegistrationPage />} />
              <Route path={PATH.passwordRecoveryPage} element={<PasswordRecoveryPage />} />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryCodePage}
                element={<PasswordRecoveryCodePage />}
              />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryResetPasswordPage}
                element={<PasswordRecoverResetPasswordPage />}
              />
              <Route
                key={index}
                path={route.path}
                element={<PrivateRoute element={route.component} />}
              />
            </>
          ))}
          <Route path='*' element={<Navigate to={PATH.error404} />} />
        </Routes>
      )}
      {userRole === 'employeeAgent' && (
        <Routes>
          {agentRoutes.map((route, index) => (
            <>
              <Route path={PATH.authPage} element={<AuthPage />} />
              <Route path={PATH.blockedPage} element={<BlockedPage />} />
              <Route path={PATH.registerConfirmation} element={<RegisterConfirmation />} />
              <Route
                path={PATH.passwordRecoveryConfirmation}
                element={<PasswordRecoveryConfirmation />}
              />
              <Route path={PATH.registrationPage} element={<RegistrationPage />} />
              <Route path={PATH.passwordRecoveryPage} element={<PasswordRecoveryPage />} />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryCodePage}
                element={<PasswordRecoveryCodePage />}
              />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryResetPasswordPage}
                element={<PasswordRecoverResetPasswordPage />}
              />
              <Route
                key={index}
                path={route.path}
                element={<PrivateRoute element={route.component} />}
              />
            </>
          ))}
          <Route path='*' element={<Navigate to={PATH.error404} />} />
        </Routes>
      )}
      {userRole === 'employeePlace' && (
        <Routes>
          {platformRoutes.map((route, index) => (
            <>
              <Route path={PATH.authPage} element={<AuthPage />} />
              <Route path={PATH.blockedPage} element={<BlockedPage />} />
              <Route path={PATH.registerConfirmation} element={<RegisterConfirmation />} />
              <Route
                path={PATH.passwordRecoveryConfirmation}
                element={<PasswordRecoveryConfirmation />}
              />
              <Route path={PATH.registrationPage} element={<RegistrationPage />} />
              <Route path={PATH.passwordRecoveryPage} element={<PasswordRecoveryPage />} />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryCodePage}
                element={<PasswordRecoveryCodePage />}
              />
              <Route
                key={route.path}
                path={PATH.passwordRecoveryResetPasswordPage}
                element={<PasswordRecoverResetPasswordPage />}
              />
              <Route
                key={index}
                path={route.path}
                element={<PrivateRoute element={route.component} />}
              />
            </>
          ))}
          <Route path='*' element={<Navigate to={PATH.error404} />} />
        </Routes>
      )}
    </>
  )
}

export default RouteList
