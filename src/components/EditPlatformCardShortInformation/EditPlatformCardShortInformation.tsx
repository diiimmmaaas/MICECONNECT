import React, { FC, useState } from 'react'
import styles from './EditPlatformCardShortInformation.module.css'
import * as yup from 'yup'
import CustomInput from '../UI/CustomInput/CustomInput'
import { Formik, FormikValues } from 'formik'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import { useMediaQuery } from 'react-responsive'
import { PlaceType } from '../../redux/actions/types'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'
import { changePlaceMainInformation, getCurrentPlaces } from '../../redux/actions/placesAction'
import s from '../../styles/common/Form.module.css'
import MobileButtons from '../UI/MobileButtons/MobileButtons'
import editIcon from '../../assets/icons/orangePencil.svg'
import InformationItem from '../InformationItem/InformationItem'
import TitleForEditBlockWithButton from '../TitleForEditBlockWithButton/TitleForEditBlockWithButton'

export type EditPlatformCardShortInformationPropsType = {
  platformData: PlaceType
}

const EditPlatformCardShortInformation: FC<EditPlatformCardShortInformationPropsType> = ({
  platformData,
}) => {
  const [editMode, setEditMode] = useState(false)
  const [platformError, setPlaftformError] = useState<boolean>(false)
  const [platformConfirm, setPlatformConfirm] = useState<boolean>(false)

  const { token, userRole } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const validationSchema = yup.object().shape({
    city: yup.string().required('Поле не может быть'),
    capacity: yup.string().required('Поле не может быть'),
    platformName: yup.string().required('Поле не может быть'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const resultAction = await dispatch(
      changePlaceMainInformation({
        token,
        placeId: String(platformData.id),
        address: values.address,
        name: values.platformName,
        city: values.city,
        size: values.capacity,
      }),
    )

    if (changePlaceMainInformation.rejected.match(resultAction)) {
      setPlaftformError(true)
      waitTimer(() => setPlaftformError(false))
    } else {
      setPlatformConfirm(true)
      waitTimer(() => setPlatformConfirm(false))
      setPlaftformError(false)
      setEditMode(false)
      await dispatch(getCurrentPlaces({ placeId: String(platformData.id), token }))
    }
  }

  const handleEditMode = () => {
    setEditMode(true)
  }

  return (
    <div className={styles.editSHortInformation}>
      {editMode ? (
        <Formik
          initialValues={{
            city: platformData.city ? platformData.city : '',
            address: platformData.address ? platformData.address : '',
            platformName: platformData.name ? platformData.name : '',
            companyName: platformData.company.name ? platformData.company.name : '',
            capacity: platformData.size ? String(platformData.size) : '',
          }}
          validateOnBlur
          onSubmit={(values) => handleSubmitHandler(values)}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              isValid,
              handleReset,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props

            return (
              <>
                <TitleForEditBlockWithButton
                  title='Краткая информация'
                  handleSubmit={handleSubmit}
                />
                <div className={styles.formContainer}>
                  <div className={styles.inputBlock}>
                    <h4 className={styles.subtitle}>Название площадки</h4>
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
                          ? `${styles.inputError} ${styles.input}`
                          : styles.input
                      }
                    />
                  </div>
                  <div className={styles.inputBlock}>
                    <h4 className={styles.subtitle}>Город</h4>
                    <CustomInput
                      type='text'
                      placeholder=''
                      name='city'
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.city}
                      className={
                        errors.city && touched.city
                          ? `${styles.inputError} ${styles.input}`
                          : styles.input
                      }
                    />
                  </div>
                  <div className={styles.inputBlock}>
                    <h4 className={styles.subtitle}>Адрес</h4>
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
                          ? `${styles.inputError} ${styles.input}`
                          : styles.input
                      }
                    />
                  </div>
                  <div className={styles.inputBlock}>
                    <h4 className={styles.subtitle}>
                      Компания<span className={s.redStar}>*</span>
                    </h4>
                    <div className={styles.companyBlock}>{values.companyName}</div>
                  </div>
                  <div className={styles.inputBlock}>
                    <h4 className={styles.subtitle}>Вместительность</h4>
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
                          ? `${styles.inputError} ${styles.input}`
                          : styles.input
                      }
                    />
                  </div>
                  <>
                    {platformError && (
                      <p className={`${s.errorValidation} ${s.networkError}`}>
                        Произошла ошибка при обновлении данных. Попробуйте еще раз...
                      </p>
                    )}
                  </>
                  <>
                    {platformConfirm && (
                      <p className={`${s.confirmValidation} ${s.networkConfirm}`}>
                        Данные обновлены
                      </p>
                    )}
                  </>
                </div>
              </>
            )
          }}
        </Formik>
      ) : (
        <div className={styles.staticInformation}>
          <div className={styles.staticInformationHeader}>
            <h2 className={styles.staticInformationTitle}>Краткая информация</h2>
            {userRole !== 'employeePlace' && userRole !== 'employeeAgent' && (
              <div className={styles.editIconBlock}>
                <img
                  onClick={handleEditMode}
                  className={styles.editIcon}
                  src={editIcon}
                  alt='editIcon'
                />
              </div>
            )}
          </div>
          <div className={styles.staticInformationContainer}>
            <InformationItem title='Название площадки' value={platformData.name} />
            <InformationItem title='Город' value={platformData.city} />
            <InformationItem title='Адрес' value={platformData.address} />
            <InformationItem notEdit title='Компания' value={platformData.company.name} />
            <InformationItem title='Вместительность' value={String(platformData.size)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default EditPlatformCardShortInformation
