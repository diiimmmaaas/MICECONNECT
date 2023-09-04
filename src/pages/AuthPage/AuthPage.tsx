import React, { useEffect, useState } from 'react'
import { Formik, FormikValues } from 'formik'
import * as yup from 'yup'
import styles from './AuthPage.module.css'
import s from '../../styles/common/Form.module.css'
import CustomInput from '../../components/UI/CustomInput/CustomInput'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import usePasswordToggle from '../../hooks/usePasswordToggle'
import HeaderForAuth from '../../components/HeaderForAuth/HeaderForAuth'
import { Link, useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { loginUser } from '../../redux/actions/authAction'
import Loader from '../../components/UI/Loader/Loader'
import { waitTimer } from '../../utils/waitTimer'
import mainBackground from '../../assets/img/mainBackground.png'
import { clearError } from '../../redux/reducers/auth/authSlice'

const AuthPage = () => {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle()
  const [submittedValues, setSubmittedValues] = useState<any>(null)

  const { isLoading, error } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validationSchema = yup.object().shape({
    login: yup
      .string()
      .transform((value) => value.trim())
      .required('Поле не может быть пустым'),
    password: yup
      .string()
      .transform((value) => value.trim())
      .required('Пароль не может быть пустым'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    setSubmittedValues(values)
    const resultAction = await dispatch(
      loginUser({ email: values.login.trim(), password: values.password.trim() }),
    )

    if (loginUser.rejected.match(resultAction)) {
      waitTimer(() => dispatch(clearError()))
    } else {
      navigate('/')
    }
  }

  useEffect(() => {
    if (error === 'Ваш аккаунт заблокирован') {
      dispatch(clearError())
      navigate(PATH.blockedPage)
    }
  }, [error])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div
      className={styles.authPage}
      style={{
        background: `linear-gradient(90deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), url(${mainBackground}), lightgray 50% / cover no-repeat`,
      }}
    >
      <div className={s.container}>
        <HeaderForAuth />
        <div className={`${s.formContentBlock} ${styles.formContentBlock}`}>
          <div className={s.leftBlock}>
            <h1 className={s.whiteTitle}>Рады видеть вас!</h1>
            <Formik
              initialValues={
                submittedValues || {
                  login: '',
                  password: '',
                }
              }
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
                      <h4 className={s.whiteSubtitle}>Логин (e-mail)</h4>
                      <CustomInput
                        autoComplete={'new-text'}
                        type='text'
                        placeholder='Электронная почта'
                        name='login'
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.login.trim()}
                        className={errors.login && touched.login ? s.inputError : s.input}
                      />
                      <div className={s.errorContainer}>
                        {touched.login && errors.login && (
                          <p className={s.errorValidation}>{errors.login as string}</p>
                        )}
                      </div>
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
                          value={values.password.trim()}
                          className={errors.password && touched.password ? s.inputError : s.input}
                        />
                        <div className={styles.eyeIcon}>{ToggleIcon}</div>
                      </div>
                      <div className={s.errorContainer}>
                        {touched.password && errors.password && (
                          <p className={s.errorValidation}>{errors.password as string}</p>
                        )}
                      </div>
                      <>{error && <p className={s.errorValidation}>{error}</p>}</>
                      <div className={styles.passwordRecoveryBlock}>
                        <Link to={PATH.passwordRecoveryPage} className={styles.passwordLinkWhite}>
                          Забыли пароль ?
                        </Link>
                      </div>
                    </div>
                    <div className={styles.buttonBlock}>
                      <CustomButton
                        title='Войти'
                        disabled={!isValid}
                        onClick={() => handleSubmit()}
                        type='submit'
                        className={s.submitBtn}
                      />
                    </div>
                    <Link to={PATH.registrationPage} className={styles.passwordLinkWithoutLine}>
                      К регистрации
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

export default AuthPage
