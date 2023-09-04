import React, { FC, useState } from 'react'
import * as yup from 'yup'
import { Formik, FormikValues } from 'formik'
import styles from './CreateAdmin.module.css'
import PopupHeader from '../PopupHeader/PopupHeader'
import s from '../../styles/common/Form.module.css'
import CustomInput from '../UI/CustomInput/CustomInput'
import CustomButton from '../UI/CustomButton/CustomButton'
import CustomRadio from '../UI/CustomRadio/CustomRadio'
import usePasswordToggle from '../../hooks/usePasswordToggle'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getAdmins, postAdmin } from '../../redux/actions/adminsAction'
import { createRoleForRegister } from '../../utils/createRoleForRegister'
import { waitTimer } from '../../utils/waitTimer'
import p from '../UI/CustomInput/CustomInput.module.css'
import InputMask from 'react-input-mask'
import { adminsPerPage } from '../../constants/constants'

export type CreateUserPropsType = {
  onClickHandler: () => void
}

const CreateAdmin: FC<CreateUserPropsType> = ({ onClickHandler }) => {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle()
  const { token } = useAppSelector((state) => state.auth)

  const [postAdminError, setPostAdminError] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    fullName: yup.string().required('Поле является обязательным'),
    phone: yup.string().required('Поле является обязательным'),
    email: yup
      .string()
      .email('К сожалению, почта введена неверно, попробуйте еще раз')
      .required('Поле является обязательным'),
    password: yup
      .string()
      .required('Поле является обязательным')
      .min(8, 'Пароль должен' + ' содержать' + ' минимум 8' + ' символов'),
    role: yup.string().required('Поле является обязательным'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const mobileWithoutSymbols = `+${values.phone.replace(/[\D]+/g, '')}`
    const resultAction = await dispatch(
      postAdmin({
        token,
        role: createRoleForRegister(values.role),
        phone: mobileWithoutSymbols,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      }),
    )

    if (postAdmin.rejected.match(resultAction)) {
      setPostAdminError(true)
      waitTimer(() => setPostAdminError(false))
    } else {
      onClickHandler()
      setPostAdminError(false)
      await dispatch(getAdmins({ token, page: 1, itemsPerPage: adminsPerPage }))
    }
  }

  return (
    <div className={styles.createUser}>
      <div className={styles.headerForm}>
        <PopupHeader title='Создание администратора' onClickHandler={onClickHandler} />
      </div>
      <div className={styles.form}>
        <Formik
          initialValues={{
            fullName: '',
            phone: '',
            email: '',
            password: '',
            role: '',
          }}
          validateOnBlur
          onSubmit={(values) => handleSubmitHandler(values)}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } =
              props

            return (
              <div className={s.formContainer}>
                <div className={s.inputGroup}>
                  <h4 className={styles.subtitle}>
                    ФИО<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    autoComplete='off'
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
                  {touched.fullName && errors.fullName && (
                    <p className={s.errorValidation}>{errors.fullName}</p>
                  )}
                  <h4 className={styles.subtitle}>
                    Номер телефона<span className={s.redStar}>*</span>
                  </h4>
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
                        ? `${s.inputError} ${p.input}`
                        : `${s.input} ${p.input}`
                    }
                  ></InputMask>
                  {touched.phone && errors.phone && (
                    <p className={s.errorValidation}>{errors.phone}</p>
                  )}

                  <h4 className={styles.subtitle}>
                    Электронная почта/Логин<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    autoComplete='new-email'
                    type='email'
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
                  {touched.email && errors.email && (
                    <p className={s.errorValidation}>{errors.email}</p>
                  )}
                  <h4 className={styles.subtitle}>
                    Пароль<span className={s.redStar}>*</span>
                  </h4>
                  <div className={styles.passInput}>
                    <CustomInput
                      autoComplete='new-password'
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
                    <p className={s.errorValidation}>{errors.password}</p>
                  )}

                  <h4 className={styles.subtitle}>
                    Роль<span className={s.redStar}>*</span>
                  </h4>
                  <CustomRadio
                    options={['Суперадминистратор', 'Администратор']}
                    name='role'
                    onChange={handleChange}
                    value={values.role}
                  />
                  <>
                    {postAdminError && (
                      <p className={`${s.errorValidation} ${s.networkError}`}>
                        Произошла ошибка при создании администратора. Проверьте правильность
                        введенных данных, а также наличие пользователя с такими данными в базе
                        данных.
                      </p>
                    )}
                  </>
                </div>
                <div className={s.buttonGroup}>
                  <CustomButton
                    className={styles.submitBtn}
                    title='Создать администратора'
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

export default CreateAdmin
