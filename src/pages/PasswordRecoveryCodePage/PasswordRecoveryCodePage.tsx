import { Formik, FormikValues } from 'formik'
import * as yup from 'yup'
import styles from './PasswordRecoveryCodePage.module.css'
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
import { passwordRecoveryCode } from '../../redux/actions/authAction'
import { waitTimer } from '../../utils/waitTimer'

function PasswordRecoveryCodePage() {
  const { isLoading } = useAppSelector((state) => state.auth)

  const [authError, setAuthError] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const validationSchema = yup.object().shape({
    code: yup.string().required('Поле является обязательным'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const resultAction = await dispatch(
      passwordRecoveryCode({
        email: location.state.email,
        code: String(values.code),
      }),
    )

    if (passwordRecoveryCode.rejected.match(resultAction)) {
      setAuthError(true)
      waitTimer(() => setAuthError(false))
    } else {
      setAuthError(false)
      navigate(PATH.passwordRecoveryResetPasswordPage, {
        state: { code: values.code, email: location.state.email },
      })
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
                code: '',
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
                      <h4 className={s.whiteSubtitle}>Код с электронной почты</h4>
                      <CustomInput
                        type='number'
                        placeholder=''
                        name='code'
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.code}
                        className={errors.code && touched.code ? s.inputError : s.input}
                      />
                      {touched.code && errors.code && (
                        <p className={s.errorValidation}>{errors.code}</p>
                      )}
                      <>
                        {authError && (
                          <p className={`${s.errorValidation} ${s.networkError}`}>
                            Неверный код подтверждения. Попробуйте еще раз
                          </p>
                        )}
                      </>
                    </div>
                    <div className={s.buttonGroup}>
                      <CustomButton
                        title='Отправить код'
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

export default PasswordRecoveryCodePage
