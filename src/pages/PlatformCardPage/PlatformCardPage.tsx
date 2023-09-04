import React, { useEffect, useState } from 'react'
import styles from './PlatformCardPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import pencilIcon from '../../assets/icons/pencil.svg'
import arrowLeft from '../../assets/icons/arrowLeft.svg'
import PlatformCardShortInformation from '../../components/PlatformCardShortInformation/PlatformCardShortInformation'
import PlatformCardDescription from '../../components/PlatformCardDescription/PlatformCardDescription'
import PlatformCardFilesBlock from '../../components/PlatformCardFilesBlock/PlatformCardFilesBlock'
import ReviewsForCards from '../../components/ReviewsForCards/ReviewsForCards'
import PlatformCardBooking from '../../components/PlatformCardBooking/PlatformCardBooking'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PATH from '../../navigation/path'
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useMediaQuery } from 'react-responsive'
import {
  createPlatformComments,
  getCurrentPlaces,
  getPlatformComments,
} from '../../redux/actions/placesAction'
import Loader from '../../components/UI/Loader/Loader'
import noImage from '../../assets/img/no-image.jpg'
import { waitTimer } from '../../utils/waitTimer'
import SearchPanel from '../../components/SearchPanel/SearchPanel'

const PlatformCardPage = () => {
  const [visiblePopup, setVisiblePopup] = useState(false)
  const [commentFile, setCommentFile] = useState<any>([])
  const [postCommentError, setPostCommentError] = useState<boolean>(false)

  const navigate = useNavigate()

  let { userRole, user } = useAppSelector((state) => state.auth)
  let { isLoading, currentPlace, placesComments } = useAppSelector((state) => state.places)

  const { token } = useAppSelector((state) => state.auth)

  const { platformId } = useParams<{ platformId: string }>()

  const dispatch = useAppDispatch()
  const location = useLocation()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const dummyData = (imagesArr: string[]) => {
    return imagesArr.map((image, index) => {
      return { id: index, src: `${process.env.REACT_APP_BASE_URL_IMAGES}${image}` }
    })
  }

  const imagesFull = dummyData(currentPlace.images)

  const postNewCommentHandler = async (text: string) => {
    const formData = new FormData()

    if (commentFile) {
      for (let i = 0; i < commentFile.length; i++) {
        formData.append('file', commentFile[i])
      }
    }

    formData.append('placeId', String(currentPlace.id))
    formData.append('text', text)

    const resultAction = await dispatch(
      createPlatformComments({
        formData,
      }),
    )

    if (createPlatformComments.rejected.match(resultAction)) {
      setPostCommentError(true)
      waitTimer(() => setPostCommentError(false))
    } else {
      setPostCommentError(false)
      await dispatch(getPlatformComments({ placeId: platformId }))
      setCommentFile([])
    }
  }

  const onRedirectBack = () => {
    navigate(-1)
  }

  const onRedirectToEditCardPage = () => {
    navigate(`${PATH.editPlatformCardPage}${platformId}`)
  }

  const foundObject = currentPlace.company.employees.find((item) => item.id === user.employee?.id)

  useEffect(() => {
    dispatch(getCurrentPlaces({ placeId: platformId, token }))
  }, [platformId, dispatch])

  useEffect(() => {
    if (userRole !== 'directorAgent' && userRole !== 'employeeAgent') {
      dispatch(getPlatformComments({ placeId: platformId }))
    }
  }, [platformId, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.platformCard}>
      <Navbar>
        <SearchPanel currentPage={1} />
      </Navbar>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.arrowLeftBlock} onClick={onRedirectBack}>
            <img className={styles.arrowLeft} src={arrowLeft} alt='arrowLeft' />
          </div>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{currentPlace.name}</h1>
            {(userRole === 'superAdmin' ||
              userRole === 'admin' ||
              (userRole === 'directorPlace' && foundObject)) && (
              <div className={styles.editIconBlock}>
                <img
                  className={styles.pencilIcon}
                  src={pencilIcon}
                  alt='pencilIcon'
                  onClick={onRedirectToEditCardPage}
                />
              </div>
            )}
          </div>
        </div>
        {imagesFull.length !== 0 ? (
          <div className={styles.slider} onClick={() => setVisiblePopup(true)}>
            <ImageCarousel imagesData={imagesFull} />
          </div>
        ) : (
          <div className={styles.slider}>
            <img className={styles.noImage} src={noImage} alt='noImage' />
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.leftBlock}>
            <PlatformCardShortInformation platformData={currentPlace} />
            {currentPlace.description && (
              <PlatformCardDescription text={currentPlace.description} />
            )}
            {currentPlace.files.length !== 0 && (
              <PlatformCardFilesBlock platformData={currentPlace} />
            )}
            {userRole !== 'directorAgent' && userRole !== 'employeeAgent' && (
              <ReviewsForCards
                employees={currentPlace.company.employees}
                comments={placesComments}
                postNewCommentHandler={postNewCommentHandler}
                postCommentError={postCommentError}
                setCommentFile={setCommentFile}
              />
            )}
          </div>
          {(userRole === 'superAdmin' ||
            userRole === 'admin' ||
            userRole === 'directorAgent' ||
            userRole === 'employeeAgent') && (
            <div className={styles.rightBlock}>
              <PlatformCardBooking
                bookingData={
                  location?.state?.bookingData ? location?.state?.bookingData : currentPlace
                }
                platformData={currentPlace}
                platformCity={currentPlace.city}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PlatformCardPage
