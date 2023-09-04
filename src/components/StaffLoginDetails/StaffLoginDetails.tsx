import React, { FC } from 'react'
import styles from './StaffLoginDetails.module.css'
import InformationItem from '../InformationItem/InformationItem'
import dotIcon from '../../assets/icons/dot.svg'
import { StaffType } from '../../redux/actions/types'
import { createRoleForTable } from '../../utils/createRoleForRegister'

export type StaffLoginDetailsPropsType = {
  staffData: StaffType
}

const StaffLoginDetails: FC<StaffLoginDetailsPropsType> = ({ staffData }) => {
  return (
    <div className={styles.loginDetailsBlock}>
      <div className={styles.loginDetailsHeader}>
        <h2 className={styles.loginDetailsTitle}>Данные для входа</h2>
      </div>
      <div className={styles.loginDetailsContainer}>
        <InformationItem title='Роль' value={createRoleForTable(staffData.user.role)} />
        <InformationItem title='Электронная почта/Логин' value={staffData.user.email} />
        <div className={styles.informationItem}>
          <div className={styles.title}>Пароль</div>
          <div className={styles.value}>
            <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
            <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
            <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
            <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
            <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
            <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffLoginDetails
