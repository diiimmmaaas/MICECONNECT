import React, { useEffect, useState } from 'react'
import styles from './EditPlatformCardPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import EditPlatformCardShortInformation from '../../components/EditPlatformCardShortInformation/EditPlatformCardShortInformation'
import EditCardDescription from '../../components/EditCardDescription/EditCardDescription'
import EditPlatformCardFilesBlock from '../../components/EditPlatformCardFilesBlock/EditPlatformCardFilesBlock'
import BlockAndDeletePanel from '../../components/BlockAndDeletePanel/BlockAndDeletePanel'
import UploadPhotoComponent from '../../components/UploadPhotoComponent/UploadPhotoComponent'
import exit from '../../assets/icons/trash.svg'
import { UploadImagesType } from '../../types'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import DeleteComponent from '../../components/DeleteComponent/DeleteComponent'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import {
  blockPlatform,
  changePlaceDescription,
  deleteCurrentFileFromPlatform,
  deleteCurrentPlaces,
  getCurrentPlaces,
  pushNewFilesToPlatform,
} from '../../redux/actions/placesAction'
import Loader from '../../components/UI/Loader/Loader'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useNavigate, useParams } from 'react-router-dom'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'
import MobileButtons from '../../components/UI/MobileButtons/MobileButtons'
import p from '../../components/UI/CustomInput/CustomInput.module.css'
import s from '../../styles/common/Form.module.css'
import { useMediaQuery } from 'react-responsive'

const EditPlatformCardPage = () => {
  const [photos, setPhotos] = useState<UploadImagesType[]>([])
  const [photosFile, setPhotosFile] = useState<any[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [platformError, setPlatformError] = useState<boolean>(false)
  const [platformNetworkError, setPlatformNetworkError] = useState<boolean>(false)
  const [postPlatformErrorText, setPostPlatformErrorText] = useState<string>('')

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const [platformConfirm, setPlatformConfirm] = useState<boolean>(false)

  let { isLoading, currentPlace, errorImage } = useAppSelector((state) => state.places)

  const { token } = useAppSelector((state) => state.auth)

  const { platformId } = useParams<{ platformId: string }>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onChangeSwipeCheckboxHandler = async (checked: boolean) => {
    await dispatch(
      blockPlatform({
        placeId: String(currentPlace.id),
        isBlocked: !checked,
      }),
    )

    await dispatch(getCurrentPlaces({ placeId: platformId, token }))
  }

  const waitNetworkTimer = () => {
    const timer = setTimeout(() => {
      setPlatformError(false)
      setPlatformNetworkError(false)
      setPostPlatformErrorText('')
    }, 5000)

    return () => clearTimeout(timer)
  }

  const onChangePlatformCardDescription = async (newDescription: string) => {
    const resultAction = await dispatch(
      changePlaceDescription({
        token,
        placeId: platformId,
        description: newDescription,
      }),
    )

    if (changePlaceDescription.rejected.match(resultAction)) {
      setPlatformError(true)
      waitNetworkTimer()
    } else {
      setPlatformConfirm(true)
      waitTimer(() => setPlatformConfirm(false))
      setPlatformError(false)
      await dispatch(getCurrentPlaces({ placeId: String(currentPlace.id), token }))
    }
  }

  const onResetHandler = () => {
    navigate(`${PATH.platformCardPage}${currentPlace.id}`)
  }

  const onDeletePopup = () => {
    setVisible(true)
  }

  const onDeletePlatform = async () => {
    const resultAction = await dispatch(deleteCurrentPlaces({ placeId: platformId, token }))

    if (deleteCurrentPlaces.rejected.match(resultAction)) {
      setPlatformError(true)
      waitTimer(() => setPlatformError(false))
    } else {
      navigate(-2)
      setPlatformError(false)
    }
  }

  const handleDeleteImage = (e: any) => {
    const targetIndex = e.target.dataset.imgindex * 1
    setPhotos([...photos.slice(0, targetIndex), ...photos.slice(targetIndex + 1)])
  }

  const onUploadNewImages = async () => {
    const formData = new FormData()

    if (photosFile.length > 10) {
      setPostPlatformErrorText('Вы можете загрузить максимум 10 картинок')
      waitNetworkTimer()

      return
    }

    if (photosFile.length !== 0) {
      for (let i = 0; i < photosFile.length; i++) {
        formData.append('images', photosFile[i])
      }

      const resultAction = await dispatch(
        pushNewFilesToPlatform({ placeId: String(currentPlace.id), formData, token }),
      )

      if (pushNewFilesToPlatform.rejected.match(resultAction)) {
        setPlatformError(true)
        waitNetworkTimer()
      } else {
        setPlatformError(false)
        setPhotosFile([])
        setPhotos([])
        await dispatch(getCurrentPlaces({ placeId: platformId, token }))
      }
    }
  }

  const onDeleteImageFromServer = async (image: string) => {
    const resultAction = await dispatch(
      deleteCurrentFileFromPlatform({
        token,
        placeId: String(currentPlace.id),
        filesToDelete: [image],
      }),
    )

    if (deleteCurrentFileFromPlatform.rejected.match(resultAction)) {
      setPlatformError(true)
      waitTimer(() => setPlatformError(false))
    } else {
      setPlatformError(false)
      await dispatch(getCurrentPlaces({ placeId: String(currentPlace.id), token }))
    }
  }

  useEffect(() => {
    dispatch(getCurrentPlaces({ placeId: platformId, token }))
  }, [platformId, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.editPlatformCard}>
      <CustomModal visible={visible} setVisible={setVisible}>
        <DeleteComponent
          title='Удаление площадки'
          description='Хотите удалить данную площадку ?'
          onCancelHandler={() => setVisible(false)}
          onDeleteHandler={onDeletePlatform}
          deleteError={platformNetworkError}
        />
      </CustomModal>
      <Navbar />
      <div className={styles.imageContainer}>
        <HeaderForCard title={currentPlace.name} />
        {!isMobile && photos.length !== 0 && (
          <div className={styles.btnsBlock}>
            <div className={styles.editIconBlock} onClick={onUploadNewImages}>
              Ok
            </div>
          </div>
        )}
      </div>
      <div className={styles.imageUpload}>
        <UploadPhotoComponent
          editMode
          photos={photos}
          photosFile={photosFile}
          setPhotos={setPhotos}
          widthOneImageContainer={245}
          widthOneGapOfImageContainer={20}
          setPhotosFiles={setPhotosFile}
        >
          <>
            {currentPlace.images.length > 0 &&
              currentPlace.images.map((image, index) => {
                return (
                  <div className={styles.imagesContainer} key={index} data-imgindex={index + 100}>
                    <div className={styles.imageExitContainer}>
                      <img
                        className={styles.imageExit}
                        src={exit}
                        alt='exit'
                        onClick={() => onDeleteImageFromServer(image)}
                        data-imgindex={index}
                      />
                    </div>
                    <img
                      className={styles.image}
                      src={`${process.env.REACT_APP_BASE_URL_IMAGES}${image}`}
                      alt={image}
                    />
                  </div>
                )
              })}
            {photos.length > 0 &&
              photos.map((photo, index) => {
                return (
                  <div className={styles.imagesContainer} key={index} data-imgindex={index}>
                    <div className={styles.imageExitContainer}>
                      <img
                        className={styles.imageExit}
                        src={exit}
                        alt='exit'
                        onClick={handleDeleteImage}
                        data-imgindex={index}
                      />
                    </div>
                    <img className={styles.image} src={photo?.src} alt={photo.name} />
                  </div>
                )
              })}
          </>
        </UploadPhotoComponent>
        <>
          {errorImage && <p className={`${s.errorValidation} ${s.networkError}`}>{errorImage}</p>}
        </>
      </div>
      {isMobile && (
        <MobileButtons
          className={styles.mobileBtns}
          isValid={true}
          handleSubmit={onUploadNewImages}
          handleCancel={onResetHandler}
        />
      )}
      <div className={styles.container}>
        <div className={styles.content}>
          <EditPlatformCardShortInformation platformData={currentPlace} />
          <EditCardDescription
            text={currentPlace.description}
            onSubmitHandler={onChangePlatformCardDescription}
            error={platformError}
            companyConfirm={platformConfirm}
            onResetHandler={onResetHandler}
          />
          <EditPlatformCardFilesBlock platformData={currentPlace} />
        </div>
        <BlockAndDeletePanel
          blockText='Площадка заблокирована'
          isBlocked={currentPlace.isBlocked}
          buttonTitle='Удалить площадку'
          checkBoxTitle='Заблокировать площадку'
          onChangeHandler={onChangeSwipeCheckboxHandler}
          onDeleteHandler={onDeletePopup}
        />
      </div>
      <Footer />
    </div>
  )
}

export default EditPlatformCardPage
