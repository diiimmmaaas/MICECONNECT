import { Formik, FormikValues } from 'formik'
import * as Yup from 'yup'
import styles from './PasswordRecoverResetPasswordPage.module.css'
import s from '../../styles/common/Form.module.css'
import p from '../../components/UI/CustomInput/CustomInput.module.css'
import CustomInput from '../../components/UI/CustomInput/CustomInput'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import HeaderForAuth from '../../components/HeaderForAuth/HeaderForAuth'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Loader from '../../components/UI/Loader/Loader'
import PATH from '../../navigation/path'
import mainBackground from '../../assets/img/mainBackground.png'
import usePasswordToggle from '../../hooks/usePasswordToggle'
import { passwordRecoveryResetPassword } from '../../redux/actions/authAction'
import { waitTimer } from '../../utils/waitTimer'

function PasswordRecoverResetPasswordPage() {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle()
  const [RepeatPasswordInputType, RepeatToggleIcon] = usePasswordToggle()

  const { isLoading } = useAppSelector((state) => state.auth)

  const [authError, setAuthError] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  console.log('location', location)

  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Пароль обязателен')
      .min(8, 'Пароль должен' + ' содержать' + ' минимум 8' + ' символов'),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Пароли должны совпадать')
      .required('Подтверждение пароля обязательно'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const resultAction = await dispatch(
      passwordRecoveryResetPassword({
        email: location.state.email,
        password: values.password,
        code: String(location.state.code),
      }),
    )

    if (passwordRecoveryResetPassword.rejected.match(resultAction)) {
      setAuthError(true)
      waitTimer(() => setAuthError(false))
    } else {
      setAuthError(false)
      navigate(PATH.passwordRecoveryConfirmation)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div
      className={styles.passwordRecoveryPage}
      style={{
        background: `linear-gradient(90deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), url(${mainBackground}), lightgray 50% / cover no-repeat`,
      }}
    >
      <div className={s.container}>
        <HeaderForAuth />
        <div className={`${s.formContentBlock} ${styles.formContentBlock}`}>
          <div className={s.leftBlock}>
            <h1 className={s.whiteTitle}>Восстановление пароля</h1>
            <Formik
              initialValues={{
                password: '',
                repeatPassword: '',
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
                      <h4 className={s.whiteSubtitle}>Пароль</h4>
                      <div className={styles.passInput}>
                        <CustomInput
                          autoComplete={'new-password'}
                          type={PasswordInputType}
                          placeholder='Пароль'
                          name='password'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          className={errors.password && touched.password ? s.inputError : s.input}
                        />
                        <div className={styles.eyeIcon}>{ToggleIcon}</div>
                      </div>
                      {touched.password && errors.password && (
                        <p className={s.errorValidation}>{errors.password}</p>
                      )}
                      <h4 className={s.whiteSubtitle}>Повторите пароль</h4>
                      <div className={styles.passInput}>
                        <CustomInput
                          autoComplete={'repeat-password'}
                          type={RepeatPasswordInputType}
                          placeholder='Пароль'
                          name='repeatPassword'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.repeatPassword}
                          className={
                            errors.repeatPassword && touched.repeatPassword ? s.inputError : s.input
                          }
                        />
                        <div className={styles.eyeIcon}>{RepeatToggleIcon}</div>
                      </div>
                      {touched.repeatPassword && errors.repeatPassword && (
                        <p className={s.errorValidation}>{errors.repeatPassword}</p>
                      )}
                      <>
                        {authError && (
                          <p className={`${s.errorValidation} ${s.networkError}`}>
                            Произошла ошибка при изменении пароля. Попробуйте еще раз
                          </p>
                        )}
                      </>
                    </div>
                    <div className={s.buttonGroup}>
                      <CustomButton
                        title='Сменить пароль'
                        disabled={!isValid}
                        onClick={() => handleSubmit()}
                        type='submit'
                        className={s.submitBtn}
                      />
                    </div>
                    <Link to={PATH.authPage} className={styles.passwordLinkWithoutLine}>
                      <span>К входу</span>
                    </Link>
                  </div>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordRecoverResetPasswordPage
