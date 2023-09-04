import React, { FC, useEffect, useState } from 'react'
import styles from './CreatePlatform.module.css'
import s from '../../styles/common/Form.module.css'
import p from '../../components/UI/CustomInput/CustomInput.module.css'
import CustomInput from '../UI/CustomInput/CustomInput'
import CustomButton from '../UI/CustomButton/CustomButton'
import { Formik, FormikValues } from 'formik'
import * as yup from 'yup'
import CustomTextArea from '../UI/CustomTextArea/CustomTextArea'
import UploadPhotoComponent from '../UploadPhotoComponent/UploadPhotoComponent'
import { colorsPalette, mainColors, placesPerPage } from '../../constants/constants'
import DropDown from '../DropDown/DropDown'
import ColorPalleteComponent from '../ColorPalleteComponent/ColorPalleteComponent'
import UploadFileComponent from '../UploadFileComponent/UploadFileComponent'
import exit from '../../assets/icons/trash.svg'
import { UploadImagesType } from '../../types'
import PopupHeader from '../PopupHeader/PopupHeader'
import { useMediaQuery } from 'react-responsive'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { createPlace, getPlaces, getPlacesFromCompany } from '../../redux/actions/placesAction'
import Loader from '../UI/Loader/Loader'
import { useDebounce } from '../../hooks/useDebounce'
import { getDaDataCompany } from '../../redux/actions/daDataAction'

export type CreatePlatformPropsType = {
  innCompany?: string
  onClickHandler: () => void
}

const CreatePlatform: FC<CreatePlatformPropsType> = ({ onClickHandler, innCompany }) => {
  const [activePallete, setActivePallete] = useState<boolean>(false)
  const [photos, setPhotos] = useState<UploadImagesType[]>([])
  const [photosFile, setPhotosFile] = useState<any>([])
  const [files, setFiles] = useState<any>([])
  const [inn, setInn] = useState<string>('')
  const [commentFile, setCommentFile] = useState<any>([])

  const debounced = useDebounce(inn)

  const { daDataCompany, loading } = useAppSelector((state) => state.daData)
  const { currentCompany } = useAppSelector((state) => state.companies)
  const { user, userRole, token } = useAppSelector((state) => state.auth)
  const { error } = useAppSelector((state) => state.places)

  const [loaded, setLoaded] = useState<boolean>(false)

  const [postPlatformError, setPostPlatformError] = useState<boolean>(false)
  const [postPlatformErrorText, setPostPlatformErrorText] = useState<string>('')

  const validationSchema = yup.object().shape({
    platformName: yup.string().required('Поле является обязательным'),
    city: yup.string().required('Поле является обязательным'),
    address: yup.string().required('Поле является обязательным'),
    capacity: yup.string().required('Поле является обязательным'),
    color: yup.string().required('Поле является обязательным'),
  })

  const dispatch = useAppDispatch()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const onActivePallete = () => {
    setActivePallete(!activePallete)
  }

  const waitTimer = () => {
    const timer = setTimeout(() => {
      setPostPlatformError(false)
      setPostPlatformErrorText('')
    }, 10000)

    return () => clearTimeout(timer)
  }

  const handleSubmitHandler = async (values: FormikValues) => {
    const companyInn = inn
    const name = values.platformName
    const city = values.city
    const address = values.address
    const size = values.capacity
    const description = values.description
    const color = values.color

    const formData = new FormData()

    if (photosFile.length > 10 || files.length > 10) {
      setPostPlatformErrorText('Вы можете загрузить максимум 10 файлов или картинок')
      waitTimer()

      return
    }

    if (values.platformName.length === 0) {
      setPostPlatformErrorText('Введите существующий ИНН Вашей компании')
      waitTimer()

      return
    }

    if (photosFile) {
      for (let i = 0; i < photosFile.length; i++) {
        formData.append('images', photosFile[i])
      }
    }
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
    }
    formData.append('companyInn', companyInn)
    formData.append('name', name)
    formData.append('city', city)
    formData.append('address', address)
    formData.append('size', size)
    formData.append('description', description)
    formData.append('color', color)

    setLoaded(true)
    const resultAction = await dispatch(createPlace({ formData, token }))

    if (createPlace.rejected.match(resultAction)) {
      setPostPlatformErrorText(error)
      setPostPlatformError(true)
      setLoaded(false)
      waitTimer()
    } else {
      onClickHandler()
      setPostPlatformError(false)
      setPostPlatformErrorText('')
      setLoaded(false)
      if (userRole === 'directorPlace' || userRole === 'employeePlace') {
        dispatch(
          getPlacesFromCompany({
            token,
            page: 1,
            itemsPerPage: placesPerPage,
            companyId: String(user.employee?.company?.id),
          }),
        )
      } else {
        dispatch(getPlaces({ token, page: 1, itemsPerPage: placesPerPage }))
      }
    }
  }

  useEffect(() => {
    dispatch(getDaDataCompany({ query: debounced }))
  }, [debounced, dispatch])

  useEffect(() => {
    if (innCompany) {
      setInn(innCompany)
    }
  }, [innCompany])

  if (loading) {
    return <Loader />
  }

  if (loaded) {
    return <Loader />
  }

  return (
    <div className={styles.createPlatform}>
      <div className={styles.headerForm}>
        <PopupHeader title='Создание площадки' onClickHandler={onClickHandler} />
      </div>
      <div className={styles.form}>
        <Formik
          initialValues={{
            images: [],
            platformName: '',
            companyName: daDataCompany?.suggestions[0]?.data?.name?.full
              ? String(daDataCompany?.suggestions[0]?.data?.name?.full)
              : currentCompany.name,
            city: '',
            address: '',
            capacity: '',
            color: '',
            description: '',
            files: [],
          }}
          validateOnBlur
          onSubmit={(values) => handleSubmitHandler(values)}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              touched,
              setFieldValue,
              errors,
              isValid,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props

            const handleDeleteImage = (e: any) => {
              const targetIndex = e.target.dataset.imgindex * 1
              setPhotos([...photos.slice(0, targetIndex), ...photos.slice(targetIndex + 1)])
              setPhotosFile([
                ...photosFile.slice(0, targetIndex),
                ...photosFile.slice(targetIndex + 1),
              ])
              setFieldValue('images', [
                ...values.images.slice(0, targetIndex),
                ...values.images.slice(targetIndex + 1),
              ])
            }

            return (
              <div className={s.formContainer}>
                <div className={s.inputGroup}>
                  <h4 className={styles.subtitle}>
                    Инн компании<span className={s.redStar}>*</span>
                  </h4>
                  {innCompany ? (
                    <div className={styles.companyBlock}>{inn}</div>
                  ) : (
                    <CustomInput
                      type='text'
                      placeholder=''
                      required
                      onChange={(e) => setInn(e.target.value)}
                      value={inn}
                      className={styles.input}
                    />
                  )}
                  <h4 className={styles.subtitle}>
                    Компания<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='companyName'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.companyName}
                    className={
                      errors.companyName && touched.companyName
                        ? `${s.inputError} ${styles.input}`
                        : styles.input
                    }
                  />
                  {touched.companyName && errors.companyName && (
                    <p className={s.errorValidation}>{errors.companyName}</p>
                  )}
                  <h4 className={styles.subtitle}>Фото площадки</h4>
                  <div className={styles.imageUpload}>
                    <UploadPhotoComponent
                      widthOneImageContainer={146}
                      widthOneGapOfImageContainer={18}
                      setFieldValue={setFieldValue}
                      photos={photos}
                      photosFile={photosFile}
                      setPhotos={setPhotos}
                      setPhotosFiles={setPhotosFile}
                    >
                      {photos.length > 0 &&
                        photos.map((photo: any, index: any) => {
                          return (
                            <div
                              className={styles.imagesContainer}
                              key={index}
                              data-imgindex={index}
                            >
                              <div className={styles.imageExitContainer}>
                                <img
                                  className={styles.imageExit}
                                  src={exit}
                                  alt='exit'
                                  onClick={handleDeleteImage}
                                  data-imgindex={index}
                                />
                              </div>
                              <img className={styles.image} src={photo.src} alt={photo.name} />
                            </div>
                          )
                        })}
                    </UploadPhotoComponent>
                  </div>
                  <h4 className={styles.subtitle}>
                    Название площадки<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='platformName'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.platformName}
                    className={
                      errors.platformName && touched.platformName
                        ? `${s.inputError} ${styles.input}`
                        : styles.input
                    }
                  />
                  {touched.platformName && errors.platformName && (
                    <p className={s.errorValidation}>{errors.platformName}</p>
                  )}
                  <h4 className={styles.subtitle}>
                    Город<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='city'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.city}
                    className={
                      errors.city && touched.city ? `${s.inputError} ${styles.input}` : styles.input
                    }
                  />
                  {touched.city && errors.city && (
                    <p className={s.errorValidation}>{errors.city}</p>
                  )}
                  <h4 className={styles.subtitle}>
                    Адрес<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='address'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                    className={
                      errors.address && touched.address
                        ? `${s.inputError} ${styles.input}`
                        : styles.input
                    }
                  />
                  {touched.address && errors.address && (
                    <p className={s.errorValidation}>{errors.address}</p>
                  )}
                  <h4 className={styles.subtitle}>
                    Вместительность<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='capacity'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.capacity}
                    className={
                      errors.capacity && touched.capacity
                        ? `${s.inputError} ${styles.input}`
                        : styles.input
                    }
                  />
                  {touched.capacity && errors.capacity && (
                    <p className={s.errorValidation}>{errors.capacity}</p>
                  )}
                  <div className={styles.colorPaletteBlock}>
                    {isMobile ? (
                      <div className={styles.colorPalleteHeaderForMobile}>
                        <h4 className={styles.subtitle}>
                          Выбор цвета<span className={s.redStar}>*</span>
                        </h4>
                        <div onClick={onActivePallete} className={styles.showAllColors}>
                          Показать все
                        </div>
                      </div>
                    ) : (
                      <h4 className={styles.subtitle}>
                        Выбор цвета<span className={s.redStar}>*</span>
                      </h4>
                    )}
                    <div className={styles.colorsComponent}>
                      <div className={styles.mainColorsBlock}>
                        <ColorPalleteComponent
                          colors={mainColors}
                          color={values.color}
                          handleChange={handleChange}
                          className={styles.radioButton}
                        />
                      </div>
                      {!isMobile && (
                        <div onClick={onActivePallete} className={styles.showAllColors}>
                          Показать все
                        </div>
                      )}
                      {activePallete && (
                        <DropDown open={activePallete} className={styles.dropDown}>
                          <div className={styles.colorsPalleteBlock}>
                            <ColorPalleteComponent
                              colors={colorsPalette}
                              color={values.color}
                              handleChange={handleChange}
                              className={styles.radioButtonSmall}
                            />
                          </div>
                        </DropDown>
                      )}
                    </div>
                  </div>
                  <h4 className={styles.subtitle}>Описание площадки</h4>
                  <CustomTextArea
                    withoutFile
                    placeholder=''
                    setCommentFile={setCommentFile}
                    name='description'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    className={
                      errors.description && touched.description
                        ? `${s.inputError} ${styles.input}`
                        : styles.input
                    }
                  ></CustomTextArea>
                  {touched.description && errors.description && (
                    <p className={s.errorValidation}>{errors.description}</p>
                  )}
                  <h4 className={styles.subtitle}>Файл</h4>
                  <UploadFileComponent setFiles={setFiles} filesArray={files} />
                  <>
                    {postPlatformErrorText && (
                      <p className={`${s.errorValidation} ${s.networkError}`}>
                        {postPlatformErrorText}
                      </p>
                    )}
                  </>
                </div>
                <div className={s.buttonGroup}>
                  <CustomButton
                    className={styles.submitBtn}
                    title='Создать площадку'
                    disabled={!isValid}
                    onClick={() => handleSubmit()}
                    type='submit'
                  />
                </div>
              </div>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default CreatePlatform
