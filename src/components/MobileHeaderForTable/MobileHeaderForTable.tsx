import React, { FC } from 'react'
import styles from './MobileHeaderForTable.module.css'
import filtersIcon from '../../assets/icons/filtersIcon.svg'

export type MobileHeaderForTablePropsType = {
  title: string
  showMobileFilters: boolean
  setShowMobileFilters: (showMobileFilters: boolean) => void
  filters: string[]
  debouncedStatus: string
  handleButtonClick: (btnTitle: string) => void
  createStatusForBtns: (status: string) => string
}

const MobileHeaderForTable: FC<MobileHeaderForTablePropsType> = ({
  title,
  showMobileFilters,
  setShowMobileFilters,
  filters,
  debouncedStatus,
  handleButtonClick,
  createStatusForBtns,
}) => {
  return (
    <div className={styles.headerBlock}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        <div
          className={styles.filtersIconBlock}
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <img className={styles.filtersIcon} src={filtersIcon} alt='filtersIcon' />
        </div>
      </div>
      {showMobileFilters && (
        <div className={styles.filtersBlock}>
          {filters.map((filter, index) => {
            return (
              <div
                className={
                  createStatusForBtns(debouncedStatus) === filter
                    ? `${styles.filter} ${styles.active}`
                    : styles.filter
                }
                key={index}
                onClick={() => handleButtonClick(filter)}
              >
                <span className={styles.filterText}>{filter}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MobileHeaderForTable
