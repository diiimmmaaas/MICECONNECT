import React, { useEffect, useState } from 'react'
import styles from './ClaimCardPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import CardDescription from '../../components/CardDescription/CardDescription'
import ReviewsForCards from '../../components/ReviewsForCards/ReviewsForCards'
import Footer from '../../components/Footer/Footer'
import ClaimCardMainInformation from '../../components/ClaimCardMainInformation/ClaimCardMainInformation'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createClaimComments,
  getClaimComments,
  getCurrentClaim,
} from '../../redux/actions/claimsAction'
import Loader from '../../components/UI/Loader/Loader'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'
import { getMe } from '../../redux/actions/meAction'

const ClaimCardPage = () => {
  const [commentFile, setCommentFile] = useState<any>([])
  const [postCommentError, setPostCommentError] = useState<boolean>(false)

  const { claimId } = useParams<{ claimId: string }>()

  const { isLoading, claimComments, currentClaim } = useAppSelector((state) => state.claims)

  const { token, user, userRole } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onRedirectToClaimsManagementPage = () => {
    navigate(PATH.claimManagementPage)
  }

  const postNewCommentHandler = async (text: string) => {
    const formData = new FormData()

    if (commentFile) {
      for (let i = 0; i < commentFile.length; i++) {
        formData.append('file', commentFile[i])
      }
    }

    formData.append('requestId', String(currentClaim.id))
    formData.append('text', text)

    const resultAction = await dispatch(
      createClaimComments({
        formData,
      }),
    )

    if (createClaimComments.rejected.match(resultAction)) {
      setPostCommentError(true)
      waitTimer(() => setPostCommentError(false))
    } else {
      setPostCommentError(false)
      await dispatch(getClaimComments({ requestId: claimId }))
      setCommentFile([])
    }
  }

  const foundObject = currentClaim?.user?.employee?.company?.employees.find(
    (item) => item.id === user.employee?.id,
  )

  useEffect(() => {
    if (userRole !== 'superAdmin' && userRole !== 'admin') {
      dispatch(getMe({ token }))
    }
  }, [dispatch, token])

  useEffect(() => {
    dispatch(getCurrentClaim({ claimId, token }))
  }, [dispatch, claimId])

  useEffect(() => {
    dispatch(getClaimComments({ requestId: claimId }))
  }, [claimId, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.claimCardPage}>
      <Navbar />
      <div className={styles.headerBlock}>
        <HeaderForCard title='Детали заявки' onRedirectHandler={onRedirectToClaimsManagementPage} />
      </div>
      <div className={styles.content}>
        <ClaimCardMainInformation claimData={currentClaim} />
        <div className={styles.leftBlock}>
          {currentClaim.description && (
            <CardDescription text={currentClaim.description ? currentClaim.description : ''} />
          )}
          {(userRole === 'superAdmin' ||
            userRole === 'admin' ||
            userRole === 'directorPlace' ||
            userRole === 'employeePlace' ||
            (userRole === 'employeeAgent' && foundObject) ||
            userRole === 'directorAgent') && (
            <ReviewsForCards
              employees={currentClaim?.user?.employee?.company?.employees}
              setCommentFile={setCommentFile}
              comments={currentClaim.comments}
              postNewCommentHandler={postNewCommentHandler}
              postCommentError={postCommentError}
            />
          )}
        </div>
      </div>
      <div className={styles.footerBlock}>
        <Footer />
      </div>
    </div>
  )
}

export default ClaimCardPage
