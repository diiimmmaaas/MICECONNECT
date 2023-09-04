import React, { useCallback, useEffect, useState } from 'react'
import styles from './CompanyManagementStaffPage.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import PATH from '../../navigation/path'
import { TableItem } from '../../types'
import Navbar from '../../components/Navbar/Navbar'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import plusIcon from '../../assets/icons/plus.svg'
import Table from '../../components/Table/Table'
import Footer from '../../components/Footer/Footer'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import CreateStaff from '../../components/CreateStaff/CreateStaff'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useMediaQuery } from 'react-responsive'
import Loader from '../../components/UI/Loader/Loader'
import { getStaff } from '../../redux/actions/staffAction'
import { StaffType } from '../../redux/actions/types'
import {
  createRoleForTable,
  createStatusForRegistrationRequestFilters,
} from '../../utils/createRoleForRegister'
import { getCurrentCompany } from '../../redux/actions/companiesAction'
import { useRequestStatus } from '../../hooks/useRequestStatus'
import { useDebounce } from '../../hooks/useDebounce'
import SearchMobileComponent from '../../components/UI/SearchMobileComponent/SearchMobileComponent'
import { staffAgentFilters, staffPerPage, staffPlacesFilters } from '../../constants/constants'
import MobileHeaderForTable from '../../components/MobileHeaderForTable/MobileHeaderForTable'
import ProfileCategories from '../../components/ProfileCategories/ProfileCategories'

const CompanyManagementStaffPage = () => {
  const [search, setSearch] = useState<string>('')
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [staffStatus, setStaffStatus] = useState<any>('')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  const debouncedStatus = useRequestStatus(staffStatus)
  const debounced = useDebounce(search, 1000)

  const { currentCompany } = useAppSelector((state) => state.companies)
  const { token, user, userRole } = useAppSelector((state) => state.auth)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const { isLoading, staff } = useAppSelector((state) => state.staff)

  const { companyId } = useParams<{ companyId: string }>()

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onActiveCurrentCompanyCard = (id: number) => {
    navigate(`${PATH.companyStaffCardPage}${companyId}/${id}`)
  }

  const handleButtonClick = useCallback(
    async (btnTitle: string) => {
      if (btnTitle === 'Все') {
        setStaffStatus('')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Агент') {
        setStaffStatus('employeeAgent')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Площадка') {
        setStaffStatus('employeePlace')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Директор-Площадка') {
        setStaffStatus('directorPlace')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Директор-Агент') {
        setStaffStatus('directorAgent')
        setCurrentPage(1)
        return
      }
    },
    [debouncedStatus],
  )

  const dummyData = (array: StaffType[]) => {
    const items: TableItem[] = array.map((staff) => {
      return {
        id: staff.id,
        firstColumn: staff.company.name,
        secondColumn: staff.user.fullName,
        thirdColumn: staff.user.phone,
        fourthColumn: staff.user.email,
        fifthColumn: createRoleForTable(staff.user.role),
      }
    })
    return items
  }

  const foundObject = currentCompany.employees.find((item) => item.id === user.employee?.id)

  useEffect(() => {
    if (debounced) {
      dispatch(
        getStaff({
          companyId,
          token,
          page: 1,
          itemsPerPage: staffPerPage,
          role: debouncedStatus,
          search: debounced,
        }),
      )
    } else {
      dispatch(
        getStaff({
          companyId,
          token,
          page: currentPage,
          itemsPerPage: staffPerPage,
          role: debouncedStatus,
        }),
      )
    }
  }, [dispatch, companyId, currentPage, setCurrentPage, staffPerPage, debounced, debouncedStatus])

  useEffect(() => {
    dispatch(getCurrentCompany({ companyId, token }))
  }, [companyId, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.companyStaff}>
      <Navbar />
      <div className={styles.categoriesBlock}>
        <ProfileCategories
          categories={[
            { id: 1, title: 'Основная информация' },
            { id: 2, title: 'Сотрудники компании' },
          ]}
          activeLink={2}
          cardId={String(currentCompany.id)}
        />
      </div>
      {isMobile && (
        <div className={styles.searchMobileComponent}>
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
              title='Сотрудники компании'
              showMobileFilters={showMobileFilters}
              setShowMobileFilters={setShowMobileFilters}
              filters={
                currentCompany.role === 'directorAgent' ? staffAgentFilters : staffPlacesFilters
              }
              debouncedStatus={debouncedStatus}
              handleButtonClick={handleButtonClick}
              createStatusForBtns={createStatusForRegistrationRequestFilters}
            />
          ) : (
            <h1 className={styles.title}>Сотрудники компании</h1>
          )}
          {userRole !== 'employeeAgent' && userRole !== 'employeePlace' && (
            <CustomButton
              className={styles.addSiteBtn}
              title='Создать сотрудника'
              type='button'
              iconSrc={plusIcon}
              onClick={() => setModal(true)}
            />
          )}
        </div>
      </div>
      <Table
        isLoading={isLoading}
        data={dummyData(staff.employees)}
        pageSize={staffPerPage}
        totalCountPages={staff.totalCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        columns={['Компания', 'ФИО', 'Номер телефона', 'Электронная почта', 'Роль']}
        filtersTitles={
          currentCompany.role === 'directorAgent'
            ? {
                firstBtnTitle: 'Все',
                secondBtnTitle: 'Агент',
                thirdBtnTitle: 'Директор-Агент',
              }
            : {
                firstBtnTitle: 'Все',
                secondBtnTitle: 'Площадка',
                thirdBtnTitle: 'Директор-Площадка',
              }
        }
        onActiveCurrentCard={onActiveCurrentCompanyCard}
        handleFirstFilterButtonClick={handleButtonClick}
        handleSecondFilterButtonClick={handleButtonClick}
        handleThirdFilterButtonClick={handleButtonClick}
        handleFourthFilterButtonClick={handleButtonClick}
        search={search}
        setSearch={setSearch}
        debouncedStatus={debouncedStatus}
      />
      <Footer />
      <CustomModal visible={modal} setVisible={setModal}>
        <CreateStaff onClickHandler={() => setModal(false)} />
      </CustomModal>
    </div>
  )
}

export default CompanyManagementStaffPage
