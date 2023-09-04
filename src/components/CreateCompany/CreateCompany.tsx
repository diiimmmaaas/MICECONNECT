import React, { FC, useEffect, useState } from 'react'
import * as yup from 'yup'
import { Formik, FormikValues } from 'formik'
import styles from './CreateCompany.module.css'
import PopupHeader from '../PopupHeader/PopupHeader'
import s from '../../styles/common/Form.module.css'
import CustomInput from '../UI/CustomInput/CustomInput'
import CustomButton from '../UI/CustomButton/CustomButton'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useDebounce } from '../../hooks/useDebounce'
import { getDaDataCompany } from '../../redux/actions/daDataAction'
import Loader from '../UI/Loader/Loader'
import { createCompany, getCompanies } from '../../redux/actions/companiesAction'
import CustomRadio from '../UI/CustomRadio/CustomRadio'
import {
  createRoleCompanyFromRuToEn,
  createRoleForRegister,
} from '../../utils/createRoleForRegister'
import { waitTimer } from '../../utils/waitTimer'
import p from '../UI/CustomInput/CustomInput.module.css'
import InputMask from 'react-input-mask'
import { companiesPerPage } from '../../constants/constants'

export type CreateCompanyPropsType = {
  onClickHandler: () => void
}

const CreateCompany: FC<CreateCompanyPropsType> = ({ onClickHandler }) => {
  const [inn, setInn] = useState<string>('')
  const [companyError, setCompanyError] = useState<boolean>(false)

  const debounced = useDebounce(inn)

  const { daDataCompany, loading } = useAppSelector((state) => state.daData)
  const { token } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    companyName: yup.string().required('Поле является обязательным'),
    city: yup.string().required('Поле является обязательным'),
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
      .email('К сожалению, почта введена неверно, попробуйте еще раз')
      .required('Поле является обязательным'),
    role: yup.string().required('Поле является обязательным'),
    comment: yup.string().required('Поле является обязательным'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const mobileWithoutSymbols = `+${values.phone.replace(/[\D]+/g, '')}`
    const resultAction = await dispatch(
      createCompany({
        token,
        inn: inn,
        role: createRoleCompanyFromRuToEn(values.role),
        city: values.city,
        address: values.address,
        contactFullName: values.fullName,
        email: values.email,
        name: values.companyName,
        contactPhone: mobileWithoutSymbols,
        description: values.comment,
      }),
    )

    if (createCompany.rejected.match(resultAction)) {
      setCompanyError(true)
      waitTimer(() => setCompanyError(false))
    } else {
      await dispatch(getCompanies({ token, page: 1, itemsPerPage: companiesPerPage }))
      onClickHandler()
      setCompanyError(false)
    }
  }

  useEffect(() => {
    dispatch(getDaDataCompany({ query: debounced }))
  }, [debounced, dispatch])

  if (loading) {
    return <Loader />
  }

  return (
    <div className={styles.createCompany}>
      <div className={styles.headerForm}>
        <PopupHeader title='Создание компании' onClickHandler={onClickHandler} />
      </div>
      <div className={styles.companyForm}>
        <h4 className={styles.subtitle}>
          Инн<span className={s.redStar}>*</span>
        </h4>
        <CustomInput
          type='text'
          placeholder=''
          required
          onChange={(e) => setInn(e.target.value)}
          value={inn}
          className={styles.input}
        />
        <Formik
          initialValues={{
            companyName: daDataCompany?.suggestions[0]?.data?.name?.full
              ? String(daDataCompany?.suggestions[0]?.data?.name?.full)
              : '',
            city: daDataCompany?.suggestions[0]?.data?.address?.data?.city
              ? String(daDataCompany?.suggestions[0]?.data?.address?.data?.city)
              : '',
            address: daDataCompany?.suggestions[0]?.data?.address?.value
              ? String(daDataCompany?.suggestions[0]?.data?.address?.value)
              : '',
            fullName: daDataCompany?.suggestions[0]?.data?.management?.name
              ? String(daDataCompany?.suggestions[0]?.data?.management?.name)
              : '',
            phone: '',
            email: '',
            comment: '',
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
                    Название организации<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='companyName'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.companyName}
                    className={
                      errors.companyName && touched.companyName
                        ? `${styles.inputError} ${styles.input}`
                        : styles.input
                    }
                  />
                  {touched.companyName && errors.companyName && (
                    <p className={s.errorValidation}>{errors.companyName}</p>
                  )}
                  <h4 className={styles.subtitle}>
                    Город<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='city'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.city}
                    className={
                      errors.city && touched.city
                        ? `${styles.inputError} ${styles.input}`
                        : styles.input
                    }
                  />
                  {touched.city && errors.city && (
                    <p className={s.errorValidation}>{errors.city}</p>
                  )}
                  <h4 className={styles.subtitle}>
                    Адрес<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='address'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                    className={
                      errors.address && touched.address
                        ? `${styles.inputError} ${styles.input}`
                        : styles.input
                    }
                  />
                  {touched.address && errors.address && (
                    <p className={s.errorValidation}>{errors.address}</p>
                  )}
                  <h4 className={styles.subtitle}>
                    ФИО контактного лица<span className={s.redStar}>*</span>
                  </h4>
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
                  {touched.fullName && errors.fullName && (
                    <p className={s.errorValidation}>{errors.fullName}</p>
                  )}
                  <h4 className={styles.subtitle}>
                    Телефон контактного лица<span className={s.redStar}>*</span>
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
                    Электронная почта<span className={s.redStar}>*</span>
                  </h4>
                  <CustomInput
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
                    Роль<span className={s.redStar}>*</span>
                  </h4>
                  <CustomRadio
                    options={['Агент', 'Площадка']}
                    name='role'
                    onChange={handleChange}
                    value={values.role}
                  />
                  <h4 className={styles.subtitle}>Комментарий</h4>
                  <div className={styles.textareaBlock}>
                    <textarea
                      name='comment'
                      placeholder='Оставьте комментарий'
                      value={values.comment}
                      className={styles.textarea}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete='on'
                    />
                  </div>
                  {touched.comment && errors.comment && (
                    <p className={s.errorValidation}>{errors.comment}</p>
                  )}
                  <>
                    {companyError && (
                      <p className={`${s.errorValidation} ${s.networkError}`}>
                        Произошла ошибка создании компании. Проверьте правильность введенных данных,
                        а также наличие компании с таким ИНН в базе данных.
                      </p>
                    )}
                  </>
                </div>
                <div className={s.buttonGroup}>
                  <CustomButton
                    className={styles.submitBtn}
                    title='Создать компанию'
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

export default CreateCompany
