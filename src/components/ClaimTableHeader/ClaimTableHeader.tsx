import React, { FC } from 'react'
import styles from './ClaimTableHeader.module.css'
import leftArrowIcon from '../../assets/icons/arrowLeft.svg'
import rightArrowIcon from '../../assets/icons/arrowRight.svg'
import filtersIcon from '../../assets/icons/filters.svg'
import SwipeCheckbox from '../UI/SwipeCheckbox/SwipeCheckbox'
import CustomButton from '../UI/CustomButton/CustomButton'
import { useMediaQuery } from 'react-responsive'

export type ClaimTableHeaderPropsType = {
  weekMode: boolean
  fromCurrentPlatform?: boolean
  yearsAndMonth: string
  onOpenClaimFilters: () => void
  onPrevClickHandler: () => void
  onNextClickHandler: () => void
  onSwipeHandler: (checked: boolean) => void
  currentDate: {
    month: string
    year: number
  }
}

const ClaimTableHeader: FC<ClaimTableHeaderPropsType> = ({
  weekMode,
  fromCurrentPlatform,
  yearsAndMonth,
  onOpenClaimFilters,
  onPrevClickHandler,
  onNextClickHandler,
  onSwipeHandler,
  currentDate,
}) => {
  const onChangeClaimFilter = (checked: boolean) => {
    onSwipeHandler(checked)
  }
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  return (
    <div className={styles.claimTableHeader}>
      <div className={styles.container}>
        {!weekMode ? (
          <div className={styles.leftBlock}>
            <h2 className={styles.dateBlock}>{`${currentDate.month}, ${yearsAndMonth.slice(
              0,
              4,
            )}`}</h2>
            <div className={styles.dateControlBlock}>
              <div className={styles.leftArrowBlock} onClick={onPrevClickHandler}>
                <img className={styles.leftArrowIcon} src={leftArrowIcon} alt='leftArrowIcon' />
              </div>
              <div className={styles.rightArrowBlock} onClick={onNextClickHandler}>
                <img className={styles.rightArrowIcon} src={rightArrowIcon} alt='rightArrowIcon' />
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {!isMobile && (
          <div className={styles.rightBlock}>
            {/* <SwipeCheckbox */}
            {/*   id='monthAndWeek' */}
            {/*   name='monthAndWeek' */}
            {/*   onChangeHandler={onChangeClaimFilter} */}
            {/*   classNameInput={styles.swipeInput} */}
            {/*   classNameLabel={styles.swipeLabel} */}
            {/* /> */}
            {!fromCurrentPlatform && (
              <CustomButton
                title='Фильтры'
                iconSrc={filtersIcon}
                className={styles.filtersBtn}
                onClick={onOpenClaimFilters}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClaimTableHeader
