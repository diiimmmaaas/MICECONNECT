import React, { useEffect, useState } from 'react'
import styles from './EditCompanyPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import UploadPhotoComponent from '../../components/UploadPhotoComponent/UploadPhotoComponent'
import p from '../../components/UI/CustomInput/CustomInput.module.css'
import s from '../../styles/common/Form.module.css'
import EditCardDescription from '../../components/EditCardDescription/EditCardDescription'
import Footer from '../../components/Footer/Footer'
import { useMediaQuery } from 'react-responsive'
import {
  changeCompanyDetails,
  deleteCurrentFileFromCompany,
  getCurrentCompany,
  pushNewFilesToCompany,
} from '../../redux/actions/companiesAction'
import Loader from '../../components/UI/Loader/Loader'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useNavigate, useParams } from 'react-router-dom'
import { UploadImagesType } from '../../types'
import EditCompanyShortInformation from '../../components/EditCompanyShortInformation/EditCompanyShortInformation'
import EditCompanyLegalInformation from '../../components/EditCompanyLegalInformation/EditCompanyLegalInformation'
import { waitTimer } from '../../utils/waitTimer'
import exit from '../../assets/icons/trash.svg'
import MobileButtons from '../../components/UI/MobileButtons/MobileButtons'
import PATH from '../../navigation/path'

const EditCompanyPage = () => {
  const [photos, setPhotos] = useState<UploadImagesType[]>([])
  const [photosFile, setPhotosFile] = useState<any[]>([])
  const [companyError, setCompanyError] = useState<boolean>(false)
  const [companyNetworkError, setCompanyNetworkError] = useState<boolean>(false)
  const [postCompanyErrorText, setPostCompanyErrorText] = useState<string>('')
  const [companyConfirm, setCompanyConfirm] = useState<boolean>(false)

  const { userRole, user, token } = useAppSelector((state) => state.auth)

  const { currentCompany, companiesComments, error, isLoading } = useAppSelector(
    (state) => state.companies,
  )

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const { companyId } = useParams<{ companyId: string }>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const waitNetworkTimer = () => {
    const timer = setTimeout(() => {
      setCompanyError(false)
      setCompanyNetworkError(false)
      setPostCompanyErrorText('')
    }, 5000)

    return () => clearTimeout(timer)
  }

  const handleDeleteImage = (e: any) => {
    const targetIndex = e.target.dataset.imgindex * 1
    setPhotos([...photos.slice(0, targetIndex), ...photos.slice(targetIndex + 1)])
  }

  const onUploadNewImages = async () => {
    const formData = new FormData()

    if (photosFile.length > 10) {
      setPostCompanyErrorText('Вы можете загрузить максимум 10 картинок')
      waitNetworkTimer()

      return
    }

    if (photosFile.length !== 0) {
      for (let i = 0; i < photosFile.length; i++) {
        formData.append('images', photosFile[i])
      }

      const resultAction = await dispatch(
        pushNewFilesToCompany({ companyId: String(currentCompany.id), formData, token }),
      )

      if (pushNewFilesToCompany.rejected.match(resultAction)) {
        setCompanyError(true)
        waitNetworkTimer()
        setPhotosFile([])
        setPhotos([])
      } else {
        setCompanyError(false)
        setPhotosFile([])
        setPhotos([])
        await dispatch(getCurrentCompany({ companyId, token }))
      }
    }
  }

  const onResetHandler = () => {
    navigate(`${PATH.companyPage}${currentCompany.id}`)
  }

  const onDeleteImageFromServer = async (image: string) => {
    const resultAction = await dispatch(
      deleteCurrentFileFromCompany({
        token,
        companyId: String(currentCompany.id),
        filesToDelete: [image],
      }),
    )

    if (deleteCurrentFileFromCompany.rejected.match(resultAction)) {
      setCompanyError(true)
      waitTimer(() => setCompanyError(false))
    } else {
      setCompanyError(false)
      await dispatch(getCurrentCompany({ companyId, token }))
    }
  }

  const onChangeCompanyCardDescription = async (newDescription: string) => {
    const resultAction = await dispatch(
      changeCompanyDetails({
        token,
        companyId: String(currentCompany.id),
        description: newDescription,
      }),
    )

    if (changeCompanyDetails.rejected.match(resultAction)) {
      setCompanyError(true)
      waitNetworkTimer()
    } else {
      setCompanyConfirm(true)
      waitTimer(() => setCompanyConfirm(false))
      setCompanyError(false)
      await dispatch(getCurrentCompany({ companyId: String(companyId), token }))
    }
  }

  useEffect(() => {
    dispatch(getCurrentCompany({ companyId, token }))
  }, [companyId, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.editCompanyPage}>
      <Navbar />
      <div className={styles.imageContainer}>
        <HeaderForCard title={currentCompany.name} />
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
            {currentCompany.images.length > 0 &&
              currentCompany.images.map((image, index) => {
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
          {error && <p className={`${s.errorValidation} ${s.networkError}`}>{error as string}</p>}
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
          <EditCompanyShortInformation
            companyId={currentCompany.id}
            phone={currentCompany.contactPhone}
            email={currentCompany.email}
            address={currentCompany.address}
            city={currentCompany.city}
          />
          <EditCompanyLegalInformation
            companyId={currentCompany.id}
            companyName={currentCompany.name}
            inn={currentCompany.inn}
            role={currentCompany.role}
            contactFullName={currentCompany.contactFullName}
            contactPhone={currentCompany.contactPhone}
            email={currentCompany.email}
          />
          <EditCardDescription
            text={currentCompany.description ? currentCompany.description : ''}
            onSubmitHandler={onChangeCompanyCardDescription}
            error={companyError}
            companyConfirm={companyConfirm}
            onResetHandler={onResetHandler}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default EditCompanyPage
