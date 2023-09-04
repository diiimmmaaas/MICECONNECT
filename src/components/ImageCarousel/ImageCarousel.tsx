import React, { FC, useState } from 'react'
import Modal from 'react-modal'
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'
import styles from './ImageCarousel.module.css'
import { useMediaQuery } from 'react-responsive'
import { sliceImagesForCarousel } from '../../utils/sliceImagesForCarousel'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import closeIcon from '../../assets/icons/close.svg'
import leftArrow from '../../assets/icons/arrowLeft.svg'
import rightArrow from '../../assets/icons/arrowRight.svg'

export type ImagesDataType = {
  id: number
  src: string
}

export type ImageCarouselPropsType = {
  imagesData: ImagesDataType[]
}

const ImageCarousel: FC<ImageCarouselPropsType> = ({ imagesData }) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number>(0)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const images = sliceImagesForCarousel(imagesData)

  const openFullscreen = (imageSrc: string, imageIndex: number) => {
    setFullscreenImage(imageSrc)
    setFullscreenImageIndex(imageIndex)
    setModalIsOpen(true)
  }

  const closeFullscreen = () => {
    setFullscreenImage(null)
    setModalIsOpen(false)
  }

  const showPrevImage = () => {
    const prevIndex = (fullscreenImageIndex - 1 + imagesData.length) % imagesData.length
    setFullscreenImage(imagesData[prevIndex].src)
    setFullscreenImageIndex(prevIndex)
  }

  const showNextImage = () => {
    const nextIndex = (fullscreenImageIndex + 1) % imagesData.length
    setFullscreenImage(imagesData[nextIndex].src)
    setFullscreenImageIndex(nextIndex)
  }

  const properties = {
    duration: 2000,
    autoplay: false,
    transitionDuration: 1000,
    arrows: true,
    infinite: true,
    easing: 'ease',
  }

  return (
    <div className={styles.imageCarousel}>
      {isMobile ? (
        <Slide {...properties}>
          {imagesData.map((img, ind) => {
            return (
              <div key={ind + 1} className={styles.slideImagesContainer}>
                <img
                  className={styles.oneImage}
                  src={img.src}
                  alt={`image_${ind + 1}`}
                  onClick={() => openFullscreen(img.src, ind)}
                />
                <div className={styles.imgCountBlock}>
                  {ind + 1}/{imagesData.length}
                </div>
              </div>
            )
          })}
        </Slide>
      ) : (
        <Slide {...properties}>
          {images.map((slideImageArray, index) => {
            return (
              <div key={index + 1} className={styles.slideImagesContainer}>
                {slideImageArray.length === 1 && (
                  <div className={styles.oneImagesContainer}>
                    <img
                      className={styles.oneImage}
                      src={slideImageArray[0].src}
                      alt='first_image'
                      onClick={() => openFullscreen(slideImageArray[0].src, index)}
                    />
                  </div>
                )}
                {slideImageArray.length === 2 && (
                  <div className={styles.imagesContainer}>
                    <img
                      className={styles.twoImagesFirst}
                      src={slideImageArray[0].src}
                      alt='first_image'
                      onClick={() => openFullscreen(slideImageArray[0].src, index)}
                    />
                    <img
                      className={styles.twoImagesFirstSecond}
                      src={slideImageArray[1].src}
                      alt='second_image'
                      onClick={() => openFullscreen(slideImageArray[1].src, index)}
                    />
                  </div>
                )}
                {slideImageArray.length === 3 && (
                  <div className={styles.imagesContainer}>
                    <div className={styles.threeImagesLeftBlock}>
                      <img
                        className={styles.threeImagesFirst}
                        src={slideImageArray[0].src}
                        alt='first_image'
                        onClick={() => openFullscreen(slideImageArray[0].src, index)}
                      />
                    </div>
                    <div className={styles.threeImagesRightBlock}>
                      <img
                        className={styles.threeImagesSecond}
                        src={slideImageArray[1].src}
                        alt='second_image'
                        onClick={() => openFullscreen(slideImageArray[1].src, index)}
                      />
                      <img
                        className={styles.threeImagesThird}
                        src={slideImageArray[2].src}
                        alt='third_image'
                        onClick={() => openFullscreen(slideImageArray[1].src, index)}
                      />
                    </div>
                  </div>
                )}
                {slideImageArray.length === 4 && (
                  <div className={styles.imagesContainer}>
                    <div className={styles.fourImagesLeftBlock}>
                      <img
                        className={styles.fourImagesFirst}
                        src={slideImageArray[0].src}
                        alt='first_image'
                        onClick={() => openFullscreen(slideImageArray[0].src, index)}
                      />
                    </div>
                    <div className={styles.fourImagesRightBlock}>
                      <div className={styles.fourImagesRightTopBlock}>
                        <img
                          className={styles.fourImagesSecond}
                          src={slideImageArray[1].src}
                          alt='second_image'
                          onClick={() => openFullscreen(slideImageArray[1].src, index)}
                        />
                        <img
                          className={styles.fourImagesThird}
                          src={slideImageArray[2].src}
                          alt='third_image'
                          onClick={() => openFullscreen(slideImageArray[2].src, index)}
                        />
                      </div>
                      <img
                        className={styles.fourImagesFourth}
                        src={slideImageArray[3].src}
                        alt='fourth_image'
                        onClick={() => openFullscreen(slideImageArray[3].src, index)}
                      />
                    </div>
                  </div>
                )}
                {slideImageArray.length === 5 && (
                  <div className={styles.imagesContainer}>
                    <div className={styles.fourImagesLeftBlock}>
                      <img
                        className={styles.fourImagesFirst}
                        src={slideImageArray[0].src}
                        alt='first_image'
                        onClick={() => openFullscreen(slideImageArray[0].src, index)}
                      />
                    </div>
                    <div className={styles.fourImagesRightBlock}>
                      <div className={styles.fourImagesRightTopBlock}>
                        <img
                          className={styles.fourImagesSecond}
                          src={slideImageArray[1].src}
                          alt='second_image'
                          onClick={() => openFullscreen(slideImageArray[1].src, index)}
                        />
                        <img
                          className={styles.fourImagesThird}
                          src={slideImageArray[2].src}
                          alt='third_image'
                          onClick={() => openFullscreen(slideImageArray[2].src, index)}
                        />
                      </div>
                      <div className={styles.fourImagesRightTopBlock}>
                        <img
                          className={styles.fiveImagesFourth}
                          src={slideImageArray[3].src}
                          alt='fourth_image'
                          onClick={() => openFullscreen(slideImageArray[3].src, index)}
                        />
                        <img
                          className={styles.fiveImagesFifth}
                          src={slideImageArray[4].src}
                          alt='fifth_image'
                          onClick={() => openFullscreen(slideImageArray[4].src, index)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </Slide>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeFullscreen}
        contentLabel='Fullscreen Image Modal'
        className={styles.fullscreenModal}
        overlayClassName={styles.overlayModal}
      >
        <div className={styles.fullscreenContent}>
          <button className={styles.prevButton} onClick={showPrevImage}>
            <img className={styles.closeButtonIcon} src={leftArrow} alt='closeIcon' />
          </button>
          <img
            className={styles.fullscreenImage}
            src={fullscreenImage || ''}
            alt='fullscreen_image'
          />
          <button className={styles.nextButton} onClick={showNextImage}>
            <img className={styles.closeButtonIcon} src={rightArrow} alt='closeIcon' />
          </button>
          <button className={styles.closeButton} onClick={closeFullscreen}>
            <img className={styles.closeButtonIcon} src={closeIcon} alt='closeIcon' />
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default ImageCarousel
