import React, { useEffect } from 'react'
import styles from './ProfilePage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import Footer from '../../components/Footer/Footer'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import Loader from '../../components/UI/Loader/Loader'
import AboutUserComponent from '../../components/AboutUserComponent/AboutUserComponent'
import DataForLogin from '../../components/DataForLogin/DataForLogin'
import CompanyData from '../../components/CompanyData/CompanyData'
import ProfileCategories from '../../components/ProfileCategories/ProfileCategories'
import { getMe } from '../../redux/actions/meAction'

const ProfilePage = () => {
  const { token } = useAppSelector((state) => state.auth)
  const { isLoading, meData } = useAppSelector((state) => state.me)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onRedirectToCompanyManagementStaffPage = () => {
    navigate(-1)
  }

  useEffect(() => {
    dispatch(getMe({ token }))
  }, [dispatch, token])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.profilePage}>
      <Navbar />
      <div className={styles.categoriesBlock}>
        <ProfileCategories
          categories={[
            { id: 1, title: 'Основная информация' },
            { id: 2, title: 'Сотрудники компании' },
          ]}
          activeLink={1}
          cardId={String(meData.company.id)}
        />
      </div>
      <HeaderForCard
        title={`Здравствуйте, ${meData.user.fullName}!`}
        onRedirectHandler={onRedirectToCompanyManagementStaffPage}
      />
      <div className={styles.content}>
        <AboutUserComponent
          isMe
          userId={meData?.id}
          fullName={meData?.user?.fullName}
          companyName={meData?.company?.name}
          phone={meData?.user?.phone}
        />
        <DataForLogin
          isMe
          userId={meData?.id}
          role={meData?.user?.role}
          email={meData?.user?.email}
          password={meData?.user?.password}
        />
        <CompanyData
          companyId={meData?.company?.id}
          companyName={meData?.company?.name}
          inn={meData?.company?.inn}
          role={meData?.company?.role}
          city={meData?.company?.city}
          address={meData?.company?.address}
          email={meData?.company?.email}
        />
      </div>
      <Footer />
    </div>
  )
}

export default ProfilePage
