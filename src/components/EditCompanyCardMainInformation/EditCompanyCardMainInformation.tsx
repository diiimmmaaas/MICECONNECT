import React, { FC, useState } from 'react'
import styles from './EditCompanyCardMainInformation.module.css'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import CustomInput from '../UI/CustomInput/CustomInput'
import { Formik, FormikValues } from 'formik'
import * as yup from 'yup'
import { useMediaQuery } from 'react-responsive'
import { CompaniesType } from '../../redux/actions/types'
import {
  createRoleCompanyFromEnToRu,
  createRoleCompanyFromRuToEn,
} from '../../utils/createRoleForRegister'
import { changeCompanyMainInformation } from '../../redux/actions/companiesAction'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import s from '../../styles/common/Form.module.css'
import MobileButtons from '../UI/MobileButtons/MobileButtons'
import { waitTimer } from '../../utils/waitTimer'
import p from '../UI/CustomInput/CustomInput.module.css'
import InputMask from 'react-input-mask'

export type EditCompanyCardMainInformationPropsType = {
  companyData: CompaniesType
}

const EditCompanyCardMainInformation: FC<EditCompanyCardMainInformationPropsType> = ({
  companyData,
}) => {
  const [companyError, setCompanyError] = useState<boolean>(false)
  const [companyConfirm, setCompanyConfirm] = useState<boolean>(false)

  const { token } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validationSchema = yup.object().shape({
    companyName: yup.string().required('Поле является обязательным'),
    inn: yup.string().required('Поле является обязательным'),
    role: yup
      .string()
      .required('Поле является обязательным')
      .oneOf(['Площадка', 'Агент'] as const, 'Роль может быть только' + ' Площадка или Агент'),
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
  })

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const handleSubmitHandler = async (values: FormikValues) => {
    const mobileWithoutSymbols = `+${values.phone.replace(/[\D]+/g, '')}`
    const resultAction = await dispatch(
      changeCompanyMainInformation({
        token,
        companyId: String(companyData.id),
        name: values.companyName,
        email: values.email,
        contactPhone: mobileWithoutSymbols,
        contactFullName: values.fullName,
        city: values.city,
        address: values.address,
        role: createRoleCompanyFromRuToEn(values.role),
      }),
    )

    if (changeCompanyMainInformation.rejected.match(resultAction)) {
      setCompanyError(true)
      waitTimer(() => setCompanyError(false))
    } else {
      setCompanyConfirm(true)
      waitTimer(() => setCompanyConfirm(false))
      setCompanyError(false)
    }
  }

  const handleCancel = () => {
    navigate(`${PATH.companyCardPage}${companyData.id}`)
  }

  return (
    <div className={styles.mainInformationBlock}>
      <Formik
        initialValues={{
          companyName: companyData.name,
          inn: companyData.inn,
          role: createRoleCompanyFromEnToRu(companyData.role),
          city: companyData.city,
          address: companyData.address,
          fullName: companyData.contactFullName,
          phone: companyData.contactPhone,
          email: companyData.email,
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
                title='Основная информация'
                disabled={!isValid}
                handleSubmit={handleSubmit}
                handleReset={handleCancel}
              />
              <div className={styles.container}>
                <div className={styles.companyNameBlock}>
                  <div className={styles.leftBlock}>Название организации</div>
                  <div className={styles.rightBlock}>
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
                  </div>
                </div>
                <div className={styles.companyNameBlock}>
                  <div className={styles.leftBlock}>ИНН</div>
                  <div className={styles.rightBlock}>
                    <div className={styles.companyBlock}>{values.inn}</div>
                  </div>
                </div>
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
                <div className={styles.cityBlock}>
                  <div className={styles.leftBlock}>Город</div>
                  <div className={styles.rightBlock}>
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
                  </div>
                </div>
                <div className={styles.cityBlock}>
                  <div className={styles.leftBlock}>Адрес</div>
                  <div className={styles.rightBlock}>
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
                  </div>
                </div>
                <div className={styles.fullNameBlock}>
                  <div className={styles.leftBlock}>ФИО контактного лица</div>
                  <div className={styles.rightBlock}>
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
                  </div>
                </div>
                <div className={styles.phoneBlock}>
                  <div className={styles.leftBlock}>Телефон контактного лица</div>
                  <div className={styles.rightBlock}>
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
                          ? `${s.inputError} ${p.input} ${styles.input}`
                          : `${p.input} ${styles.input}`
                      }
                    ></InputMask>
                  </div>
                </div>
                <div className={styles.emailBlock}>
                  <div className={styles.leftBlock}>Электронная почта</div>
                  <div className={styles.rightBlock}>
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
                  </div>
                </div>
                <>
                  {companyError && (
                    <p className={`${s.errorValidation} ${s.networkError}`}>
                      Произошла ошибка при обновлении данных. Попробуйте еще раз...
                    </p>
                  )}
                </>
                <>
                  {companyConfirm && (
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

export default EditCompanyCardMainInformation
