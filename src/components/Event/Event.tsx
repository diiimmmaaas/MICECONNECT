import React, { FC } from 'react'
import styles from './Event.module.css'
import { ImageType } from '../../pages/MainPage/MainPage'
import personCountIcon from '../../assets/icons/event-user.svg'
import { Slide } from 'react-slideshow-image'
import './Event.css'
import { useNavigate, Link } from 'react-router-dom'
import PATH from '../../navigation/path'
import arrowPrev from '../../assets/icons/arrowLeft.svg'
import arrowNext from '../../assets/icons/arrowRight.svg'
import noImage from '../../assets/img/no-image.jpg'

export type EventPropsType = {
  fromMainPage?: boolean
  id: number
  images: ImageType[]
  title: string
  subTitle: string
  numberOfPerson: string
  bookingData?: {
    city: string
    startDate: string
    finishDate: string
    startTime: string
    finishTime: string
    guestsNumber: string
    titlePage: string
  } | null
}

const Event: FC<EventPropsType> = ({
  fromMainPage,
  id,
  images,
  title,
  subTitle,
  numberOfPerson,
  bookingData,
}) => {
  const navigate = useNavigate()

  const onActiveCurrentEvent = () => {
    navigate(`${PATH.platformCardPage}${id}`, {
      state: { bookingData, fromMainPage },
    })
  }

  const properties = {
    duration: 5000,
    autoplay: false,
    transitionDuration: 500,
    arrows: true,
    infinite: true,
    easing: 'ease',
    indicators: () => <div className='sliderIndicator'></div>,
    prevArrow: (
      <div className={styles.arrowPrevBlock}>
        <img className={styles.arrowPrev} src={arrowPrev} alt='arrowPrev' />
      </div>
    ),
    nextArrow: (
      <div className={styles.arrowNextBlock}>
        <img className={styles.arrowNext} src={arrowNext} alt='arrowNext' />
      </div>
    ),
  }

  return (
    <div className={styles.event}>
      <div className={styles.slider}>
        {images.length !== 0 ? (
          <Slide {...properties} cssClass='sliderContainer'>
            {images.map((slideImage, index) => {
              return (
                <div
                  key={index}
                  className={styles.slideImage}
                  style={{ backgroundImage: `url("${slideImage.src}")`, zIndex: 0 }}
                ></div>
              )
            })}
          </Slide>
        ) : (
          <div className={styles.slideImage}>
            <img className={styles.slideImage} src={noImage} alt='noImage' />
          </div>
        )}
      </div>
      <div className={styles.eventDescriptionBlock} onClick={onActiveCurrentEvent}>
        <h2 className={styles.title}>{title}</h2>
        <h3 className={styles.subTitle}>{subTitle}</h3>
        <div className={styles.personCount}>
          <img className={styles.personCountIcon} src={personCountIcon} alt='personCountIcon' />
          <p className={styles.personCountText}>{`до ${numberOfPerson} человек`}</p>
        </div>
      </div>
    </div>
  )
}

export default Event
