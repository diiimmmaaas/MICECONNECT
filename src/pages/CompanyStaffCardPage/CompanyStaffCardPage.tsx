import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './CompanyStaffCardPage.module.css'
import Footer from '../../components/Footer/Footer'
import ReviewsForCards from '../../components/ReviewsForCards/ReviewsForCards'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import {
  blockStaff,
  createStaffComment,
  deleteStaff,
  getCurrentStaff,
  getStaffComments,
} from '../../redux/actions/staffAction'
import Loader from '../../components/UI/Loader/Loader'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'
import ProfileCategories from '../../components/ProfileCategories/ProfileCategories'
import AboutUserComponent from '../../components/AboutUserComponent/AboutUserComponent'
import DataForLogin from '../../components/DataForLogin/DataForLogin'
import HeaderForCardWithButtons from '../../components/HeaderForCardWithButtons/HeaderForCardWithButtons'
import DeleteComponent from '../../components/DeleteComponent/DeleteComponent'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import BlockAndDeletePanel from '../../components/BlockAndDeletePanel/BlockAndDeletePanel'
import { useMediaQuery } from 'react-responsive'

const CompanyStaffCardPage = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [commentFile, setCommentFile] = useState<any>([])
  const [postCommentError, setPostCommentError] = useState<boolean>(false)
  const [staffError, setStaffError] = useState<boolean>(false)

  const { companyId } = useParams<{ companyId: string }>()
  const { workerId } = useParams<{ workerId: string }>()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const userRole = useAppSelector((state) => state.auth.userRole)
  const { currentStaff, staffComments, isLoading, error } = useAppSelector((state) => state.staff)
  const { token, user } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const postNewCommentHandler = async (text: string) => {
    const formData = new FormData()

    if (commentFile) {
      for (let i = 0; i < commentFile.length; i++) {
        formData.append('file', commentFile[i])
      }
    }

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

  const onChangeSwipeCheckboxHandler = async (checked: boolean) => {
    await dispatch(
      blockStaff({
        staffId: String(currentStaff.id),
        isBlocked: !checked,
      }),
    )

    await dispatch(getCurrentStaff({ staffId: workerId, token }))
  }

  const onDeletePopup = () => {
    setVisible(true)
  }

  const onDeleteStaff = async () => {
    const resultAction = await dispatch(deleteStaff({ staffId: String(currentStaff.id), token }))

    if (deleteStaff.rejected.match(resultAction)) {
      setStaffError(true)
      waitTimer(() => setStaffError(false))
    } else {
      navigate(`${PATH.companyManagementStaffPage}${companyId}`)
      setStaffError(false)
    }
  }

  const onRedirectToCompanyManagementStaffPage = () => {
    navigate(`${PATH.companyManagementStaffPage}${companyId}`)
  }

  useEffect(() => {
    dispatch(getCurrentStaff({ staffId: workerId, token }))
  }, [companyId, workerId, dispatch])

  useEffect(() => {
    if (userRole !== 'employeeAgent' && userRole !== 'employeePlace') {
      dispatch(getStaffComments({ staffId: workerId }))
    }
  }, [workerId, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.companyStaffCardPage}>
      <CustomModal visible={visible} setVisible={setVisible}>
        <DeleteComponent
          title='Удаление сотрудника'
          description='Хотите удалить данного сотрудника?'
          onCancelHandler={() => setVisible(false)}
          onDeleteHandler={onDeleteStaff}
          deleteError={staffError}
        />
      </CustomModal>
      <Navbar />
      <div className={styles.categoriesBlock}>
        <ProfileCategories
          categories={[
            { id: 1, title: 'Основная информация' },
            { id: 2, title: 'Сотрудники компании' },
          ]}
          activeLink={2}
          cardId={String(currentStaff.id)}
        />
      </div>
      <HeaderForCardWithButtons
        currentStaff={currentStaff}
        title={currentStaff.user.fullName}
        onRedirectHandler={onRedirectToCompanyManagementStaffPage}
        onDeletePopup={onDeletePopup}
        onChangeSwipeCheckboxHandler={onChangeSwipeCheckboxHandler}
      />
      {isMobile && (
        <>
          {user.employee.id !== currentStaff.id &&
            userRole !== 'employeeAgent' &&
            userRole !== 'employeePlace' && (
              <div className={styles.functionalBlock}>
                <BlockAndDeletePanel
                  blockText='Заблокирован'
                  isBlocked={currentStaff.user.isBlocked}
                  checkBoxTitle='Заблокировать'
                  buttonTitle='Удалить'
                  onChangeHandler={onChangeSwipeCheckboxHandler}
                  onDeleteHandler={onDeletePopup}
                />
              </div>
            )}
        </>
      )}
      <div className={styles.content}>
        <AboutUserComponent
          fullName={currentStaff?.user?.fullName}
          companyName={currentStaff?.company?.name}
          phone={currentStaff?.user?.phone}
          userId={currentStaff.id}
        />
        <DataForLogin
          isMe={false}
          userId={currentStaff.id}
          role={currentStaff?.user?.role}
          email={currentStaff?.user?.email}
          password={currentStaff?.user?.password}
        />
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

export default CompanyStaffCardPage
