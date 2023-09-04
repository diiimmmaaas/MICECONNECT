import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import styles from './CreatePlatformPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import Footer from '../../components/Footer/Footer'
import { useMediaQuery } from 'react-responsive'
import { UploadImagesType } from '../../types'
import arrowLeft from '../../assets/icons/arrowLeft.svg'
import pencilIcon from '../../assets/icons/pencil.svg'
import { useNavigate } from 'react-router-dom'
import { Formik, FormikValues } from 'formik'
import s from '../../styles/common/Form.module.css'
import CustomInput from '../../components/UI/CustomInput/CustomInput'
import p from '../../components/UI/CustomInput/CustomInput.module.css'
import UploadPhotoComponent from '../../components/UploadPhotoComponent/UploadPhotoComponent'
import exit from '../../assets/icons/trash.svg'
import ColorPalleteComponent from '../../components/ColorPalleteComponent/ColorPalleteComponent'
import { colorsPalette, mainColors, placesPerPage } from '../../constants/constants'
import DropDown from '../../components/DropDown/DropDown'
import CustomTextArea from '../../components/UI/CustomTextArea/CustomTextArea'
import UploadFileComponent from '../../components/UploadFileComponent/UploadFileComponent'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import { createPlace, getPlaces, getPlacesFromCompany } from '../../redux/actions/placesAction'
import * as yup from 'yup'
import { useDebounce } from '../../hooks/useDebounce'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getMe } from '../../redux/actions/meAction'
import Loader from '../../components/UI/Loader/Loader'
import { getDaDataCity } from '../../redux/actions/daDataAction'
import { waitTimer } from '../../utils/waitTimer'
import { Suggestion } from '../RegistrationPage/RegistrationPage'

export type CreatePlatformPagePropsType = {
  innCompany?: string
}

const CreatePlatformPage: FC<CreatePlatformPagePropsType> = ({ innCompany }) => {
  const [activePallete, setActivePallete] = useState<boolean>(false)
  const [photos, setPhotos] = useState<UploadImagesType[]>([])
  const [photosFile, setPhotosFile] = useState<any>([])
  const [files, setFiles] = useState<any>([])
  const [inn, setInn] = useState<string>('')
  const [commentFile, setCommentFile] = useState<any>([])
  const [city, setCity] = useState<string>('')
  const [citySuggestions, setCitySuggestions] = useState<Suggestion[]>([])
  const [cityError, setCityError] = useState('')

  const debounced = useDebounce(inn)

  const { user, userRole, token } = useAppSelector((state) => state.auth)
  const { error } = useAppSelector((state) => state.places)
  const { meData } = useAppSelector((state) => state.me)
  const { daDataCity } = useAppSelector((state) => state.daData)

  const [loaded, setLoaded] = useState<boolean>(false)

  const [postPlatformError, setPostPlatformError] = useState<boolean>(false)
  const [postPlatformErrorText, setPostPlatformErrorText] = useState<string>('')

  const dispatch = useAppDispatch()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const navigate = useNavigate()

  const onRedirectBack = () => {
    navigate(-1)
  }

  const onActivePallete = () => {
    setActivePallete(!activePallete)
  }

  const validationSchema = yup.object().shape({
    platformName: yup.string().required('Поле является обязательным'),
    address: yup.string().required('Поле является обязательным'),
    capacity: yup.string().required('Поле является обязательным'),
    color: yup.string().required('Поле является обязательным'),
  })

  const waitTimerPlatform = () => {
    const timer = setTimeout(() => {
      setPostPlatformError(false)
      setPostPlatformErrorText('')
    }, 10000)

    return () => clearTimeout(timer)
  }

  const handleCityInputChange = async (value: string) => {
    setCity(value)

    if (value.trim().length >= 1) {
      await dispatch(getDaDataCity({ query: city }))
    } else {
      setCitySuggestions([])
    }
  }

  const handleSelectSuggestion = (selectedCity: string) => {
    setCity(selectedCity)
    setCitySuggestions([])
  }

  const handleSubmitHandler = async (values: FormikValues) => {
    const companyInn = meData.company.inn
    const name = values.platformName
    const address = values.address
    const size = values.capacity
    const description = values.description
    const color = values.color

    const formData = new FormData()

    if (city === '') {
      setCityError('Пожалуйста выберите город вашей организации')
      waitTimer(() => setCityError(''))
      return
    }

    if (photosFile.length > 10 || files.length > 10) {
      setPostPlatformErrorText('Вы можете загрузить максимум 10 файлов или картинок')
      waitTimerPlatform()

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
      waitTimerPlatform()
    } else {
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
      navigate('/')
    }
  }

  useEffect(() => {
    setCitySuggestions(daDataCity)
  }, [daDataCity])

  useEffect(() => {
    dispatch(getMe({ token }))
  }, [dispatch, token])

  if (loaded) {
    return <Loader />
  }

  return (
    <div className={styles.createPlatformPage}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.arrowLeftBlock} onClick={onRedirectBack}>
            <img className={styles.arrowLeft} src={arrowLeft} alt='arrowLeft' />
          </div>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Создание площадки</h1>
          </div>
        </div>
      </div>
      <div className={styles.form}>
        <Formik
          initialValues={{
            images: [],
            platformName: '',
            companyName: '',
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
              <div className={styles.formContainer}>
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
                      {photos.length > 0 &&
                        photos.map((photo, index) => {
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
                              <img className={styles.image} src={photo?.src} alt={photo.name} />
                            </div>
                          )
                        })}
                    </>
                  </UploadPhotoComponent>
                </div>
                <div className={styles.shortInformationBlock}>
                  <div className={styles.shortInformationHeader}>
                    <h2 className={styles.shortInformationTitle}>Краткая информация</h2>
                  </div>
                  <div className={styles.shortInformationContent}>
                    <div className={styles.inputBlock}>
                      <div className={styles.leftBlock}>Город</div>
                      <div className={styles.rightBlock}>
                        <CustomInput
                          type='text'
                          placeholder=''
                          name='city'
                          required
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleCityInputChange(e.target.value)
                          }
                          value={city}
                          className={cityError ? `${s.input} ${s.inputError}` : s.input}
                        />
                        <ul className={styles.suggestionsDropdown}>
                          {citySuggestions.map((suggestion: Suggestion, index: number) => (
                            <li
                              key={index}
                              onClick={() => handleSelectSuggestion(suggestion.data.city)}
                            >
                              {suggestion.data.city}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className={styles.inputBlock}>
                      <div className={styles.leftBlock}>Адрес</div>
                      <div className={styles.rightBlock}>
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
                      </div>
                    </div>
                    <div className={styles.inputBlock}>
                      <div className={styles.leftBlock}>Название площадки</div>
                      <div className={styles.rightBlock}>
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
                      </div>
                    </div>
                    <div className={styles.inputBlock}>
                      <div className={styles.leftBlock}>Вместительность</div>
                      <div className={styles.rightBlock}>
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
                      </div>
                    </div>
                  </div>
                </div>
                <>
                  <div className={styles.mainColorsTitle}>Цвет для шахматки</div>
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
                </>
                <div className={styles.shortInformationBlock}>
                  <div className={styles.shortInformationHeader}>
                    <h2 className={styles.shortInformationTitle}>Описание</h2>
                  </div>
                  <div className={styles.shortInformationContent}>
                    <div className={styles.inputBlock}>
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
                    </div>
                  </div>
                </div>
                <div className={styles.shortInformationBlock}>
                  <div className={styles.shortInformationHeader}>
                    <h2 className={styles.shortInformationTitle}>Файлы</h2>
                  </div>
                  <div className={styles.shortInformationContent}>
                    <div className={styles.inputBlock}>
                      <UploadFileComponent setFiles={setFiles} filesArray={files} />
                    </div>
                  </div>
                </div>
                {cityError && (
                  <p
                    style={{ marginBottom: 20 }}
                    className={`${s.errorValidation} ${s.networkError}`}
                  >
                    {cityError}
                  </p>
                )}
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
      <Footer />
    </div>
  )
}

export default CreatePlatformPage
