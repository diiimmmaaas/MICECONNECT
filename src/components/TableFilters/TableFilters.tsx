import React, { FC } from 'react'
import styles from './TableFilters.module.css'
import CustomButton from '../UI/CustomButton/CustomButton'
import glassIcon from '../../assets/icons/glass.svg'
import { FiltersTitlesForTable } from '../../types'
import {
  createStatusForCompanyFilters,
  createStatusForRegistrationRequestFilters,
} from '../../utils/createRoleForRegister'

export type TableFiltersPropsType = FiltersTitlesForTable & {
  isPlatforms?: boolean
  isCompany?: boolean
  handleFirstButtonClick: (title: string) => void
  handleSecondButtonClick: (title: string) => void
  handleThirdButtonClick: (title: string) => void
  handleFourthButtonClick: (title: string) => void
  debouncedStatus?: string
  search: string
  setSearch: (searchItem: string) => void
}

const TableFilters: FC<TableFiltersPropsType> = ({
  isPlatforms,
  isCompany,
  firstBtnTitle,
  secondBtnTitle,
  thirdBtnTitle,
  fourthBtnTitle,
  handleFirstButtonClick,
  handleSecondButtonClick,
  handleThirdButtonClick,
  handleFourthButtonClick,
  debouncedStatus,
  search,
  setSearch,
}) => {
  const handleSearch = (e: any) => {
    setSearch(e.target.value)
  }

  return (
    <div className={styles.tableFilters}>
      {!isPlatforms ? (
        <>
          <div className={styles.tableControlBlock}>
            {isCompany ? (
              <div className={styles.tableBtns}>
                <CustomButton
                  onClick={() => handleFirstButtonClick(firstBtnTitle)}
                  title={firstBtnTitle}
                  className={
                    createStatusForCompanyFilters(debouncedStatus) === firstBtnTitle
                      ? `${styles.filtersAllBtn} ${styles.active}`
                      : styles.filtersAllBtn
                  }
                />
                <CustomButton
                  onClick={() => handleSecondButtonClick(secondBtnTitle)}
                  title={secondBtnTitle}
                  className={
                    createStatusForCompanyFilters(debouncedStatus) === secondBtnTitle
                      ? `${styles.filtersBtn} ${styles.active}`
                      : styles.filtersBtn
                  }
                />
                <CustomButton
                  onClick={() => handleThirdButtonClick(thirdBtnTitle)}
                  title={thirdBtnTitle}
                  className={
                    createStatusForCompanyFilters(debouncedStatus) === thirdBtnTitle
                      ? `${styles.filtersBtn} ${styles.active}`
                      : styles.filtersBtn
                  }
                />
                {fourthBtnTitle && (
                  <CustomButton
                    onClick={() => handleFourthButtonClick(fourthBtnTitle)}
                    title={fourthBtnTitle}
                    className={
                      createStatusForCompanyFilters(debouncedStatus) === fourthBtnTitle
                        ? `${styles.filtersBtn} ${styles.active}`
                        : styles.filtersBtn
                    }
                  />
                )}
              </div>
            ) : (
              <div className={styles.tableBtns}>
                <CustomButton
                  onClick={() => handleFirstButtonClick(firstBtnTitle)}
                  title={firstBtnTitle}
                  className={
                    createStatusForRegistrationRequestFilters(debouncedStatus) === firstBtnTitle
                      ? `${styles.filtersAllBtn} ${styles.active}`
                      : styles.filtersAllBtn
                  }
                />
                <CustomButton
                  onClick={() => handleSecondButtonClick(secondBtnTitle)}
                  title={secondBtnTitle}
                  className={
                    createStatusForRegistrationRequestFilters(debouncedStatus) === secondBtnTitle
                      ? `${styles.filtersBtn} ${styles.active}`
                      : styles.filtersBtn
                  }
                />
                <CustomButton
                  onClick={() => handleThirdButtonClick(thirdBtnTitle)}
                  title={thirdBtnTitle}
                  className={
                    createStatusForRegistrationRequestFilters(debouncedStatus) === thirdBtnTitle
                      ? `${styles.filtersBtn} ${styles.active}`
                      : styles.filtersBtn
                  }
                />
                {fourthBtnTitle && (
                  <CustomButton
                    onClick={() => handleFourthButtonClick(fourthBtnTitle)}
                    title={fourthBtnTitle}
                    className={
                      createStatusForRegistrationRequestFilters(debouncedStatus) === fourthBtnTitle
                        ? `${styles.filtersBtn} ${styles.active}`
                        : styles.filtersBtn
                    }
                  />
                )}
              </div>
            )}
          </div>
          <form
            className={styles.tableSearch}
            autoComplete={'off'}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              name='name'
              type='text'
              autoComplete='off'
              className={styles.input}
              placeholder='Поиск...'
              value={search}
              onChange={handleSearch}
            />
            <div className={styles.glassBlock}>
              <img className={styles.glassIcon} src={glassIcon} alt='glass' />
            </div>
          </form>
        </>
      ) : (
        <>
          <div></div>
          <form
            className={styles.tableSearch}
            autoComplete={'off'}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              name='name'
              type='text'
              autoComplete='off'
              className={styles.input}
              placeholder='Поиск...'
              value={search}
              onChange={handleSearch}
            />
            <div className={styles.glassBlock}>
              <img className={styles.glassIcon} src={glassIcon} alt='glass' />
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default TableFilters
