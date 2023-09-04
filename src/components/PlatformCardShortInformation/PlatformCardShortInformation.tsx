import React, { FC } from 'react'
import styles from './PlatformCardShortInformation.module.css'
import { PlaceType } from '../../redux/actions/types'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'

export type PlatformCardShortInformationPropsType = {
  platformData: PlaceType
}

const PlatformCardShortInformation: FC<PlatformCardShortInformationPropsType> = ({
  platformData,
}) => {
  const navigate = useNavigate()

  const redirectToCompanyCard = () => {
    navigate(`${PATH.companyPage}${platformData.company.id}`)
  }

  return (
    <div className={styles.shortInformationBlock}>
      <h2 className={styles.title}>Краткая информация:</h2>
      <div className={styles.container}>
        <div className={styles.leftBlock}>
          <div className={styles.cityBlock}>
            <p className={styles.cityTitle}>Город:</p>
            <p className={styles.cityName}>{platformData.city}</p>
          </div>
          <div className={styles.cityBlock}>
            <p className={styles.cityTitle}>Адрес:</p>
            <p className={styles.cityName}>{platformData.address}</p>
          </div>
        </div>
        <div className={styles.rightBlock}>
          <div className={styles.companyNameBlock}>
            <p className={styles.companyNameTitle}>Компания:</p>
            <p className={styles.companyName} onClick={redirectToCompanyCard}>
              {platformData.company.name}
            </p>
          </div>
          <div className={styles.capacityBlock}>
            <p className={styles.capacityTitle}>Вместимость: </p>
            <p className={styles.capacityName}>{`${platformData.size} человек(а)`}</p>
          </div>
        </div>
      </div>
      <div className={styles.line}></div>
    </div>
  )
}

export default PlatformCardShortInformation
