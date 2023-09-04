import React, { useCallback, useEffect, useState } from 'react'
import styles from './ClaimManagementPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import plusIcon from '../../assets/icons/plus.svg'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import TableFilters from '../../components/TableFilters/TableFilters'
import CreateClaim from '../../components/CreateClaim/CreateClaim'
import ClaimTable from '../../components/ClaimTable/ClaimTable'
import ClaimFilters from '../../components/ClaimFilters/ClaimFilters'
import { useMediaQuery } from 'react-responsive'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getAllClaims, getAllClaimsFromPlatforms } from '../../redux/actions/claimsAction'
import Loader from '../../components/UI/Loader/Loader'
import { claimsFilters, monthsArr } from '../../constants/constants'
import SearchMobileComponent from '../../components/UI/SearchMobileComponent/SearchMobileComponent'
import p from '../AdministratorsManagementPage/AdministratorsManagementPage.module.css'
import { createStatusForCompanyFilters } from '../../utils/createRoleForRegister'
import MobileHeaderForTable from '../../components/MobileHeaderForTable/MobileHeaderForTable'
import { useRequestStatus } from '../../hooks/useRequestStatus'
import { getPlaces, getPlacesFromCompany } from '../../redux/actions/placesAction'
import { useDebounce } from '../../hooks/useDebounce'
import { waitTimer } from '../../utils/waitTimer'
import { getMe } from '../../redux/actions/meAction'

const ClaimManagementPage = () => {
  const [search, setSearch] = useState<string>('')
  const [createClaimModal, setCreateClaimModal] = useState(false)
  const [filtersModal, setFiltersModal] = useState(false)
  const [yearsAndMonth, setYearsAndMonth] = useState('2023-09')
  const [monthNumber, setMonthNumber] = useState<number>(8)
  const [claimStatus, setClaimStatus] = useState<any>('')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  const [claimError, setClaimError] = useState<string>('')
  const [checkedState, setCheckedState] = useState<string[]>([])

  const debouncedStatus = useRequestStatus(claimStatus)
  const debounced = useDebounce(search)

  const { isLoading, allClaims, allClaimsFromPlaces } = useAppSelector((state) => state.claims)
  const { places } = useAppSelector((state) => state.places)
  const { meData } = useAppSelector((state) => state.me)

  const { token, userRole, user } = useAppSelector((state) => state.auth)

  const now = new Date()
  let month = now.getMonth()
  let year = now.getFullYear()

  const dispatch = useAppDispatch()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const handleButtonClick = useCallback(
    async (btnTitle: string) => {
      if (btnTitle === 'Все') {
        setClaimStatus('')
        return
      }
      if (btnTitle === 'Завершенные') {
        setClaimStatus('accepted')
        return
      }
      if (btnTitle === 'В работе') {
        setClaimStatus('inProgress')
        return
      }
      if (btnTitle === 'Отклонены') {
        setClaimStatus('rejected')
        return
      }
    },
    [debouncedStatus],
  )

  const onCheckFilters = async (checkedFilters: string[]) => {
    if (userRole === 'directorPlace' || userRole === 'employeePlace') {
      const resultAction = await dispatch(
        getAllClaimsFromPlatforms({
          companyId: String(user.employee.company?.id),
          yearsAndMonth,
          token,
          status: debouncedStatus,
          places: checkedFilters.join(','),
        }),
      )

      if (getAllClaimsFromPlatforms.rejected.match(resultAction)) {
        setClaimError(
          'Произошла ошибка при выборе площадок. Попробуйте перезагрузить' +
            ' страницу и попробовать еще раз',
        )
        waitTimer(() => setClaimError(''))
      } else {
        setClaimError('')
        setFiltersModal(false)
      }
    } else {
      const resultAction = await dispatch(
        getAllClaimsFromPlatforms({
          yearsAndMonth,
          token,
          status: debouncedStatus,
          places: checkedFilters.join(','),
        }),
      )

      if (getAllClaimsFromPlatforms.rejected.match(resultAction)) {
        setClaimError(
          'Произошла ошибка при выборе площадок. Попробуйте перезагрузить' +
            ' страницу и попробовать еще раз',
        )
        waitTimer(() => setClaimError(''))
      } else {
        setClaimError('')
        setFiltersModal(false)
      }
    }
  }

  const onCheckMonthHandler = async (month: string, year: string) => {
    const monthLength = String(monthsArr.indexOf(month) + 1).length
    const date =
      monthLength === 1
        ? `${year}-0${monthsArr.indexOf(month) + 1}`
        : `${year}-${monthsArr.indexOf(month) + 1}`
    setYearsAndMonth(date)

    if (userRole === 'directorPlace' || userRole === 'employeePlace') {
      await dispatch(
        getAllClaimsFromPlatforms({
          companyId: String(user.employee.company?.id),
          yearsAndMonth: date,
          token,
        }),
      )
    } else {
      await dispatch(getAllClaimsFromPlatforms({ yearsAndMonth: date, token }))
    }
    dispatch(
      getPlaces({
        token,
        page: 1,
        itemsPerPage: 100,
      }),
    )
  }

  useEffect(() => {
    if (userRole !== 'superAdmin' && userRole !== 'admin') {
      dispatch(getMe({ token }))
    }
  }, [dispatch, token])

  useEffect(() => {
    if (userRole === 'directorPlace' || userRole === 'employeePlace') {
      if (debounced) {
        dispatch(
          getAllClaimsFromPlatforms({
            companyId: String(user.employee.company?.id),
            yearsAndMonth,
            token,
            status: debouncedStatus,
            search: debounced,
          }),
        )
      } else {
        dispatch(
          getAllClaimsFromPlatforms({
            companyId: String(user.employee.company?.id),
            yearsAndMonth,
            token,
            status: debouncedStatus,
          }),
        )
      }
    } else {
      if (debounced) {
        dispatch(
          getAllClaimsFromPlatforms({
            yearsAndMonth,
            token,
            status: debouncedStatus,
            search: debounced,
          }),
        )
      } else {
        dispatch(getAllClaimsFromPlatforms({ yearsAndMonth, token, status: debouncedStatus }))
      }
    }
  }, [dispatch, yearsAndMonth, debouncedStatus, debounced, meData])

  useEffect(() => {
    if (userRole !== 'superAdmin' && userRole !== 'admin') {
      dispatch(
        getPlaces({
          token,
          page: 1,
          itemsPerPage: 100,
        }),
      )
    } else {
      dispatch(
        getPlaces({
          token,
          page: 1,
          itemsPerPage: 100,
        }),
      )
    }
  }, [dispatch])

  useEffect(() => {
    setYearsAndMonth(`${year}-0${month + 1}`)
    setMonthNumber(month)
  }, [dispatch, month, year])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.claimManagementPage}>
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
      <div className={styles.container}>
        <div className={styles.header}>
          {isMobile ? (
            <MobileHeaderForTable
              title='Заявки площадок'
              showMobileFilters={showMobileFilters}
              setShowMobileFilters={setShowMobileFilters}
              filters={claimsFilters}
              debouncedStatus={debouncedStatus}
              handleButtonClick={handleButtonClick}
              createStatusForBtns={createStatusForCompanyFilters}
            />
          ) : (
            <h1 className={styles.title}>Заявки площадок</h1>
          )}
          {userRole !== 'directorPlace' && userRole !== 'employeePlace' && (
            <CustomButton
              className={styles.addSiteBtn}
              title='Создать заявку'
              type='button'
              iconSrc={plusIcon}
              onClick={() => setCreateClaimModal(true)}
            />
          )}
        </div>
        {!isMobile && (
          <TableFilters
            isCompany
            firstBtnTitle='Все'
            secondBtnTitle='Завершенные'
            thirdBtnTitle='В работе'
            fourthBtnTitle='Отклонены'
            handleFirstButtonClick={handleButtonClick}
            handleSecondButtonClick={handleButtonClick}
            handleThirdButtonClick={handleButtonClick}
            handleFourthButtonClick={handleButtonClick}
            search={search}
            setSearch={setSearch}
            debouncedStatus={debouncedStatus}
          />
        )}
        <div className={styles.content}>
          <ClaimTable
            yearsAndMonth={yearsAndMonth}
            monthNumber={monthNumber}
            setMonthNumber={setMonthNumber}
            onOpenClaimFilters={() => setFiltersModal(true)}
            claims={allClaimsFromPlaces}
            onCheckMonthHandler={onCheckMonthHandler}
          />
        </div>
      </div>
      <CustomModal visible={createClaimModal} setVisible={setCreateClaimModal}>
        <CreateClaim onClickHandler={() => setCreateClaimModal(false)} />
      </CustomModal>
      <CustomModal visible={filtersModal} setVisible={setFiltersModal}>
        <ClaimFilters
          error={claimError}
          checkedState={checkedState}
          setCheckedState={setCheckedState}
          onClickHandler={() => setFiltersModal(false)}
          platforms={places.places}
          callback={onCheckFilters}
        />
      </CustomModal>
    </div>
  )
}

export default ClaimManagementPage
