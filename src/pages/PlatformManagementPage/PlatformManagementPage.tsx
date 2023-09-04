import React, { useEffect, useState } from 'react'
import styles from './PlatformManagementPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import EventsList from '../../components/EventsList/EventsList'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import plusIcon from '../../assets/icons/plus.svg'
import { EventType } from '../MainPage/MainPage'
import SearchPanel from '../../components/SearchPanel/SearchPanel'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getPlaces, getPlacesFromCompany } from '../../redux/actions/placesAction'
import Loader from '../../components/UI/Loader/Loader'
import { PlaceType } from '../../redux/actions/types'
import { useLocation, useNavigate } from 'react-router-dom'
import { placesPerPage } from '../../constants/constants'
import PATH from '../../navigation/path'

const PlatformManagementPage = () => {
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
        subTitle: '',
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
    if (location.state) {
      dispatch(
        getPlaces({
          token,
          page: currentPage,
          itemsPerPage: placesPerPage,
          city: location.state.city,
          peopleCount: location.state.guestsNumber,
          startDate: location.state.startDate,
          endDate: location.state.finishDate,
        }),
      )
    } else {
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
        dispatch(getPlaces({ token, page: currentPage, itemsPerPage: placesPerPage }))
      }
    }
  }, [dispatch, currentPage, setCurrentPage, placesPerPage])

  return (
    <div className={styles.mainPage}>
      <Navbar isPlatforms>
        <SearchPanel currentPage={currentPage} />
      </Navbar>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>
                {location?.state?.titlePage ? location?.state?.titlePage : 'Управление площадками'}
              </h1>
              <p className={styles.description}>Все площадки</p>
            </div>
            {userRole !== 'directorAgent' &&
              userRole !== 'employeeAgent' &&
              userRole !== 'employeePlace' && (
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
              bookingData={location?.state ? location.state : null}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalCountPages={places.totalCount}
            />
          ) : (
            <div>Список площадок пуст...</div>
          )}
        </div>
      )}
      <Footer />
    </div>
  )
}

export default PlatformManagementPage
