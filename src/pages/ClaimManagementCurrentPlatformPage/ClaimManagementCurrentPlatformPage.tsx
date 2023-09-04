import React, { useCallback, useEffect, useState } from 'react'
import styles from './ClaimManagementCurrentPlatformPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import plusIcon from '../../assets/icons/plus.svg'
import TableFilters from '../../components/TableFilters/TableFilters'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import CreateClaim from '../../components/CreateClaim/CreateClaim'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { claimsFilters, monthsArr } from '../../constants/constants'
import { getAllClaims, getCurrentClaimFromCurrentPlatform } from '../../redux/actions/claimsAction'
import Loader from '../../components/UI/Loader/Loader'
import { useParams } from 'react-router-dom'
import ClaimTable from '../../components/ClaimTable/ClaimTable'
import p from '../AdministratorsManagementPage/AdministratorsManagementPage.module.css'
import SearchMobileComponent from '../../components/UI/SearchMobileComponent/SearchMobileComponent'
import { useMediaQuery } from 'react-responsive'
import MobileHeaderForTable from '../../components/MobileHeaderForTable/MobileHeaderForTable'
import { createStatusForCompanyFilters } from '../../utils/createRoleForRegister'
import { useRequestStatus } from '../../hooks/useRequestStatus'
import { useDebounce } from '../../hooks/useDebounce'
import DeleteComponent from '../../components/DeleteComponent/DeleteComponent'

const ClaimManagementCurrentPlatformPage = () => {
  const [search, setSearch] = useState<string>('')
  const [createClaimModal, setCreateClaimModal] = useState(false)
  const [filtersModal, setFiltersModal] = useState(false)
  const [yearsAndMonth, setYearsAndMonth] = useState('2023-08')
  const [monthNumber, setMonthNumber] = useState<number>(7)
  const [claimStatus, setClaimStatus] = useState<any>('')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  const [claimError, setClaimError] = useState<string>('')
  const [checkedState, setCheckedState] = useState<string[]>([])
  const [weekMode, setWeekMode] = useState(false)

  const debouncedStatus = useRequestStatus(claimStatus)
  const debounced = useDebounce(search)

  const { platformId } = useParams<{ platformId: string }>()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const { token } = useAppSelector((state) => state.auth)

  const { isLoading, currentClaimFromCurrentPlace } = useAppSelector((state) => state.claims)

  const now = new Date()
  let month = now.getMonth()
  let year = now.getFullYear()

  const dispatch = useAppDispatch()

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
    },
    [debouncedStatus],
  )

  const onCheckMonthHandler = async (month: string, year: string) => {
    const monthLength = String(monthsArr.indexOf(month) + 1).length
    const date =
      monthLength === 1
        ? `${year}-0${monthsArr.indexOf(month) + 1}`
        : `${year}-${monthsArr.indexOf(month) + 1}`
    setYearsAndMonth(date)

    await dispatch(
      getCurrentClaimFromCurrentPlatform({
        token,
        yearsAndMonth: date,
        placeId: platformId,
      }),
    )
  }

  useEffect(() => {
    if (debounced) {
      dispatch(
        getCurrentClaimFromCurrentPlatform({
          yearsAndMonth,
          placeId: platformId,
          token,
          status: debouncedStatus,
          search: debounced,
        }),
      )
    } else {
      dispatch(
        getCurrentClaimFromCurrentPlatform({
          yearsAndMonth,
          placeId: platformId,
          token,
          status: debouncedStatus,
        }),
      )
    }
  }, [dispatch, yearsAndMonth, platformId, debouncedStatus, debounced])

  useEffect(() => {
    setYearsAndMonth(`${year}-0${month + 1}`)
    setMonthNumber(month)
  }, [dispatch, month, year])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.claimManagementCurrentPlatformPage}>
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
              title='Заявки площадки'
              showMobileFilters={showMobileFilters}
              setShowMobileFilters={setShowMobileFilters}
              filters={claimsFilters}
              debouncedStatus={debouncedStatus}
              handleButtonClick={handleButtonClick}
              createStatusForBtns={createStatusForCompanyFilters}
            />
          ) : (
            <h1 className={styles.title}>Заявки площадки</h1>
          )}
          <CustomButton
            className={styles.addSiteBtn}
            title='Создать заявку'
            type='button'
            iconSrc={plusIcon}
            onClick={() => setCreateClaimModal(true)}
          />
        </div>
        {!isMobile && (
          <TableFilters
            isCompany
            firstBtnTitle='Все'
            secondBtnTitle='Завершенные'
            thirdBtnTitle='В работе'
            handleFirstButtonClick={handleButtonClick}
            handleSecondButtonClick={handleButtonClick}
            handleThirdButtonClick={handleButtonClick}
            handleFourthButtonClick={handleButtonClick}
            setSearch={setSearch}
            search={search}
            debouncedStatus={debouncedStatus}
          />
        )}
        <div className={styles.content}>
          <ClaimTable
            fromCurrentPlatform
            yearsAndMonth={yearsAndMonth}
            onOpenClaimFilters={() => setFiltersModal(true)}
            monthNumber={monthNumber}
            setMonthNumber={setMonthNumber}
            claims={currentClaimFromCurrentPlace}
            onCheckMonthHandler={onCheckMonthHandler}
          />
        </div>
      </div>
      <CustomModal visible={createClaimModal} setVisible={setCreateClaimModal}>
        <CreateClaim onClickHandler={() => setCreateClaimModal(false)} />
      </CustomModal>
    </div>
  )
}

export default ClaimManagementCurrentPlatformPage
