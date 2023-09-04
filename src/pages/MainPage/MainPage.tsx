import React, { useEffect, useState } from 'react'
import styles from './MainPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import EventsList from '../../components/EventsList/EventsList'
import SearchPanel from '../../components/SearchPanel/SearchPanel'
import { getPlaces, getPlacesFromCompany } from '../../redux/actions/placesAction'
import Loader from '../../components/UI/Loader/Loader'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { PlaceType } from '../../redux/actions/types'
import { useLocation, useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import { placesPerPage } from '../../constants/constants'
import nookies from 'nookies'
import jwt_decode from 'jwt-decode'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import plusIcon from '../../assets/icons/plus.svg'

export type EventType = {
  id: number
  title: string
  subTitle: string
  numberOfPerson: string
  images: ImageType[]
}

export type ImageType = {
  id: number
  src: string
}

const MainPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { isLoading, places } = useAppSelector((state) => state.places)
  const { token, userRole, user } = useAppSelector((state) => state.auth)

  const dummyData = (array: PlaceType[]) => {
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

  const eventList = dummyData(places.places)

  const onRedirectToCreatePlatform = () => {
    navigate(PATH.createPlatformPage)
  }

  useEffect(() => {
    const cookies = nookies.get(null)
    const token = cookies.refreshToken
    const decodedToken: { exp: number } = jwt_decode(token)
    const currentDate = new Date()
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      navigate(PATH.authPage)
    }
  }, [token])

  useEffect(() => {
    if (userRole === 'directorPlace' || userRole === 'employeePlace') {
      dispatch(
        getPlacesFromCompany({
          token,
          page: currentPage,
          itemsPerPage: placesPerPage,
          companyId: String(user.employee?.company?.id),
        }),
      )
    } else {
      if (location.state) {
        dispatch(
          getPlaces({
            token,
            page: currentPage,
            itemsPerPage: placesPerPage,
            startDate: location.state.startDateAndTime,
            endDate: location.state.finishDateAndTime,
            city: location.state.city,
            peopleCount: location.state.peopleCount,
          }),
        )
      } else {
        dispatch(getPlaces({ token, page: currentPage, itemsPerPage: placesPerPage }))
      }
    }
  }, [dispatch, token, currentPage, setCurrentPage, placesPerPage])

  return (
    <div className={styles.mainPage}>
      <Navbar isPlatforms>
        <SearchPanel
          currentPage={currentPage}
          cityState={location?.state?.city ? location?.state?.city : ''}
          startDateStringState={
            location?.state?.startDateString ? location?.state?.startDateString : ''
          }
          finishDateStringState={
            location?.state?.finishDateString ? location?.state?.finishDateString : ''
          }
          timeStartState={location?.state?.startTime ? location?.state?.startTime : null}
          timeFinishState={location?.state?.finishTime ? location?.state?.finishTime : null}
          peopleCountState={location?.state?.peopleCount ? location?.state?.peopleCount : ''}
        />
      </Navbar>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Площадки для мероприятий</h1>
            {userRole !== 'employeePlace' &&
              userRole !== 'employeeAgent' &&
              userRole !== 'directorAgent' && (
                <CustomButton
                  className={styles.addSiteBtn}
                  title='Создать площадку'
                  type='button'
                  iconSrc={plusIcon}
                  onClick={onRedirectToCreatePlatform}
                />
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
            <div style={{ width: '100%', textAlign: 'center', minHeight: 200 }}>
              Список площадок пуст...
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  )
}

export default MainPage
