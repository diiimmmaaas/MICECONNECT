import React, { FC, useState } from 'react'
import usePasswordToggle from '../../hooks/usePasswordToggle'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import * as yup from 'yup'
import { useMediaQuery } from 'react-responsive'
import { Formik, FormikValues } from 'formik'
import { createRoleForRegister, createRoleForTable } from '../../utils/createRoleForRegister'
import styles from './DataForLogin.module.css'
import CustomInput from '../UI/CustomInput/CustomInput'
import s from '../../styles/common/Form.module.css'
import p from '../UI/CustomInput/CustomInput.module.css'
import editIcon from '../../assets/icons/orangePencil.svg'
import InformationItem from '../InformationItem/InformationItem'
import dotIcon from '../../assets/icons/dot.svg'
import TitleForEditBlockWithButton from '../TitleForEditBlockWithButton/TitleForEditBlockWithButton'
import { changeCurrentStaffDetails, getCurrentStaff } from '../../redux/actions/staffAction'
import { waitTimer } from '../../utils/waitTimer'
import { getMe } from '../../redux/actions/meAction'

export type DataForLoginPropsType = {
  isMe?: boolean
  userId: number
  role: string | undefined
  email: string
  password: string
}

const DataForLogin: FC<DataForLoginPropsType> = ({ isMe, userId, role, password, email }) => {
  const [editMode, setEditMode] = useState(false)
  const [PasswordInputType, ToggleIcon] = usePasswordToggle()

  const [staffError, setStaffError] = useState<boolean>(false)
  const [staffConfirm, setStaffConfirm] = useState<boolean>(false)

  const { token, userRole, user } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    role: yup
      .string()
      .required('Поле является обязательным')
      .oneOf(
        userRole === 'directorPlace'
          ? ([
              'Директор-Площадка',
              'Площадка',
              'площадка',
              'директор-площадка',
              'Директор-площадка',
              'директор-Площадка',
            ] as const)
          : ([
              'Директор-Агент',
              'Агент',
              'агент',
              'директор-агент',
              'директор-Агент',
              'Директор-агент',
            ] as const),
        userRole === 'directorPlace'
          ? 'Роль может быть только' + ' Директор-Площадка или Площадка'
          : 'Роль может быть только' + ' Директор-Агент или Агент',
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

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const handleSubmitHandler = async (values: FormikValues) => {
    const resultAction = await dispatch(
      changeCurrentStaffDetails({
        token,
        email: values.email,
        role: createRoleForRegister(values.role),
        staffId: String(userId),
        password: values.password,
      }),
    )

    if (changeCurrentStaffDetails.rejected.match(resultAction)) {
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
    <div className={styles.dataForLogin}>
      {editMode ? (
        <div className={styles.editMode}>
          <Formik
            initialValues={{
              role: role ? createRoleForTable(role) : '',
              email: email ? email : '',
              password: password ? password : '',
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
                    {isMe ||
                    (userRole === 'directorPlace' && user.employee.id === userId) ||
                    (userRole === 'directorAgent' && user.employee.id === userId) ? (
                      <div className={styles.roleBlock}>
                        <div className={styles.leftBlock}>Роль</div>
                        <div className={styles.rightBlock}>
                          <div className={styles.companyBlock}>{values.role}</div>
                          {touched.role && errors.role && (
                            <p style={{ textAlign: 'start' }} className={s.errorValidation}>
                              {errors.role}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
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
                            <p style={{ textAlign: 'start' }} className={styles.errorValidation}>
                              {errors.role}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
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
                      <div className={styles.rightBlock}>
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
        <div className={styles.loginDetailsBlock}>
          <div className={styles.loginDetailsHeader}>
            <h2 className={styles.loginDetailsTitle}>Данные для входа</h2>
            {userRole !== 'employeeAgent' && userRole !== 'employeePlace' && (
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
          <div className={styles.loginDetailsContainer}>
            <InformationItem
              notEdit={
                isMe ||
                (userRole === 'directorPlace' && user.employee.id === userId) ||
                (userRole === 'directorAgent' && user.employee.id === userId)
              }
              title='Роль'
              value={createRoleForTable(role)}
            />
            <InformationItem title='Электронная почта/Логин' value={email} />
            {isMe ? (
              <InformationItem title='Пароль' value={password} />
            ) : (
              <div className={styles.informationItem}>
                <div className={styles.title}>Пароль</div>
                <div className={styles.value}>
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                  <img className={styles.dotIcon} src={dotIcon} alt='dotIcon' />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DataForLogin
