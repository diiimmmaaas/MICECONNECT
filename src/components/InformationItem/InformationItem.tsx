import React, { FC } from 'react'
import styles from './InformationItem.module.css'
import dateIcon from '../../assets/icons/calendar.svg'
import clockIcon from '../../assets/icons/clock.svg'
import { useMediaQuery } from 'react-responsive'

export type InformationItemPropsType = {
  notEdit?: boolean
  title: string
  value: string | undefined
  value2?: string | undefined
  classNameValue?: string
  isDateItem?: boolean
}

const InformationItem: FC<InformationItemPropsType> = ({
  notEdit,
  title,
  value,
  value2,
  classNameValue,
  isDateItem,
}) => {
  const isMobile = useMediaQuery({ query: '(min-width: 767px)' })

  return (
    <>
      {!isDateItem ? (
        <div className={styles.informationItem}>
          <div className={styles.title}>{title}</div>
          <div
            className={
              notEdit
                ? `${styles.notEditValue} ${classNameValue}`
                : `${styles.value} ${classNameValue}`
            }
          >
            {value}
          </div>
        </div>
      ) : (
        <div className={styles.informationItem}>
          <div className={styles.title}>{title}</div>
          <div className={styles.valuesBlock}>
            <div className={styles.firstValueBlock}>
              {isMobile && <img className={styles.icon} src={dateIcon} alt='dateIcon' />}
              <div className={notEdit ? styles.notEditValue : styles.value}>{value}</div>
            </div>
            <div className={styles.secondValueBlock}>
              {isMobile && <img className={styles.icon} src={clockIcon} alt='clockIcon' />}
              <div className={notEdit ? styles.notEditValue : styles.value}>{value2}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InformationItem
