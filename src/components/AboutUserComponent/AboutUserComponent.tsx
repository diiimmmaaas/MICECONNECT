import React, { FC, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import * as yup from 'yup'
import { Formik, FormikValues } from 'formik'
import styles from './AboutUserComponent.module.css'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import CustomInput from '../UI/CustomInput/CustomInput'
import InputMask from 'react-input-mask'
import s from '../../styles/common/Form.module.css'
import p from '../UI/CustomInput/CustomInput.module.css'
import MobileButtons from '../UI/MobileButtons/MobileButtons'
import editIcon from '../../assets/icons/orangePencil.svg'
import InformationItem from '../InformationItem/InformationItem'
import TitleForEditBlockWithButton from '../TitleForEditBlockWithButton/TitleForEditBlockWithButton'
import { changeCurrentStaffMainInformation, getCurrentStaff } from '../../redux/actions/staffAction'
import { waitTimer } from '../../utils/waitTimer'
import { getMe } from '../../redux/actions/meAction'

export type AboutMeComponentPropsType = {
  isMe?: boolean
  userId: number
  fullName: string
  phone: string
  companyName: string
}

const AboutUserComponent: FC<AboutMeComponentPropsType> = ({
  isMe,
  userId,
  phone,
  fullName,
  companyName,
}) => {
  const [editMode, setEditMode] = useState(false)
  const [staffError, setStaffError] = useState<boolean>(false)
  const [staffConfirm, setStaffConfirm] = useState<boolean>(false)

  const { userRole, token } = useAppSelector((state) => state.auth)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    fullName: yup.string().required('Поле является обязательным'),
    phone: yup.string().required('Поле является обязательным'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const mobileWithoutSymbols = `+${values.phone.replace(/[\D]+/g, '')}`

    const resultAction = await dispatch(
      changeCurrentStaffMainInformation({
        token,
        staffId: String(userId),
        phone: mobileWithoutSymbols,
        fullName: values.fullName,
      }),
    )

    if (changeCurrentStaffMainInformation.rejected.match(resultAction)) {
      setStaffError(true)
      waitTimer(() => setStaffError(false))
    } else {
      setStaffConfirm(true)
      waitTimer(() => setStaffConfirm(false))
      setStaffError(false)
      setEditMode(false)
      isMe
        ? await dispatch(getMe({ token }))
        : dispatch(getCurrentStaff({ staffId: String(userId), token }))
    }
  }

  const handleEditMode = () => {
    setEditMode(true)
  }

  return (
    <div className={styles.aboutMe}>
      {editMode ? (
        <div className={styles.editMode}>
          <Formik
            initialValues={{
              fullName: fullName ? fullName : '',
              phone: phone ? phone : '',
              companyName: companyName ? companyName : '',
            }}
            validateOnBlur
            onSubmit={(values) => handleSubmitHandler(values)}
            validationSchema={validationSchema}
          >
            {(props) => {
              const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } =
                props

              return (
                <>
                  <TitleForEditBlockWithButton title='Обо мне' handleSubmit={handleSubmit} />
                  <div className={styles.container}>
                    <div className={styles.fullNameBlock}>
                      <div className={styles.leftBlock}>ФИО</div>
                      <div className={styles.rightBlock}>
                        <CustomInput
                          type='text'
                          placeholder=''
                          name='fullName'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.fullName}
                          className={
                            errors.fullName && touched.fullName
                              ? `${styles.inputError} ${styles.input}`
                              : styles.input
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.phoneBlock}>
                      <div className={styles.leftBlock}>Номер телефона</div>
                      <div className={styles.rightBlock}>
                        <InputMask
                          mask='+7 (999) 999 9999'
                          type='phone'
                          placeholder=''
                          name='phone'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.phone}
                          className={
                            errors.phone && touched.phone
                              ? `${s.inputError} ${p.input} ${styles.input}`
                              : `${p.input} ${styles.input}`
                          }
                        ></InputMask>
                      </div>
                    </div>
                    <div className={styles.fullNameBlock}>
                      <div className={styles.leftBlock}>Компания</div>
                      <div className={styles.rightBlock}>
                        <div className={styles.companyBlock}>{values.companyName}</div>
                      </div>
                    </div>
                    <>
                      {staffError && (
                        <p className={`${s.errorValidation} ${s.networkError}`}>
                          Произошла ошибка при изменении данных. Попробуйте еще раз...
                        </p>
                      )}
                    </>
                    <>
                      {staffConfirm && (
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
        </div>
      ) : (
        <div className={styles.staticInformation}>
          <div className={styles.header}>
            <h2 className={styles.title}>Обо мне</h2>
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
          <div className={styles.container}>
            <InformationItem title='ФИО' value={fullName} />
            <InformationItem title='Номер телефона' value={phone} />
            <InformationItem notEdit title='Компания' value={companyName} />
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutUserComponent
