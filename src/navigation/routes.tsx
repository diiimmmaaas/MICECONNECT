import MainPage from '../pages/MainPage/MainPage'
import PATH from './path'
import PlatformManagementPage from '../pages/PlatformManagementPage/PlatformManagementPage'
import { ReactNode } from 'react'
import PlatformCardPage from '../pages/PlatformCardPage/PlatformCardPage'
import ReservationPlatformPage from '../pages/ReservationPlatformPage/ReservationPlatformPage'
import EditPlatformCardPage from '../pages/EditPlatformCardPage/EditPlatformCardPage'
import AdministratorsManagementPage from '../pages/AdministratorsManagementPage/AdministratorsManagementPage'
import AdminCardPage from '../pages/AdminCardPage/AdminCardPage'
import CompanyManagementPage from '../pages/CompanyManagementPage/CompanyManagementPage'
import CompanyCardPage from '../pages/CompanyCardPage/CompanyCardPage'
import EditCompanyCardPage from '../pages/EditCompanyCardPage/EditCompanyCardPage'
import CompanyManagementStaffPage from '../pages/CompanyManagementStaffPage/CompanyManagementStaffPage'
import CompanyStaffCardPage from '../pages/CompanyStaffCardPage/CompanyStaffCardPage'
import EditStaffCardPage from '../pages/EditStaffCardPage/EditStaffCardPage'
import CompanyManagementPlatformsPage from '../pages/CompanyManagementPlatformsPage/CompanyManagementPlatformsPage'
import ClaimManagementPage from '../pages/ClaimManagementPage/ClaimManagementPage'
import ClaimCardPage from '../pages/ClaimCardPage/ClaimCardPage'
import EditClaimCardPage from '../pages/EditClaimCardPage/EditClaimCardPage'
import Error404 from './Error/Error404'
import ClaimManagementCurrentPlatformPage from '../pages/ClaimManagementCurrentPlatformPage/ClaimManagementCurrentPlatformPage'
import RequestForRegistrationPage from '../pages/RequestForRegistrationPage/RequestForRegistrationPage'
import RequestForRegistrationCardPage from '../pages/RequestForRegistrationCardPage/RequestForRegistrationCardPage'
import PasswordRecoveryCodePage from '../pages/PasswordRecoveryCodePage/PasswordRecoveryCodePage'
import PasswordRecoverResetPasswordPage from '../pages/PasswordRecoverResetPasswordPage/PasswordRecoverResetPasswordPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import CompanyPage from '../pages/CompanyPage/CompanyPage'
import EditCompanyPage from '../pages/EditCompanyPage/EditCompanyPage'
import CreatePlatformPage from '../pages/CreatePlatformPage/CreatePlatfromPage'
import CompanyManagementStaffPageAdmin from '../pages/CompanyManagementStaffPageAdmin/CompanyManagementStaffPageAdmin'
import CompanyStaffCardPageAdmin from '../pages/CompanyStaffCardPageAdmin/CompanyStaffCardPageAdmin'

type RouteType = {
  path: string
  component: ReactNode
}

export const superAdminRoutes: RouteType[] = [
  { path: '/', component: <MainPage /> },
  { path: PATH.siteManagementPage, component: <PlatformManagementPage /> },
  { path: `${PATH.platformCardPage}:platformId`, component: <PlatformCardPage /> },
  { path: PATH.reservationPlatformPage, component: <ReservationPlatformPage /> },
  { path: `${PATH.editPlatformCardPage}:platformId`, component: <EditPlatformCardPage /> },
  { path: PATH.administratorsManagementPage, component: <AdministratorsManagementPage /> },
  { path: `${PATH.adminCardPage}:adminId`, component: <AdminCardPage /> },
  { path: PATH.companyManagementPage, component: <CompanyManagementPage /> },
  { path: `${PATH.companyCardPage}:companyId`, component: <CompanyCardPage /> },
  { path: `${PATH.editCompanyCardPage}:companyId`, component: <EditCompanyCardPage /> },
  {
    path: `${PATH.companyManagementStaffPage}:companyId`,
    component: <CompanyManagementStaffPage />,
  },
  { path: `${PATH.companyStaffCardPage}:companyId/:workerId`, component: <CompanyStaffCardPage /> },
  { path: `${PATH.editStaffCardPage}:companyId/:workerId`, component: <EditStaffCardPage /> },
  {
    path: `${PATH.companyManagementPlatformsPage}:companyId`,
    component: <CompanyManagementPlatformsPage />,
  },
  { path: PATH.claimManagementPage, component: <ClaimManagementPage /> },
  {
    path: `${PATH.claimManagementCurrentPlatformPage}:platformId`,
    component: <ClaimManagementCurrentPlatformPage />,
  },
  { path: `${PATH.claimCardPage}:claimId`, component: <ClaimCardPage /> },
  { path: `${PATH.editClaimCardPage}:claimId`, component: <EditClaimCardPage /> },
  { path: PATH.requestForRegistration, component: <RequestForRegistrationPage /> },
  {
    path: `${PATH.requestForRegistrationCardPage}:requestId`,
    component: <RequestForRegistrationCardPage />,
  },
  { path: PATH.passwordRecoveryCodePage, component: <PasswordRecoveryCodePage /> },
  { path: PATH.passwordRecoveryResetPasswordPage, component: <PasswordRecoverResetPasswordPage /> },
  { path: PATH.profilePage, component: <ProfilePage /> },
  { path: `${PATH.companyPage}:companyId`, component: <CompanyPage /> },
  { path: `${PATH.editCompanyPage}:companyId`, component: <EditCompanyPage /> },
  { path: PATH.createPlatformPage, component: <CreatePlatformPage /> },
  {
    path: `${PATH.companyManagementStaffPageAdmin}:companyId`,
    component: <CompanyManagementStaffPageAdmin />,
  },
  {
    path: `${PATH.companyStaffCardPageAdmin}:companyId/:workerId`,
    component: <CompanyStaffCardPageAdmin />,
  },
  { path: PATH.error404, component: <Error404 /> },
]

export const adminRoutes: RouteType[] = [
  { path: '/', component: <MainPage /> },
  { path: PATH.siteManagementPage, component: <PlatformManagementPage /> },
  { path: `${PATH.platformCardPage}:platformId`, component: <PlatformCardPage /> },
  { path: PATH.reservationPlatformPage, component: <ReservationPlatformPage /> },
  { path: `${PATH.editPlatformCardPage}:platformId`, component: <EditPlatformCardPage /> },
  { path: PATH.companyManagementPage, component: <CompanyManagementPage /> },
  { path: `${PATH.companyCardPage}:companyId`, component: <CompanyCardPage /> },
  { path: `${PATH.editCompanyCardPage}:companyId`, component: <EditCompanyCardPage /> },
  {
    path: `${PATH.companyManagementStaffPage}:companyId`,
    component: <CompanyManagementStaffPage />,
  },
  { path: `${PATH.companyStaffCardPage}:companyId/:workerId`, component: <CompanyStaffCardPage /> },
  { path: `${PATH.editStaffCardPage}:companyId/:workerId`, component: <EditStaffCardPage /> },
  {
    path: `${PATH.companyManagementPlatformsPage}:companyId`,
    component: <CompanyManagementPlatformsPage />,
  },
  { path: PATH.claimManagementPage, component: <ClaimManagementPage /> },
  {
    path: `${PATH.claimManagementCurrentPlatformPage}:platformId`,
    component: <ClaimManagementCurrentPlatformPage />,
  },
  { path: `${PATH.claimCardPage}:claimId`, component: <ClaimCardPage /> },
  { path: `${PATH.editClaimCardPage}:claimId`, component: <EditClaimCardPage /> },
  { path: PATH.requestForRegistration, component: <RequestForRegistrationPage /> },
  {
    path: `${PATH.requestForRegistrationCardPage}:requestId`,
    component: <RequestForRegistrationCardPage />,
  },
  { path: PATH.passwordRecoveryCodePage, component: <PasswordRecoveryCodePage /> },
  { path: PATH.passwordRecoveryResetPasswordPage, component: <PasswordRecoverResetPasswordPage /> },
  { path: PATH.profilePage, component: <ProfilePage /> },
  { path: `${PATH.companyPage}:companyId`, component: <CompanyPage /> },
  { path: `${PATH.editCompanyPage}:companyId`, component: <EditCompanyPage /> },
  { path: PATH.createPlatformPage, component: <CreatePlatformPage /> },
  {
    path: `${PATH.companyManagementStaffPageAdmin}:companyId`,
    component: <CompanyManagementStaffPageAdmin />,
  },
  {
    path: `${PATH.companyStaffCardPageAdmin}:companyId/:workerId`,
    component: <CompanyStaffCardPageAdmin />,
  },
  { path: PATH.error404, component: <Error404 /> },
]

export const directorAgentRoutes: RouteType[] = [
  { path: '/', component: <MainPage /> },
  { path: PATH.siteManagementPage, component: <PlatformManagementPage /> },
  { path: `${PATH.platformCardPage}:platformId`, component: <PlatformCardPage /> },
  { path: PATH.reservationPlatformPage, component: <ReservationPlatformPage /> },
  {
    path: `${PATH.companyManagementStaffPage}:companyId`,
    component: <CompanyManagementStaffPage />,
  },
  { path: `${PATH.companyStaffCardPage}:companyId/:workerId`, component: <CompanyStaffCardPage /> },
  { path: `${PATH.editStaffCardPage}:companyId/:workerId`, component: <EditStaffCardPage /> },
  { path: PATH.claimManagementPage, component: <ClaimManagementPage /> },
  {
    path: `${PATH.claimManagementCurrentPlatformPage}:platformId`,
    component: <ClaimManagementCurrentPlatformPage />,
  },
  { path: `${PATH.claimCardPage}:claimId`, component: <ClaimCardPage /> },
  { path: `${PATH.editClaimCardPage}:claimId`, component: <EditClaimCardPage /> },
  { path: PATH.passwordRecoveryCodePage, component: <PasswordRecoveryCodePage /> },
  { path: PATH.passwordRecoveryResetPasswordPage, component: <PasswordRecoverResetPasswordPage /> },
  { path: PATH.profilePage, component: <ProfilePage /> },
  { path: `${PATH.companyPage}:companyId`, component: <CompanyPage /> },
  { path: PATH.error404, component: <Error404 /> },
]

export const directorPlatformRoutes: RouteType[] = [
  { path: '/', component: <MainPage /> },
  { path: PATH.siteManagementPage, component: <PlatformManagementPage /> },
  { path: `${PATH.platformCardPage}:platformId`, component: <PlatformCardPage /> },
  { path: PATH.reservationPlatformPage, component: <ReservationPlatformPage /> },
  { path: `${PATH.editPlatformCardPage}:platformId`, component: <EditPlatformCardPage /> },

  {
    path: `${PATH.companyManagementStaffPage}:companyId`,
    component: <CompanyManagementStaffPage />,
  },
  { path: `${PATH.companyStaffCardPage}:companyId/:workerId`, component: <CompanyStaffCardPage /> },
  { path: `${PATH.editStaffCardPage}:companyId/:workerId`, component: <EditStaffCardPage /> },
  {
    path: `${PATH.companyManagementPlatformsPage}:companyId`,
    component: <CompanyManagementPlatformsPage />,
  },
  { path: PATH.claimManagementPage, component: <ClaimManagementPage /> },
  {
    path: `${PATH.claimManagementCurrentPlatformPage}:platformId`,
    component: <ClaimManagementCurrentPlatformPage />,
  },
  { path: `${PATH.claimCardPage}:claimId`, component: <ClaimCardPage /> },
  { path: `${PATH.editClaimCardPage}:claimId`, component: <EditClaimCardPage /> },
  { path: PATH.passwordRecoveryCodePage, component: <PasswordRecoveryCodePage /> },
  { path: PATH.passwordRecoveryResetPasswordPage, component: <PasswordRecoverResetPasswordPage /> },
  { path: PATH.profilePage, component: <ProfilePage /> },
  { path: `${PATH.companyPage}:companyId`, component: <CompanyPage /> },
  { path: `${PATH.editCompanyPage}:companyId`, component: <EditCompanyPage /> },
  { path: PATH.createPlatformPage, component: <CreatePlatformPage /> },
  { path: PATH.error404, component: <Error404 /> },
]

export const agentRoutes: RouteType[] = [
  { path: '/', component: <MainPage /> },
  { path: PATH.siteManagementPage, component: <PlatformManagementPage /> },
  {
    path: `${PATH.companyManagementStaffPage}:companyId`,
    component: <CompanyManagementStaffPage />,
  },
  { path: `${PATH.companyStaffCardPage}:companyId/:workerId`, component: <CompanyStaffCardPage /> },
  { path: `${PATH.platformCardPage}:platformId`, component: <PlatformCardPage /> },
  { path: PATH.reservationPlatformPage, component: <ReservationPlatformPage /> },
  { path: PATH.claimManagementPage, component: <ClaimManagementPage /> },
  {
    path: `${PATH.claimManagementCurrentPlatformPage}:platformId`,
    component: <ClaimManagementCurrentPlatformPage />,
  },
  { path: `${PATH.claimCardPage}:claimId`, component: <ClaimCardPage /> },
  { path: `${PATH.editClaimCardPage}:claimId`, component: <EditClaimCardPage /> },
  { path: PATH.passwordRecoveryCodePage, component: <PasswordRecoveryCodePage /> },
  { path: PATH.passwordRecoveryResetPasswordPage, component: <PasswordRecoverResetPasswordPage /> },
  { path: PATH.profilePage, component: <ProfilePage /> },
  { path: `${PATH.companyPage}:companyId`, component: <CompanyPage /> },
  { path: PATH.error404, component: <Error404 /> },
]

export const platformRoutes: RouteType[] = [
  { path: '/', component: <MainPage /> },
  { path: PATH.siteManagementPage, component: <PlatformManagementPage /> },
  { path: `${PATH.platformCardPage}:platformId`, component: <PlatformCardPage /> },
  { path: PATH.companyManagementPage, component: <CompanyManagementPage /> },
  { path: `${PATH.companyCardPage}:companyId`, component: <CompanyCardPage /> },
  {
    path: `${PATH.companyManagementStaffPage}:companyId`,
    component: <CompanyManagementStaffPage />,
  },
  { path: `${PATH.companyStaffCardPage}:companyId/:workerId`, component: <CompanyStaffCardPage /> },
  {
    path: `${PATH.companyManagementPlatformsPage}:companyId`,
    component: <CompanyManagementPlatformsPage />,
  },
  //
  { path: PATH.reservationPlatformPage, component: <ReservationPlatformPage /> },
  { path: `${PATH.editPlatformCardPage}:platformId`, component: <EditPlatformCardPage /> },
  {
    path: `${PATH.companyManagementPlatformsPage}:companyId`,
    component: <CompanyManagementPlatformsPage />,
  },
  { path: PATH.claimManagementPage, component: <ClaimManagementPage /> },
  {
    path: `${PATH.claimManagementCurrentPlatformPage}:platformId`,
    component: <ClaimManagementCurrentPlatformPage />,
  },
  { path: `${PATH.claimCardPage}:claimId`, component: <ClaimCardPage /> },
  { path: `${PATH.editClaimCardPage}:claimId`, component: <EditClaimCardPage /> },
  { path: PATH.passwordRecoveryCodePage, component: <PasswordRecoveryCodePage /> },
  { path: PATH.passwordRecoveryResetPasswordPage, component: <PasswordRecoverResetPasswordPage /> },
  { path: PATH.profilePage, component: <ProfilePage /> },
  { path: `${PATH.companyPage}:companyId`, component: <CompanyPage /> },
  { path: `${PATH.editCompanyPage}:companyId`, component: <EditCompanyPage /> },
  { path: PATH.error404, component: <Error404 /> },
]
