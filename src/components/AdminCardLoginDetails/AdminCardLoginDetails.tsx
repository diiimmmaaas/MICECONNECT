import React, { FC, useState } from 'react'
import * as yup from 'yup'
import { Formik, FormikValues } from 'formik'
import styles from './AdminCardLoginDetails.module.css'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import CustomInput from '../UI/CustomInput/CustomInput'
import editIcon from '../../assets/icons/orangePencil.svg'
import dotIcon from '../../assets/icons/dot.svg'
import usePasswordToggle from '../../hooks/usePasswordToggle'
import InformationItem from '../InformationItem/InformationItem'
import { GetCurrentAdminResponseType } from '../../redux/actions/types'
import { createRoleForRegister, createRoleForTable } from '../../utils/createRoleForRegister'
import s from '../../styles/common/Form.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { changeAdminLoginDetails } from '../../redux/actions/adminsAction'
import { useMediaQuery } from 'react-responsive'
import MobileButtons from '../UI/MobileButtons/MobileButtons'
import { waitTimer } from '../../utils/waitTimer'

export type AdminCardLoginDetailsPropsType = {
  adminData: GetCurrentAdminResponseType
}

const AdminCardLoginDetails: FC<AdminCardLoginDetailsPropsType> = ({ adminData }) => {
  const [editMode, setEditMode] = useState(false)
  const [PasswordInputType, ToggleIcon] = usePasswordToggle()

  const [currentEmail, setCurrentEmail] = useState('')

  const { token } = useAppSelector((state) => state.auth)

  const [adminError, setAdminError] = useState<boolean>(false)
  const [adminConfirm, setAdminConfirm] = useState<boolean>(false)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    role: yup
      .string()
      .required('Поле является обязательным')
      .oneOf(
        ['Суперадминистратор', 'Администратор', 'суперадминистратор', 'администратор'] as const,
        'Роль может быть только' + ' Суперадминистратор или Администратор',
      ),
    email: yup
      .string()
      .email('К сожалению, почта введена неверно, попробуйте еще раз')
      .required('Поле является обязательным'),
    password: yup
      .string()
      .required('Поле является обязательным')
      .min(8, 'Пароль должен' + ' содержать' + ' минимум 8' + ' символов'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const role = createRoleForRegister(values.role)

    if (currentEmail === values.email) {
      const resultAction = await dispatch(
        changeAdminLoginDetails({
          token,
          adminId: String(adminData.id),
          password: values.password,
          role,
        }),
      )

      if (changeAdminLoginDetails.rejected.match(resultAction)) {
        setAdminError(true)
        waitTimer(() => setAdminError(false))
      } else {
        setAdminConfirm(true)
        waitTimer(() => setAdminConfirm(false))
        setAdminError(false)
      }
    } else {
      const resultAction = await dispatch(
        changeAdminLoginDetails({
          token,
          adminId: String(adminData.id),
          email: values.email,
          password: values.password,
          role,
        }),
      )

      if (changeAdminLoginDetails.rejected.match(resultAction)) {
        setAdminError(true)
        waitTimer(() => setAdminError(false))
      } else {
        setAdminConfirm(true)
        waitTimer(() => setAdminConfirm(false))
        setAdminError(false)
      }
    }

    setCurrentEmail(values.email)
  }

  const handleCancel = () => {
    setEditMode(false)
  }

  const handleEditMode = () => {
    setEditMode(true)
    setCurrentEmail(adminData.email)
  }

  return (
    <div className={styles.mainInformation}>
      {editMode ? (
        <div className={styles.editMode}>
          <Formik
            initialValues={{
              role: createRoleForTable(adminData.role),
              email: adminData.email,
              password: adminData.password,
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
                  <TitleBlockForEditPages
                    title='Данные для входа'
                    disabled={!isValid}
                    handleSubmit={handleSubmit}
                    handleReset={handleCancel}
                  />
                  <div className={styles.container}>
                    <div className={styles.roleBlock}>
                      <div className={styles.leftBlock}>Роль</div>
                      <div className={styles.rightBlock}>
                        <CustomInput
                          type='text'
                          placeholder=''
                          name='role'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.role}
                          className={
                            errors.role && touched.role
                              ? `${styles.inputError} ${styles.input}`
                              : styles.input
                          }
                        />
                        {touched.role && errors.role && (
                          <p style={{ textAlign: 'start' }} className={s.errorValidation}>
                            {errors.role}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={styles.loginBlock}>
                      <div className={styles.leftBlock}>Электронная почта/Логин</div>
                      <div className={styles.rightBlock}>
                        <CustomInput
                          type='text'
                          placeholder=''
                          name='email'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          className={
                            errors.email && touched.email
                              ? `${styles.inputError} ${styles.input}`
                              : styles.input
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.passwordBlock}>
                      <div className={styles.leftBlock}>Пароль</div>
                      <div className={styles.passContainer}>
                        <div className={styles.passInput}>
                          <CustomInput
                            type={PasswordInputType}
                            placeholder=''
                            name='password'
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            className={
                              errors.password && touched.password
                                ? `${styles.inputError} ${styles.input}`
                                : styles.input
                            }
                          />
                          <div className={styles.eyeIcon}>{ToggleIcon}</div>
                        </div>
                        {touched.password && errors.password && (
                          <p style={{ textAlign: 'start' }} className={s.errorValidation}>
                            {errors.password}
                          </p>
                        )}
                      </div>
                    </div>
                    <>
                      {adminError && (
                        <p className={`${s.errorValidation} ${s.networkError}`}>
                          Произошла ошибка при изменении данных. Попробуйте еще раз...
                        </p>
                      )}
                    </>
                    <>
                      {adminConfirm && (
                        <p className={`${s.confirmValidation} ${s.networkConfirm}`}>
                          Данные обновлены
                        </p>
                      )}
                    </>
                    {isMobile && (
                      <MobileButtons
                        isValid={isValid}
                        handleSubmitHandler={handleSubmitHandler}
                        handleCancel={handleCancel}
                      />
                    )}
                  </div>
                </>
              )
            }}
          </Formik>
        </div>
      ) : (
        <div className={styles.staticInformation}>
          <div className={styles.header}>
            <h2 className={styles.title}>Данные для входа</h2>
            <div className={styles.editIconBlock}>
              <img
                onClick={handleEditMode}
                className={styles.editIcon}
                src={editIcon}
                alt='editIcon'
              />
            </div>
          </div>
          <div className={styles.container}>
            <InformationItem title='Роль' value={createRoleForTable(adminData.role)} />
            <InformationItem title='Электронная почта/Логин' value={adminData.email} />
            <div className={styles.passwordBlock}>
              <div className={styles.leftBlock}>Пароль</div>
              <div className={styles.rightBlock}>
                <div className={styles.dotsBlock}>
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCardLoginDetails
