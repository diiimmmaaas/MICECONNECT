import { Formik, FormikValues } from 'formik'
import * as yup from 'yup'
import styles from './PasswordRecoveryPage.module.css'
import s from '../../styles/common/Form.module.css'
import p from '../../components/UI/CustomInput/CustomInput.module.css'
import CustomInput from '../../components/UI/CustomInput/CustomInput'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import HeaderForAuth from '../../components/HeaderForAuth/HeaderForAuth'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { passwordRecovery } from '../../redux/actions/authAction'
import Loader from '../../components/UI/Loader/Loader'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'
import mainBackground from '../../assets/img/mainBackground.png'

function PasswordRecoveryPage() {
  const { isLoading } = useAppSelector((state) => state.auth)

  const [authError, setAuthError] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Почта введена некорректно, попробуйте еще раз')
      .required('Поле является обязательным'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const resultAction = await dispatch(
      passwordRecovery({
        email: values.email,
      }),
    )

    if (passwordRecovery.rejected.match(resultAction)) {
      setAuthError(true)
      waitTimer(() => setAuthError(false))
    } else {
      setAuthError(false)
      navigate(PATH.passwordRecoveryCodePage, { state: { email: values.email } })
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
                email: '',
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
                      <h4 className={s.whiteSubtitle}>Электронная почта</h4>
                      <CustomInput
                        type='email'
                        placeholder=''
                        name='email'
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className={errors.email && touched.email ? s.inputError : s.input}
                      />
                      <div className={s.errorContainer}>
                        {touched.email && errors.email && (
                          <p className={s.errorValidation}>{errors.email}</p>
                        )}
                      </div>
                      <>
                        {authError && (
                          <p className={`${s.errorValidation} ${s.networkError}`}>
                            Произошла серверная ошибка. Перезагрузите страницу и попробуйте еще раз
                          </p>
                        )}
                      </>
                    </div>
                    <div className={s.buttonGroup}>
                      <CustomButton
                        title='Отправить запрос'
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

export default PasswordRecoveryPage
