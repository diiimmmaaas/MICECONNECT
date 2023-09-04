import React, { useCallback, useEffect, useState } from 'react'
import styles from './CompanyManagementPage.module.css'
import p from '../AdministratorsManagementPage/AdministratorsManagementPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import plusIcon from '../../assets/icons/plus.svg'
import Table from '../../components/Table/Table'
import Footer from '../../components/Footer/Footer'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import { TableItem } from '../../types'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import CreateCompany from '../../components/CreateCompany/CreateCompany'
import { useMediaQuery } from 'react-responsive'
import Loader from '../../components/UI/Loader/Loader'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getCompanies } from '../../redux/actions/companiesAction'
import { CompaniesType } from '../../redux/actions/types'
import {
  createRoleCompanyFromEnToRu,
  createStatusForCompanyFilters,
} from '../../utils/createRoleForRegister'
import { useRequestStatus } from '../../hooks/useRequestStatus'
import { useDebounce } from '../../hooks/useDebounce'
import SearchMobileComponent from '../../components/UI/SearchMobileComponent/SearchMobileComponent'
import { companiesFilters, companiesPerPage } from '../../constants/constants'
import MobileHeaderForTable from '../../components/MobileHeaderForTable/MobileHeaderForTable'

const CompanyManagementPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState<string>('')
  const [companyStatus, setCompanyStatus] = useState<any>('')
  const [modal, setModal] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  const debouncedStatus = useRequestStatus(companyStatus)
  const debounced = useDebounce(search, 1000)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { token, userRole } = useAppSelector((state) => state.auth)

  const { isLoading, companies } = useAppSelector((state) => state.companies)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const handleButtonClick = useCallback(
    async (btnTitle: string) => {
      if (btnTitle === 'Все') {
        setCompanyStatus('')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Агент') {
        setCompanyStatus('directorAgent')
        setCurrentPage(1)
        return
      }
      if (btnTitle === 'Площадка') {
        setCompanyStatus('directorPlace')
        setCurrentPage(1)
        return
      }
    },
    [debouncedStatus],
  )

  const onActiveCurrentCompanyCard = (id: number) => {
    navigate(`${PATH.companyCardPage}${id}`)
  }

  const dummyData = (array: CompaniesType[]) => {
    const items: TableItem[] = array.map((company) => {
      return {
        id: company.id,
        firstColumn: company.name,
        secondColumn: company.contactFullName,
        thirdColumn: company.contactPhone,
        fourthColumn: createRoleCompanyFromEnToRu(company.role),
      }
    })
    return items
  }

  useEffect(() => {
    if (debounced) {
      dispatch(
        getCompanies({
          token,
          page: 1,
          itemsPerPage: companiesPerPage,
          role: debouncedStatus,
          search: debounced,
        }),
      )
    } else {
      dispatch(
        getCompanies({
          token,
          page: currentPage,
          itemsPerPage: companiesPerPage,
          role: debouncedStatus,
        }),
      )
    }
  }, [dispatch, currentPage, setCurrentPage, companiesPerPage, debounced, debouncedStatus])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.companyManagementPage}>
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
              title='Компании'
              showMobileFilters={showMobileFilters}
              setShowMobileFilters={setShowMobileFilters}
              filters={companiesFilters}
              debouncedStatus={debouncedStatus}
              handleButtonClick={handleButtonClick}
              createStatusForBtns={createStatusForCompanyFilters}
            />
          ) : (
            <h1 className={styles.title}>Компании</h1>
          )}
          {(userRole === 'superAdmin' || userRole === 'admin') && (
            <CustomButton
              className={styles.addSiteBtn}
              title='Добавить компанию'
              type='button'
              iconSrc={plusIcon}
              onClick={() => setModal(true)}
            />
          )}
        </div>
      </div>
      <Table
        isCompany
        isLoading={isLoading}
        data={dummyData(companies.companies)}
        pageSize={companiesPerPage}
        totalCountPages={companies.totalCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        columns={[
          'Название организации',
          'ФИО контактного лица',
          'Телефон контактного лица',
          'Роль',
        ]}
        filtersTitles={{
          firstBtnTitle: 'Все',
          secondBtnTitle: 'Агент',
          thirdBtnTitle: 'Площадка',
        }}
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
        <CreateCompany onClickHandler={() => setModal(false)} />
      </CustomModal>
    </div>
  )
}

export default CompanyManagementPage
