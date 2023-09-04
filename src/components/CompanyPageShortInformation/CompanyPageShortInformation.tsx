import React, { FC } from 'react'
import styles from './CompanyPageShortInformation.module.css'
import { CompaniesType } from '../../redux/actions/types'

export type CompanyPageShortInformationPropsType = {
  companyData: CompaniesType
}

const CompanyPageShortInformation: FC<CompanyPageShortInformationPropsType> = ({ companyData }) => {
  return (
    <div className={styles.shortInformationBlock}>
      <h2 className={styles.title}>Краткая информация:</h2>
      <div className={styles.container}>
        <div className={styles.leftBlock}>
          <div className={styles.cityBlock}>
            <p className={styles.cityTitle}>Город:</p>
            <p className={styles.cityName}>{companyData.city}</p>
          </div>
          <div className={styles.cityBlock}>
            <p className={styles.cityTitle}>Адрес:</p>
            <p className={styles.cityName}>{companyData.address}</p>
          </div>
        </div>
        <div className={styles.rightBlock}>
          <div className={styles.companyNameBlock}>
            <p className={styles.companyNameTitle}>Телефон:</p>
            <p className={styles.companyName}>{companyData.contactPhone}</p>
          </div>
          <div className={styles.capacityBlock}>
            <p className={styles.capacityTitle}>E-mail: </p>
            <p className={styles.capacityName}>{companyData.email}</p>
          </div>
        </div>
      </div>
      <div className={styles.line}></div>
    </div>
  )
}

export default CompanyPageShortInformation
