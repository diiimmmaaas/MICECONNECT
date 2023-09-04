import React, { useEffect, useState } from 'react'
import styles from './CompanyPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import SearchPanel from '../../components/SearchPanel/SearchPanel'
import arrowLeft from '../../assets/icons/arrowLeft.svg'
import pencilIcon from '../../assets/icons/pencil.svg'
import plusIcon from '../../assets/icons/plusIcon.svg'
import Footer from '../../components/Footer/Footer'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useMediaQuery } from 'react-responsive'
import PATH from '../../navigation/path'
import Loader from '../../components/UI/Loader/Loader'
import { getCurrentCompany } from '../../redux/actions/companiesAction'
import CompanyPageShortInformation from '../../components/CompanyPageShortInformation/CompanyPageShortInformation'
import CompanyPageDescription from '../../components/CompanyPageDescription/CompanyPageDescription'
import EventsList from '../../components/EventsList/EventsList'
import { placesPerPage } from '../../constants/constants'
import { PlaceType } from '../../redux/actions/types'
import { EventType } from '../MainPage/MainPage'
import { getPlacesFromCompany } from '../../redux/actions/placesAction'
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel'
import noImage from '../../assets/img/no-image.jpg'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import FullScreenSlider from '../../components/FullScreenSlider/FullScreenSlider'

const CompanyPage = () => {
  const [visiblePopup, setVisiblePopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { companyId } = useParams<{ companyId: string }>()

  const navigate = useNavigate()

  let { userRole, user, token } = useAppSelector((state) => state.auth)
  const { currentCompany, companiesComments } = useAppSelector((state) => state.companies)
  const { isLoading, places } = useAppSelector((state) => state.places)

  const dispatch = useAppDispatch()
  const location = useLocation()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const dummyDataEvents = (array: PlaceType[]) => {
    const items: EventType[] = array.map((place) => {
      return {
        id: place.id,
        title: place.name,
        subTitle: place.company.name,
        numberOfPerson: String(place.size),
        images: place.images.map((p, index) => {
          return { id: index, src: `${process.env.REACT_APP_BASE_URL_IMAGES}${p}` }
        }),
      }
    })
    return items
  }

  const eventList = dummyDataEvents(places.places)

  const dummyData = (imagesArr: string[]) => {
    return imagesArr.map((image, index) => {
      return { id: index, src: `${process.env.REACT_APP_BASE_URL_IMAGES}${image}` }
    })
  }

  const imagesFull = dummyData(currentCompany?.images)

  const onRedirectBack = () => {
    navigate(-1)
  }

  const onRedirectToEditCardPage = () => {
    navigate(`${PATH.editCompanyPage}${companyId}`)
  }

  const onRedirectToCreatePlatform = () => {
    navigate(PATH.createPlatformPage)
  }

  const foundObject = currentCompany.employees.find((item) => item.id === user.employee?.id)

  useEffect(() => {
    dispatch(getCurrentCompany({ companyId, token }))
  }, [companyId, dispatch])

  useEffect(() => {
    dispatch(
      getPlacesFromCompany({
        token,
        page: currentPage,
        itemsPerPage: placesPerPage,
        companyId: companyId,
      }),
    )
  }, [dispatch, currentPage, setCurrentPage, placesPerPage])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.companyPage}>
      {/* <CustomModal visible={visiblePopup} setVisible={setVisiblePopup}> */}
      {/*   <FullScreenSlider imagesData={imagesFull} setVisibleModal={setVisiblePopup} /> */}
      {/* </CustomModal> */}
      <Navbar>
        <SearchPanel currentPage={1} />
      </Navbar>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.arrowLeftBlock} onClick={onRedirectBack}>
            <img className={styles.arrowLeft} src={arrowLeft} alt='arrowLeft' />
          </div>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{currentCompany.name}</h1>
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
          <CompanyPageShortInformation companyData={currentCompany} />
          {currentCompany.description && (
            <CompanyPageDescription text={currentCompany.description} />
          )}
          <div className={styles.platformContent}>
            <div className={styles.platformTitleBlock}>
              <h1 className={styles.platformTitle}>Площадки компании:</h1>
              {userRole !== 'employeeAgent' &&
                userRole !== 'employeePlace' &&
                userRole !== 'directorAgent' && (
                  <div className={styles.addPlatformIconBlock} onClick={onRedirectToCreatePlatform}>
                    <img className={styles.plusIcon} src={plusIcon} alt='plusIcon' />
                  </div>
                )}
            </div>

            {eventList.length !== 0 ? (
              <EventsList
                eventList={eventList}
                pageSize={placesPerPage}
                fromMainPage
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalCountPages={places.totalCount}
              />
            ) : (
              <div style={{ width: '100%', textAlign: 'center' }}>Список площадок пуст...</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CompanyPage
