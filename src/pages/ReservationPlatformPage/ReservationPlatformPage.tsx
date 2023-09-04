import React from 'react'
import styles from './ReservationPlatformPage.module.css'
import SearchPanel from '../../components/SearchPanel/SearchPanel'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import noImage from '../../assets/img/no-image.jpg'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useAppSelector } from '../../redux/types/types'

const ReservationPlatformPage = () => {
  const isMobile = useMediaQuery({ query: '(min-width: 767px)' })

  const { claimsDataForCheck } = useAppSelector((state) => state.claims)

  const startDate = claimsDataForCheck.startDate.slice(0, 10).split('-').reverse().join('.')
  const endDate = claimsDataForCheck.endDate.slice(0, 10).split('-').reverse().join('.')

  const startTime = claimsDataForCheck.startDate.slice(11, 16)
  const endTime = claimsDataForCheck.endDate.slice(11, 16)

  const navigate = useNavigate()

  const onNavigateToMainPage = () => {
    navigate('/')
  }

  return (
    <div className={styles.reservationStatusPage}>
      <Navbar>
        <SearchPanel currentPage={1} />
      </Navbar>
      <div className={styles.content}>
        <h1 className={styles.title}>Спасибо, вы забронировали площадку!</h1>
        <div className={styles.container}>
          <div className={styles.topBlock}>
            <img
              className={styles.reservationImg}
              src={
                claimsDataForCheck?.place?.images.length !== 0
                  ? `${process.env.REACT_APP_BASE_URL_IMAGES}${claimsDataForCheck?.place?.images[0]}`
                  : noImage
              }
              alt='reservImg'
            />
            <div className={styles.reservationShortInformationBlock}>
              <h2 className={styles.subTitle}>{claimsDataForCheck.place.name}</h2>
              <p className={styles.description}>
                {`${claimsDataForCheck.place.city} ${claimsDataForCheck.place.address}`}
              </p>
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.bottomBlock}>
            <h2 className={styles.detailsTitle}>Детали брони</h2>
            <div className={styles.detailsBlock}>
              <div className={styles.detailsDescription}>
                <p className={styles.detailsText}>Дата и время начала:</p>
                <p className={styles.detailsValue}>{`${startDate} ${startTime}`}</p>
              </div>
              <div className={styles.detailsDescription}>
                <p className={styles.detailsText}>Дата и время окончания:</p>
                <p className={styles.detailsValue}>{`${endDate} ${endTime}`}</p>
              </div>
              <div className={styles.detailsDescription}>
                <p className={styles.detailsText}>Количество гостей:</p>
                <p className={styles.detailsValue}>{claimsDataForCheck.peopleCount} человек</p>
              </div>
            </div>
          </div>
        </div>
        <CustomButton
          title='Вернуться на главную'
          className={styles.btn}
          onClick={onNavigateToMainPage}
        />
      </div>
      {isMobile && <Footer />}
    </div>
  )
}

export default ReservationPlatformPage
