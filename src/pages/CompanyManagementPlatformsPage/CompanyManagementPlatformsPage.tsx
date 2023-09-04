import React, { useEffect, useState } from 'react'
import styles from './CompanyManagementPlatformsPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import CompanyCardCategories from '../../components/CompanyCardCategories/CompanyCardCategories'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import plusIcon from '../../assets/icons/plus.svg'
import Footer from '../../components/Footer/Footer'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import { useParams } from 'react-router-dom'
import TableFilters from '../../components/TableFilters/TableFilters'
import { EventType } from '../MainPage/MainPage'
import EventsList from '../../components/EventsList/EventsList'
import CreatePlatform from '../../components/CreatePlatform/CreatePlatform'
import { useMediaQuery } from 'react-responsive'
import filtersIcon from '../../assets/icons/filtersIcon.svg'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { PlaceType } from '../../redux/actions/types'
import { getPlacesFromCompany } from '../../redux/actions/placesAction'
import Loader from '../../components/UI/Loader/Loader'
import { getCurrentCompany } from '../../redux/actions/companiesAction'
import { placesPerPage } from '../../constants/constants'
import { useDebounce } from '../../hooks/useDebounce'
import p from '../AdministratorsManagementPage/AdministratorsManagementPage.module.css'
import SearchMobileComponent from '../../components/UI/SearchMobileComponent/SearchMobileComponent'

const CompanyManagementPlatformsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState<string>('')
  const [modal, setModal] = useState(false)

  const debounced = useDebounce(search, 1000)

  const { isLoading, placesFromCurrentCompany } = useAppSelector((state) => state.places)

  const { currentCompany } = useAppSelector((state) => state.companies)

  const { token, userRole, user } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const { companyId } = useParams<{ companyId: string }>()

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

  const handleButtonClick = async (btnTitle: string) => {
    console.log('btnTitle', btnTitle)
  }

  const eventList = dummyData(placesFromCurrentCompany.places)

  const foundObject = currentCompany.employees.find((item) => item.id === user.employee?.id)

  useEffect(() => {
    if (debounced) {
      dispatch(
        getPlacesFromCompany({
          companyId,
          token,
          page: 1,
          itemsPerPage: placesPerPage,
          search: debounced,
        }),
      )
    } else {
      dispatch(
        getPlacesFromCompany({ companyId, token, page: currentPage, itemsPerPage: placesPerPage }),
      )
    }
  }, [dispatch, companyId, currentPage, setCurrentPage, placesPerPage, debounced])

  useEffect(() => {
    dispatch(getCurrentCompany({ companyId, token }))
  }, [companyId, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.companyPlatforms}>
      <Navbar />
      {isMobile && (
        <div className={p.searchMobileComponent}>
          <SearchMobileComponent
            searchValue={search}
            setSearchValues={setSearch}
            callback={() => console.log('clicked')}
          />
        </div>
      )}
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
        activeLink={3}
        cardId={companyId}
      />
      <div className={styles.content}>
        <div className={styles.header}>
          {isMobile ? (
            <div className={styles.headerBlock}>
              <h1 className={styles.title}>Площадки компании</h1>
            </div>
          ) : (
            <h1 className={styles.title}>Площадки компании</h1>
          )}
          {(userRole === 'superAdmin' ||
            userRole === 'admin' ||
            (userRole === 'directorPlace' && foundObject) ||
            (userRole === 'employeePlace' && foundObject)) && (
            <CustomButton
              className={styles.addSiteBtn}
              title='Создать площадку'
              type='button'
              iconSrc={plusIcon}
              onClick={() => setModal(true)}
            />
          )}
        </div>
        {!isMobile && (
          <TableFilters
            isPlatforms
            firstBtnTitle='Все'
            secondBtnTitle='до 50 гостей'
            thirdBtnTitle='50-100 гостей'
            fourthBtnTitle='более 100 гостей'
            handleFirstButtonClick={handleButtonClick}
            handleSecondButtonClick={handleButtonClick}
            handleThirdButtonClick={handleButtonClick}
            handleFourthButtonClick={handleButtonClick}
            search={search}
            setSearch={setSearch}
          />
        )}
        {eventList.length !== 0 ? (
          <EventsList
            eventList={eventList}
            pageSize={placesPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalCountPages={placesFromCurrentCompany.totalCount}
          />
        ) : (
          <div style={{ marginBottom: 100 }}>Список площадок пуст...</div>
        )}
      </div>
      <Footer />
      <CustomModal visible={modal} setVisible={setModal}>
        <CreatePlatform
          onClickHandler={() => setModal(false)}
          innCompany={currentCompany.inn ? currentCompany.inn : ''}
        />
      </CustomModal>
    </div>
  )
}

export default CompanyManagementPlatformsPage
