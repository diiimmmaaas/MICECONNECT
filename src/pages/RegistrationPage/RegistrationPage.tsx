import { Formik, FormikValues } from 'formik'
import * as yup from 'yup'
import styles from './RegistrationPage.module.css'
import s from '../../styles/common/Form.module.css'
import CustomInput from '../../components/UI/CustomInput/CustomInput'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import HeaderForAuth from '../../components/HeaderForAuth/HeaderForAuth'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../../components/UI/Loader/Loader'
import { createRoleCompanyFromRuToEn } from '../../utils/createRoleForRegister'
import { waitTimer } from '../../utils/waitTimer'
import p from '../../components/UI/CustomInput/CustomInput.module.css'
import InputMask from 'react-input-mask'
import mainBackground from '../../assets/img/mainBackground.png'
import DropDown from '../../components/DropDown/DropDown'
import arrowDown from '../../assets/icons/arrowDownBlack.svg'
import usePasswordToggle from '../../hooks/usePasswordToggle'
import PATH from '../../navigation/path'
import { getDaDataCity, getDaDataCompany } from '../../redux/actions/daDataAction'
import { useMediaQuery } from 'react-responsive'
import { useDebounce } from '../../hooks/useDebounce'
import { registrationRequest } from '../../redux/actions/authAction'
import { clearError } from '../../redux/reducers/auth/authSlice'
import { clearDadata } from '../../redux/reducers/daData/daDataSlice'

const dropDownOptions = ['Агент', 'Площадка']

export interface Suggestion {
  data: {
    city: string
  }
}

function RegistrationPage() {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle()
  const [open, setOpen] = useState(false)
  const [activeRole, setActiveRole] = useState('Выберите роль')
  const [city, setCity] = useState<string>('')
  const [citySuggestions, setCitySuggestions] = useState<Suggestion[]>([])
  const [inn, setInn] = useState<string>('')
  const [loader, setLoader] = useState(false)

  const debounced = useDebounce(inn, 1000)

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  const { isLoading, error } = useAppSelector((state) => state.auth)
  const { daDataCity, daDataCompany } = useAppSelector((state) => state.daData)
  const [submittedValues, setSubmittedValues] = useState<any>(null)

  const [roleError, setRoleError] = useState('')
  const [cityError, setCityError] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validationSchema = yup.object().shape({
    name: yup.string().required('Поле является обязательным'),
    address: yup.string().required('Поле является обязательным'),
    fullName: yup.string().required('Поле является обязательным'),
    phone: yup
      .string()
      .required('Поле является обязательным')
      .matches(
        /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
        'Неверный формат',
      ),
    email: yup
      .string()
      .transform((value) => value.trim())
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'Почта введена некорректно, попробуйте еще раз',
      )
      .email('Почта введена некорректно, попробуйте еще раз')
      .required('Поле является обязательным'),
    password: yup
      .string()
      .transform((value) => value.trim())
      .required('Поле является обязательным')
      .min(8, 'Пароль должен содержать как минимум 8 символов')
      .matches(/^[^\u0400-\u04FF]+$/, 'Пароль не должен содержать кириллицу'),
  })

  const onActiveItem = (role: string) => {
    setActiveRole(role)
    setOpen(false)
  }

  const onOpenDropDown = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setOpen(!open)
  }

  const handleCityInputChange = async (value: string) => {
    setCity(value)

    if (value.trim().length >= 1) {
      await dispatch(getDaDataCity({ query: city }))
    } else {
      setCitySuggestions([])
    }
  }

  const handleInnInputChange = async (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    setInn(numericValue.trim())
  }

  const handleSelectSuggestion = (selectedCity: string) => {
    setCity(selectedCity)
    setCitySuggestions([])
  }

  const clearAllInputs = () => {
    setCity('')
    setActiveRole('Выберите роль')
    setCitySuggestions([])
    setInn('')
    setSubmittedValues(null)
    dispatch(clearDadata())
  }

  const handleSubmitHandler = async (values: FormikValues) => {
    setSubmittedValues({ ...values, inn, city })
    const mobileWithoutSymbols = `+${values.phone.replace(/[\D]+/g, '')}`
    const role = createRoleCompanyFromRuToEn(activeRole)

    if (activeRole === 'Выберите роль') {
      setRoleError('Пожалуйста выберите роль вашей организации')
      waitTimer(() => setRoleError(''))
      return
    }

    if (city === '') {
      setRoleError('')
      setCityError('Пожалуйста выберите город вашей организации')
      waitTimer(() => setCityError(''))
      return
    }

    if (daDataCompany.suggestions.length === 0) {
      return
    }

    const resultAction = await dispatch(
      registrationRequest({
        role: role,
        contactPhone: mobileWithoutSymbols,
        city: city,
        address: values.address,
        contactFullName: values.fullName,
        companyName: values.name,
        inn: inn,
        email: values.email,
        password: values.password,
      }),
    )

    if (registrationRequest.rejected.match(resultAction)) {
      waitTimer(() => dispatch(clearError()))
    } else {
      setActiveRole('Выберите роль')
      navigate(PATH.registerConfirmation)
    }
  }

  useEffect(() => {
    if (debounced) {
      setLoader(true)
      dispatch(getDaDataCompany({ query: debounced }))
      const timer = setTimeout(() => {
        setLoader(false)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [debounced, dispatch])

  useEffect(() => {
    setCitySuggestions(daDataCity)
  }, [daDataCity])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div
      className={styles.registrationPage}
      style={{
        background: `linear-gradient(90deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), url(${mainBackground}), lightgray 50% / cover no-repeat`,
      }}
    >
      {!loader ? (
        <div className={s.container}>
          <HeaderForAuth />
          <div className={styles.formContentBlock}>
            <h1 className={s.whiteTitle}>Запрос на регистрацию</h1>
            <Formik
              initialValues={
                submittedValues || {
                  name: daDataCompany?.suggestions[0]?.data?.name?.full
                    ? String(daDataCompany?.suggestions[0]?.data?.name?.full)
                    : '',
                  address: daDataCompany?.suggestions[0]?.data?.address?.value
                    ? String(daDataCompany?.suggestions[0]?.data?.address?.value)
                    : '',
                  fullName: daDataCompany?.suggestions[0]?.data?.management?.name
                    ? String(daDataCompany?.suggestions[0]?.data?.management?.name)
                    : '',
                  phone: '',
                  email: '',
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
                  <div className={styles.formContainer}>
                    <div className={styles.leftBlock}>
                      <div className={styles.inputGroup}>
                        <h4 className={s.whiteSubtitle}>ИНН</h4>
                        <CustomInput
                          type='text'
                          placeholder='ИНН'
                          required
                          onChange={(e) => handleInnInputChange(e.target.value)}
                          value={inn.trim()}
                          className={
                            daDataCompany.suggestions.length === 0
                              ? `${s.inputError} ${s.input}`
                              : s.input
                          }
                        />
                        <div className={s.errorContainer}>
                          {daDataCompany.suggestions.length === 0 && (
                            <p className={s.errorValidation}>Организация с таким ИНН не найдена</p>
                          )}
                        </div>
                        <h4 className={s.whiteSubtitle}>Название организации</h4>
                        <CustomInput
                          type='text'
                          placeholder='Название организации'
                          name='name'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          className={errors.name && touched.name ? s.inputError : s.input}
                        />
                        <div className={s.errorContainer}>
                          {touched.name && errors.name && (
                            <p className={s.errorValidation}>{errors.name as string}</p>
                          )}
                        </div>
                        <h4 className={s.whiteSubtitle}>Город</h4>
                        <div className={styles.cityBlock}>
                          <CustomInput
                            type='text'
                            placeholder='Город'
                            name='city'
                            required
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleCityInputChange(e.target.value)
                            }
                            value={city}
                            className={cityError ? `${s.input} ${s.inputError}` : s.input}
                          />
                          <ul className={styles.suggestionsDropdown}>
                            {citySuggestions.map((suggestion: Suggestion, index: number) => (
                              <li
                                key={index}
                                onClick={() => handleSelectSuggestion(suggestion.data.city)}
                              >
                                {suggestion.data.city}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className={s.errorContainer}>
                          {touched.city && errors.city && (
                            <p className={s.errorValidation}>{errors.city as string}</p>
                          )}
                        </div>

                        <h4 className={s.whiteSubtitle}>Адрес</h4>
                        <CustomInput
                          type='text'
                          placeholder='Адрес'
                          name='address'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.address}
                          className={errors.address && touched.address ? s.inputError : s.input}
                        />
                        <div className={s.errorContainer}>
                          {touched.address && errors.address && (
                            <p className={s.errorValidation}>{errors.address as string}</p>
                          )}
                        </div>
                        <h4 className={s.whiteSubtitle}>ФИО контактного лица</h4>
                        <CustomInput
                          type='text'
                          placeholder='ФИО контактного лица'
                          name='fullName'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.fullName}
                          className={errors.fullName && touched.fullName ? s.inputError : s.input}
                        />
                        <div className={s.errorContainer}>
                          {touched.fullName && errors.fullName && (
                            <p className={s.errorValidation}>{errors.fullName as string}</p>
                          )}
                        </div>
                      </div>
                      {!isMobile && (
                        <>
                          {roleError && (
                            <p className={`${s.errorValidation} ${s.networkError}`}>{roleError}</p>
                          )}
                          {cityError && (
                            <p className={`${s.errorValidation} ${s.networkError}`}>{cityError}</p>
                          )}
                          {error && (
                            <p className={`${s.errorValidation} ${s.networkError}`}>
                              {error || 'произошла серверная ошибка'}
                            </p>
                          )}
                          <div style={{ marginTop: 20 }} className={styles.buttonGroup}>
                            <CustomButton
                              title='Отправить'
                              disabled={!isValid}
                              onClick={() => handleSubmit()}
                              type='submit'
                              className={s.submitBtn}
                            />
                            <Link
                              to={PATH.authPage}
                              className={styles.passwordLinkWithoutLine}
                              onClick={clearAllInputs}
                            >
                              <span>К входу</span>
                            </Link>
                          </div>
                        </>
                      )}
                    </div>

                    <div className={styles.rightBlock}>
                      <div className={styles.inputGroup}>
                        <h4 className={s.whiteSubtitle}>Номер телефона</h4>
                        <InputMask
                          mask='+7 (999) 999 9999'
                          type='phone'
                          placeholder='Номер телефона'
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
                        <div className={s.errorContainer}>
                          {touched.phone && errors.phone && (
                            <p className={s.errorValidation}>{errors.phone as string}</p>
                          )}
                        </div>
                        <h4 className={s.whiteSubtitle}>Электронная почта/Логин</h4>
                        <CustomInput
                          type='text'
                          placeholder='Электронная почта/Логин'
                          name='email'
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email.trim()}
                          className={errors.email && touched.email ? s.inputError : s.input}
                        />
                        <div className={s.errorContainer}>
                          {touched.email && errors.email && (
                            <p className={s.errorValidation}>{errors.email as string}</p>
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
                        <h4 className={s.whiteSubtitle}>Роль</h4>
                        <div
                          className={roleError ? `${styles.role} ${s.inputError}` : styles.role}
                          onClick={(e) => onOpenDropDown(e)}
                        >
                          <div className={styles.roleContainer}>
                            <div className={styles.roleText}>{activeRole}</div>
                            <img className={styles.roleIcon} src={arrowDown} alt='arrowDown' />
                          </div>
                          <DropDown className={styles.dropDown} open={open}>
                            {dropDownOptions.map((option, index) => {
                              return (
                                <div
                                  className={`${styles.dropDownItem} ${
                                    activeRole && styles.active
                                  }`}
                                  onClick={() => onActiveItem(option)}
                                  key={index}
                                >
                                  {option}
                                </div>
                              )
                            })}
                          </DropDown>
                        </div>
                      </div>
                    </div>
                    {isMobile && (
                      <div className={styles.mobileBtnsBlock}>
                        {roleError && (
                          <p className={`${s.errorValidation} ${s.networkError}`}>{roleError}</p>
                        )}
                        {cityError && (
                          <p className={`${s.errorValidation} ${s.networkError}`}>{cityError}</p>
                        )}
                        {error && (
                          <p className={`${s.errorValidation} ${s.networkError}`}>{error}</p>
                        )}
                        <div style={{ marginTop: 20 }} className={styles.buttonGroup}>
                          <CustomButton
                            title='Отправить'
                            disabled={!isValid}
                            onClick={() => handleSubmit()}
                            type='submit'
                            className={s.submitBtn}
                          />
                          <Link
                            to={PATH.authPage}
                            className={styles.passwordLinkWithoutLine}
                            onClick={clearAllInputs}
                          >
                            К входу
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }}
            </Formik>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default RegistrationPage
