import React, { ChangeEvent, FC, ReactNode, useEffect, useRef, useState } from 'react'
import styles from './UploadPhotoComponent.module.css'
import arrowLeftIcon from '../../assets/icons/arrowLeft.svg'
import arrowRightIcon from '../../assets/icons/arrowRight.svg'
import uploadIcon from '../../assets/icons/upload.svg'
import { UploadImagesType } from '../../types'

export type UploadPhotoComponentPropsType = {
  editMode?: boolean
  widthOneImageContainer: number
  widthOneGapOfImageContainer: number
  setFieldValue?: any
  photos: UploadImagesType[]
  photosFile: any
  setPhotos: (photos: UploadImagesType[]) => void
  setPhotosFiles: (photosFiles: any) => void
  children: ReactNode
}

const UploadPhotoComponent: FC<UploadPhotoComponentPropsType> = ({
  editMode,
  widthOneImageContainer = 146,
  widthOneGapOfImageContainer = 18,
  setFieldValue,
  photos,
  photosFile,
  setPhotos,
  setPhotosFiles,
  children,
}) => {
  const [photosSrc, setPhotosSrc] = useState<string[]>([])
  const [highlight, setHighlight] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [widthImageContainer, setWidthImageContainer] = useState(0)

  const scrollLabelRef = useRef<any>()
  const scrollImageContainerRef = useRef<any>()

  const onScrollLeft = () => {
    if (scroll >= widthOneImageContainer + widthOneGapOfImageContainer) {
      setScroll(scroll - (widthOneImageContainer + widthOneGapOfImageContainer))
    }
    scrollImageContainerRef.current.scrollTo({
      left: scroll,
      behavior: 'smooth',
    })
  }

  const onScrollRight = () => {
    // if (scroll + (widthOneImageContainer + widthOneGapOfImageContainer) < widthImageContainer) {
    //   setScroll(scroll + (widthOneImageContainer + widthOneGapOfImageContainer))
    // }
    setScroll(scroll + (widthOneImageContainer + widthOneGapOfImageContainer))
    scrollImageContainerRef.current.scrollTo({
      left: scroll,
      behavior: 'smooth',
    })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    handFiles(files)
  }

  const handFiles = (files: any) => {
    setPhotosFiles([...photosFile, ...files])
    const photosArr: UploadImagesType[] = []
    for (const file of files) {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.addEventListener('load', () => {
        const fileObj = {
          name: file.name as string,
          type: file.type as string,
          size: file.size as string,
          src: reader.result as string,
        }
        photosArr.push(fileObj)
        setPhotos([...photos, ...photosArr])
        setPhotosSrc([...photosSrc, fileObj.src])
      })
    }
    setFieldValue && setFieldValue('images', photosSrc)
  }

  const handleHighlight = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setHighlight(true)
  }
  const handleUnHighlight = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setHighlight(false)
  }
  const handleDrop = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    const dt = e.dataTransfer
    const files = dt.files
    setHighlight(false)
    handFiles(files)
  }

  useEffect(() => {
    setScroll(widthImageContainer - (widthOneImageContainer + widthOneGapOfImageContainer))
    setWidthImageContainer(photos.length * (widthOneImageContainer + widthOneGapOfImageContainer))
  }, [photos, widthImageContainer])

  useEffect(() => {
    if (photos.length >= 3) {
      scrollLabelRef.current.scrollIntoView({
        right: widthImageContainer,
        behavior: 'smooth',
      })
    }
  }, [photos])

  return (
    <div className={styles.uploadPhotoContainer}>
      <div className={styles.arrowLeftContainer} onClick={onScrollLeft}>
        <img className={styles.arrowIcon} src={arrowLeftIcon} alt='arrowLeftIcon' />
      </div>
      <div ref={scrollImageContainerRef} className={styles.uploadPhotoBoard}>
        <input
          value={undefined}
          className={styles.inputFile}
          type='file'
          name='photos'
          placeholder='Добавьте картинки'
          multiple
          id='filephotos'
          onChange={handleFileChange}
          accept='image/*'
        />
        {children}
        <label
          ref={scrollLabelRef}
          className={highlight ? `${styles.activeLabel} ${styles.label}` : styles.label}
          htmlFor='filephotos'
          onDragEnter={handleHighlight}
          onDragOver={handleHighlight}
          onDragLeave={handleUnHighlight}
          onDrop={handleDrop}
        >
          <img className={styles.uploadIcon} src={uploadIcon} alt='uploadIcon' />
          Добавьте фото
        </label>
      </div>
      <div className={styles.arrowRightContainer} onClick={onScrollRight}>
        <img className={styles.arrowIcon} src={arrowRightIcon} alt='arrowRightIcon' />
      </div>
    </div>
  )
}

export default UploadPhotoComponent
