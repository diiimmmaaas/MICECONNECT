import React, { useCallback, useEffect, useState } from 'react'
import styles from './RequestForRegistrationPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Table from '../../components/Table/Table'
import Footer from '../../components/Footer/Footer'
import { useMediaQuery } from 'react-responsive'
import { RegistrationRequestType } from '../../redux/actions/types'
import { TableItem } from '../../types'
import {
  createRoleCompanyFromEnToRu,
  createStatusForRegistrationRequest,
  createStatusForRegistrationRequestFilters,
} from '../../utils/createRoleForRegister'
import PATH from '../../navigation/path'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getRegistrationRequests } from '../../redux/actions/registartionRequestAction'
import { useDebounce } from '../../hooks/useDebounce'
import Loader from '../../components/UI/Loader/Loader'
import { useRequestStatus } from '../../hooks/useRequestStatus'
import p from '../AdministratorsManagementPage/AdministratorsManagementPage.module.css'
import SearchMobileComponent from '../../components/UI/SearchMobileComponent/SearchMobileComponent'
import { registrationRequestFilters, requestsPerPage } from '../../constants/constants'
import MobileHeaderForTable from '../../components/MobileHeaderForTable/MobileHeaderForTable'

const RequestForRegistrationPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState<string>('')
  const [requestStatus, setRequestStatus] = useState<any>('')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  const debouncedStatus = useRequestStatus(requestStatus)
  const debounced = useDebounce(search, 1000)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { isLoading, registrationRequests } = useAppSelector((state) => state.registrationRequest)

  const handleButtonClick = useCallback(
    async (btnTitle: string) => {
      if (btnTitle === 'Все') {
        setRequestStatus('')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'В ожидании') {
        setRequestStatus('inProgress')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Приняты') {
        setRequestStatus('accepted')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Отклонены') {
        setRequestStatus('rejected')
        setCurrentPage(1)
        return
      }
    },
    [debouncedStatus],
  )

  const onActiveCurrentRequestCard = (id: number) => {
    navigate(`${PATH.requestForRegistrationCardPage}${id}`)
  }

  const dummyData = (array: RegistrationRequestType[]) => {
    const items: TableItem[] = array.map((req) => {
      return {
        id: req.id,
        firstColumn: req.companyName,
        secondColumn: req.contactFullName,
        thirdColumn: req.contactPhone,
        fourthColumn: createRoleCompanyFromEnToRu(req.role),
        fifthColumn: createStatusForRegistrationRequest(req.status),
      }
    })
    return items
  }

  useEffect(() => {
    if (debounced) {
      dispatch(
        getRegistrationRequests({
          requestStatus: debouncedStatus,
          search: debounced,
          page: 1,
          itemsPerPage: requestsPerPage,
        }),
      )
    } else {
      dispatch(
        getRegistrationRequests({
          requestStatus: debouncedStatus,
          page: currentPage,
          itemsPerPage: requestsPerPage,
        }),
      )
    }
  }, [
    dispatch,
    debounced,
    debouncedStatus,
    currentPage,
    setCurrentPage,
    requestsPerPage,
    debounced,
    debouncedStatus,
  ])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.requestForRegistration}>
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
      <div className={styles.content}>
        <div className={styles.header}>
          {isMobile ? (
            <MobileHeaderForTable
              title='Запросы на регистрацию'
              showMobileFilters={showMobileFilters}
              setShowMobileFilters={setShowMobileFilters}
              filters={registrationRequestFilters}
              debouncedStatus={debouncedStatus}
              handleButtonClick={handleButtonClick}
              createStatusForBtns={createStatusForRegistrationRequestFilters}
            />
          ) : (
            <h1 className={styles.title}>Запросы на регистрацию</h1>
          )}
        </div>
      </div>
      <Table
        isLoading={isLoading}
        data={dummyData(registrationRequests.requests)}
        pageSize={requestsPerPage}
        totalCountPages={registrationRequests.totalCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        columns={[
          'Название организации',
          'ФИО контактного лица',
          'Телефон контактного лица',
          'Роль',
          'Статус запроса',
        ]}
        filtersTitles={{
          firstBtnTitle: 'Все',
          secondBtnTitle: 'В ожидании',
          thirdBtnTitle: 'Отклонены',
          fourthBtnTitle: 'Приняты',
        }}
        onActiveCurrentCard={onActiveCurrentRequestCard}
        handleFirstFilterButtonClick={handleButtonClick}
        handleSecondFilterButtonClick={handleButtonClick}
        handleThirdFilterButtonClick={handleButtonClick}
        handleFourthFilterButtonClick={handleButtonClick}
        search={search}
        setSearch={setSearch}
        debouncedStatus={debouncedStatus}
      />
      <Footer />
    </div>
  )
}

export default RequestForRegistrationPage
