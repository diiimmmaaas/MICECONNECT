import React, { useCallback, useEffect, useState } from 'react'
import styles from './AdministratorsManagementPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import plusIcon from '../../assets/icons/plus.svg'
import Footer from '../../components/Footer/Footer'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import Table from '../../components/Table/Table'
import CreateAdmin from '../../components/CreateAdmin/CreateAdmin'
import { TableItem } from '../../types'
import PATH from '../../navigation/path'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getAdmins } from '../../redux/actions/adminsAction'
import { AdminType } from '../../redux/actions/types'
import Loader from '../../components/UI/Loader/Loader'
import {
  createRoleForTable,
  createStatusForRegistrationRequestFilters,
} from '../../utils/createRoleForRegister'
import { useDebounce } from '../../hooks/useDebounce'
import SearchMobileComponent from '../../components/UI/SearchMobileComponent/SearchMobileComponent'
import { useRequestStatus } from '../../hooks/useRequestStatus'
import { adminFilters, adminsPerPage } from '../../constants/constants'
import MobileHeaderForTable from '../../components/MobileHeaderForTable/MobileHeaderForTable'

const AdministratorsManagementPage = () => {
  const [search, setSearch] = useState<string>('')
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [adminStatus, setAdminStatus] = useState<any>('')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  const debouncedStatus = useRequestStatus(adminStatus)
  const debounced = useDebounce(search)

  const { isLoading, admins } = useAppSelector((state) => state.admins)
  const { token } = useAppSelector((state) => state.auth)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const handleButtonClick = useCallback(
    async (btnTitle: string) => {
      if (btnTitle === 'Все') {
        setAdminStatus('')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Администратор') {
        setAdminStatus('admin')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Суперадминистратор') {
        setAdminStatus('superAdmin')
        setCurrentPage(1)
        return
      }
    },
    [debouncedStatus],
  )

  const onActiveCurrentAdminCard = (id: number) => {
    navigate(`${PATH.adminCardPage}${id}`)
  }

  const dummyData = (array: AdminType[]) => {
    const items: TableItem[] = array.map((admin) => {
      return {
        id: admin.id,
        firstColumn: admin.fullName,
        secondColumn: admin.phone,
        thirdColumn: admin.email,
        fourthColumn: createRoleForTable(admin.role),
      }
    })
    return items
  }

  useEffect(() => {
    if (debounced) {
      dispatch(
        getAdmins({
          token,
          page: 1,
          itemsPerPage: adminsPerPage,
          role: debouncedStatus,
          search: debounced,
        }),
      )
    } else {
      dispatch(
        getAdmins({
          token,
          page: currentPage,
          itemsPerPage: adminsPerPage,
          role: debouncedStatus,
        }),
      )
    }
  }, [dispatch, token, currentPage, setCurrentPage, adminsPerPage, debounced, debouncedStatus])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.administratorsManagementPage}>
      <Navbar />
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
              title='Администраторы'
              showMobileFilters={showMobileFilters}
              setShowMobileFilters={setShowMobileFilters}
              filters={adminFilters}
              debouncedStatus={debouncedStatus}
              handleButtonClick={handleButtonClick}
              createStatusForBtns={createStatusForRegistrationRequestFilters}
            />
          ) : (
            <h1 className={styles.title}>Администраторы</h1>
          )}
          <CustomButton
            className={styles.addSiteBtn}
            title='Добавить администратора'
            type='button'
            iconSrc={plusIcon}
            onClick={() => setModal(true)}
          />
        </div>
      </div>
      <Table
        isLoading={isLoading}
        data={dummyData(admins.users)}
        pageSize={adminsPerPage}
        totalCountPages={admins.totalCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        columns={['ФИО', 'Номер телефона', 'Электронная почта', 'Роль']}
        filtersTitles={{
          firstBtnTitle: 'Все',
          secondBtnTitle: 'Администратор',
          thirdBtnTitle: 'Суперадминистратор',
        }}
        onActiveCurrentCard={onActiveCurrentAdminCard}
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
        <CreateAdmin onClickHandler={() => setModal(false)} />
      </CustomModal>
    </div>
  )
}

export default AdministratorsManagementPage
