import React, { FC, useState } from 'react'
import usePasswordToggle from '../../hooks/usePasswordToggle'
import * as yup from 'yup'
import { Formik, FormikValues } from 'formik'
import styles from './CreateStaff.module.css'
import PopupHeader from '../PopupHeader/PopupHeader'
import s from '../../styles/common/Form.module.css'
import CustomInput from '../UI/CustomInput/CustomInput'
import CustomRadio from '../UI/CustomRadio/CustomRadio'
import CustomButton from '../UI/CustomButton/CustomButton'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { createRoleForRegister } from '../../utils/createRoleForRegister'
import { createStaff, getStaff } from '../../redux/actions/staffAction'
import { useParams } from 'react-router-dom'
import { waitTimer } from '../../utils/waitTimer'
import p from '../UI/CustomInput/CustomInput.module.css'
import InputMask from 'react-input-mask'
import { staffPerPage } from '../../constants/constants'

export type CreateUserPropsType = {
  onClickHandler: () => void
}

const CreateStaff: FC<CreateUserPropsType> = ({ onClickHandler }) => {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle()
  const [submittedValues, setSubmittedValues] = useState<any>(null)

  const { companyId } = useParams<{ companyId: string }>()

  const { currentCompany } = useAppSelector((state) => state.companies)
  const { token } = useAppSelector((state) => state.auth)
  const { error } = useAppSelector((state) => state.staff)

  const [postStaffError, setPostStaffError] = useState<string>('')

  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    role: yup.string().required('Поле является обязательным'),
    fullName: yup.string().required('Поле является обязательным'),
    phone: yup.string().required('Поле является обязательным'),
    email: yup
      .string()
      .email('К сожалению, почта введена неверно, попробуйте еще раз')
      .required('Поле является обязательным'),
    password: yup
      .string()
      .required('Поле является обязательным')
      .min(8, 'Пароль должен' + ' содержать' + ' минимум 8' + ' символов')
      .matches(/^[^\u0400-\u04FF]+$/, 'Пароль не должен содержать кириллицу'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    setSubmittedValues(values)
    const mobileWithoutSymbols = `+${values.phone.replace(/[\D]+/g, '')}`
    const resultAction = await dispatch(
      createStaff({
        token,
        fullName: values.fullName,
        phone: mobileWithoutSymbols,
        email: values.email,
        password: values.password,
        role: createRoleForRegister(values.role),
        companyId: companyId,
      }),
    )

    if (createStaff.rejected.match(resultAction)) {
      setPostStaffError(error)
      waitTimer(() => setPostStaffError(''))
    } else {
      onClickHandler()
      setPostStaffError('')
      await dispatch(getStaff({ companyId, token, page: 1, itemsPerPage: staffPerPage }))
    }
  }

  return (
    <div className={styles.createUser}>
      <div className={styles.headerForm}>
        <PopupHeader title='Создание сотрудника' onClickHandler={onClickHandler} />
      </div>
      <div className={styles.form}>
        <Formik
          initialValues={
            submittedValues || {
              fullName: '',
              phone: '',
              email: '',
              password: '',
              role: '',
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
                  <h4 className={styles.subtitle}>
                    ФИО<span className={s.redStar}>*</span>
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
                    <p className={s.errorValidation}>{errors.fullName as string}</p>
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
                        ? `${s.inputError} ${p.input} ${styles.input}`
                        : `${p.input} ${styles.input}`
                    }
                  ></InputMask>
                  {touched.phone && errors.phone && (
                    <p className={s.errorValidation}>{errors.phone as string}</p>
                  )}

                  <h4 className={styles.subtitle}>
                    Электронная почта<span className={s.redStar}>*</span>
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
                    <p className={s.errorValidation}>{errors.email as string}</p>
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
                    <p className={s.errorValidation}>{errors.password as string}</p>
                  )}

                  <h4 className={styles.subtitle}>
                    Роль<span className={s.redStar}>*</span>
                  </h4>
                  <CustomRadio
                    options={
                      currentCompany.role === 'directorPlace'
                        ? ['Директор-Площадка', 'Площадка']
                        : ['Директор-Агент', 'Агент']
                    }
                    name='role'
                    onChange={handleChange}
                    value={values.role}
                  />
                  <>
                    {error && <p className={`${s.errorValidation} ${s.networkError}`}>{error}</p>}
                  </>
                </div>
                <div className={s.buttonGroup}>
                  <CustomButton
                    className={styles.submitBtn}
                    title='Создать сотрудника'
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

export default CreateStaff
