import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import CompanyCardCategories from '../../components/CompanyCardCategories/CompanyCardCategories'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './CompanyStaffCardPageAdmin.module.css'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import Footer from '../../components/Footer/Footer'
import ReviewsForCards from '../../components/ReviewsForCards/ReviewsForCards'
import StaffMainInformation from '../../components/StaffMainInformation/StaffMainInformation'
import StaffLoginDetails from '../../components/StaffLoginDetails/StaffLoginDetails'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import {
  createStaffComment,
  getCurrentStaff,
  getStaffComments,
} from '../../redux/actions/staffAction'
import Loader from '../../components/UI/Loader/Loader'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'

const CompanyStaffCardPageAdmin = () => {
  const [commentFile, setCommentFile] = useState<any>([])
  const [postCommentError, setPostCommentError] = useState<boolean>(false)

  const { companyId } = useParams<{ companyId: string }>()
  const { workerId } = useParams<{ workerId: string }>()

  const userRole = useAppSelector((state) => state.auth.userRole)
  const { currentStaff, staffComments, isLoading } = useAppSelector((state) => state.staff)
  const { token } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const postNewCommentHandler = async (text: string) => {
    const formData = new FormData()

    if (commentFile) {
      for (let i = 0; i < commentFile.length; i++) {
        formData.append('file', commentFile[i])
      }
    }

    formData.append('employeeId', String(currentStaff.id))
    formData.append('text', text)

    const resultAction = await dispatch(
      createStaffComment({
        employeeId: String(currentStaff.id),
        formData,
      }),
    )

    if (createStaffComment.rejected.match(resultAction)) {
      setPostCommentError(true)
      waitTimer(() => setPostCommentError(false), 10000)
    } else {
      setPostCommentError(false)
      await dispatch(getStaffComments({ staffId: workerId }))
      setCommentFile([])
    }
  }

  const onRedirectToCompanyManagementStaffPage = () => {
    navigate(`${PATH.companyManagementStaffPage}${companyId}`)
  }

  useEffect(() => {
    dispatch(getCurrentStaff({ staffId: workerId, token }))
  }, [companyId, workerId, dispatch])

  useEffect(() => {
    if (userRole !== 'employeeAgent') {
      dispatch(getStaffComments({ staffId: workerId }))
    }
  }, [workerId, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.companyStaffCardPage}>
      <Navbar />
      {(userRole === 'superAdmin' ||
        userRole === 'admin' ||
        userRole === 'directorPlace' ||
        userRole === 'employeePlace' ||
        userRole === 'directorAgent') && (
        <CompanyCardCategories
          categories={[
            { id: 1, title: 'Основная информация' },
            { id: 2, title: 'Сотрудники компании' },
            { id: 3, title: 'Площадки компании' },
          ]}
          activeLink={2}
          cardId={companyId}
        />
      )}
      <HeaderForCard
        title='Карточка сотрудника'
        onRedirectHandler={onRedirectToCompanyManagementStaffPage}
      />
      <div className={styles.content}>
        <StaffMainInformation staffData={currentStaff} />
        <StaffLoginDetails staffData={currentStaff} />
        {userRole !== 'employeePlace' && userRole !== 'employeeAgent' && (
          <div className={styles.leftBlock}>
            <ReviewsForCards
              employees={currentStaff.company.employees}
              comments={staffComments}
              postNewCommentHandler={postNewCommentHandler}
              postCommentError={postCommentError}
              setCommentFile={setCommentFile}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CompanyStaffCardPageAdmin
