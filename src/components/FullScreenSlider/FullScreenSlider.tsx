import React, { FC } from 'react'
import styles from './FullScreenSlider.module.css'
import { Fade, Slide } from 'react-slideshow-image'
import { ImagesDataType } from '../ImageCarousel/ImageCarousel'
import closeIcon from '../../assets/icons/close.svg'

export type FullScreenSliderPropsType = {
  imagesData: ImagesDataType[]
  setVisibleModal: (visible: boolean) => void
}

const FullScreenSlider: FC<FullScreenSliderPropsType> = ({ imagesData, setVisibleModal }) => {
  const properties = {
    duration: 2000,
    autoplay: false,
    transitionDuration: 1000,
    arrows: true,
    infinite: false,
    easing: 'ease',
  }

  return (
    <div className={styles.fullScreenSlider}>
      <div className={styles.headerBlock}>
        <div className={styles.iconContainer} onClick={() => setVisibleModal(false)}>
          <img className={styles.exitIcon} src={closeIcon} alt='closeIcon' />
        </div>
      </div>

      <div className={styles.slider}>
        <Slide {...properties}>
          {imagesData.map((img, ind) => {
            return (
              <div key={ind + 1} className={styles.slideImagesContainer}>
                <img className={styles.oneImage} src={img.src} alt='little_img' />
              </div>
            )
          })}
        </Slide>
      </div>
    </div>
  )
}

export default FullScreenSlider
