import React, { FC, useState } from 'react'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import styles from './EditStaffLoginDetails.module.css'
import CustomInput from '../UI/CustomInput/CustomInput'
import { Formik, FormikValues } from 'formik'
import usePasswordToggle from '../../hooks/usePasswordToggle'
import * as yup from 'yup'
import { useMediaQuery } from 'react-responsive'
import { StaffType } from '../../redux/actions/types'
import { createRoleForRegister, createRoleForTable } from '../../utils/createRoleForRegister'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { changeCurrentStaffDetails } from '../../redux/actions/staffAction'
import PATH from '../../navigation/path'
import s from '../../styles/common/Form.module.css'
import MobileButtons from '../UI/MobileButtons/MobileButtons'
import { waitTimer } from '../../utils/waitTimer'

export type EditStaffLoginDetailsPropsType = {
  staffData: StaffType
}

const EditStaffLoginDetails: FC<EditStaffLoginDetailsPropsType> = ({ staffData }) => {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle()

  const [staffError, setStaffError] = useState<boolean>(false)
  const [staffConfirm, setStaffConfirm] = useState<boolean>(false)

  const { token } = useAppSelector((state) => state.auth)

  const { companyId } = useParams<{ companyId: string }>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validationSchema = yup.object().shape({
    role: yup
      .string()
      .required('Поле является обязательным')
      .oneOf(
        staffData.company.role === 'directorPlace'
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
        staffData.company.role === 'directorPlace'
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
        staffId: String(staffData.id),
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
    }
  }

  const handleCancel = () => {
    navigate(`${PATH.companyStaffCardPage}${companyId}/${String(staffData.id)}`)
  }

  return (
    <div className={styles.editStaffLoginDetails}>
      <Formik
        initialValues={{
          role: createRoleForTable(staffData.user.role),
          email: staffData.user.email,
          password: staffData.user.password,
        }}
        validateOnBlur
        onSubmit={(values) => handleSubmitHandler(values)}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } = props

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
                      <p style={{ textAlign: 'start' }} className={styles.errorValidation}>
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
                    <p className={`${s.confirmValidation} ${s.networkConfirm}`}>Данные обновлены</p>
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
  )
}

export default EditStaffLoginDetails
