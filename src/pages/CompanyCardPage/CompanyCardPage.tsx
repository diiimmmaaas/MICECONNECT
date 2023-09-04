import React, { useEffect, useState } from 'react'
import styles from './CompanyCardPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import CompanyCardMainInformation from '../../components/CompanyCardMainInformation/CompanyCardMainInformation'
import CardDescription from '../../components/CardDescription/CardDescription'
import ReviewsForCards from '../../components/ReviewsForCards/ReviewsForCards'
import CompanyCardCategories from '../../components/CompanyCardCategories/CompanyCardCategories'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import {
  createCompanyComments,
  getCompanyComments,
  getCurrentCompany,
} from '../../redux/actions/companiesAction'
import Loader from '../../components/UI/Loader/Loader'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'

const CompanyCardPage = () => {
  const [commentFile, setCommentFile] = useState<any>([])
  const { companyId } = useParams<{ companyId: string }>()

  const [postCommentError, setPostCommentError] = useState<boolean>(false)

  const { token, userRole, user } = useAppSelector((state) => state.auth)

  const { currentCompany, companiesComments, isLoading } = useAppSelector(
    (state) => state.companies,
  )

  const navigate = useNavigate()
  const location = useLocation()

  const postNewCommentHandler = async (text: string) => {
    const formData = new FormData()

    if (commentFile) {
      for (let i = 0; i < commentFile.length; i++) {
        formData.append('file', commentFile[i])
      }
    }

    formData.append('companyId', String(currentCompany.id))
    formData.append('text', text)

    const resultAction = await dispatch(
      createCompanyComments({
        formData,
      }),
    )

    if (createCompanyComments.rejected.match(resultAction)) {
      setPostCommentError(true)
      waitTimer(() => setPostCommentError(false))
    } else {
      setPostCommentError(false)
      await dispatch(getCompanyComments({ companyId, token }))
      setCommentFile([])
    }
  }

  const onRedirectToCompanyManagement = () => {
    navigate(PATH.companyManagementPage)
  }

  const dispatch = useAppDispatch()

  const foundObject = currentCompany.employees.find((item) => item.id === user.employee?.id)

  useEffect(() => {
    dispatch(getCurrentCompany({ companyId, token }))
  }, [companyId, dispatch])

  useEffect(() => {
    dispatch(getCompanyComments({ companyId, token }))
  }, [companyId, dispatch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.companyCardPage}>
      <Navbar />
      <CompanyCardCategories
        categories={
          userRole === 'superAdmin' ||
          userRole === 'admin' ||
          userRole === 'directorPlace' ||
          (userRole === 'employeePlace' && foundObject) ||
          userRole === 'directorAgent' ||
          (userRole === 'employeeAgent' && foundObject)
            ? [
                { id: 1, title: 'Основная информация' },
                { id: 2, title: 'Сотрудники компании' },
                { id: 3, title: 'Площадки компании' },
              ]
            : [
                { id: 1, title: 'Основная информация' },
                { id: 3, title: 'Площадки компании' },
              ]
        }
        activeLink={1}
        cardId={companyId}
      />
      <HeaderForCard onRedirectHandler={onRedirectToCompanyManagement} title='Карточка компании' />
      <div className={styles.content}>
        <CompanyCardMainInformation companyData={currentCompany} />
        <div className={styles.leftBlock}>
          {currentCompany.description && <CardDescription text={currentCompany.description} />}
          {(userRole === 'superAdmin' ||
            userRole === 'admin' ||
            userRole === 'directorPlace' ||
            userRole === 'employeePlace' ||
            userRole === 'directorAgent' ||
            userRole === 'employeeAgent') && (
            <ReviewsForCards
              employees={currentCompany.employees}
              comments={companiesComments}
              postNewCommentHandler={postNewCommentHandler}
              postCommentError={postCommentError}
              setCommentFile={setCommentFile}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CompanyCardPage
