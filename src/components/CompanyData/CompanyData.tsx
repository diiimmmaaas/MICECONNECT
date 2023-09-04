import React, { FC, useState } from 'react'
import styles from './CompanyData.module.css'
import { Formik, FormikValues } from 'formik'
import TitleForEditBlockWithButton from '../TitleForEditBlockWithButton/TitleForEditBlockWithButton'
import CustomInput from '../UI/CustomInput/CustomInput'
import s from '../../styles/common/Form.module.css'
import p from '../UI/CustomInput/CustomInput.module.css'
import editIcon from '../../assets/icons/orangePencil.svg'
import InformationItem from '../InformationItem/InformationItem'
import * as yup from 'yup'
import {
  createRoleCompanyFromEnToRu,
  createRoleCompanyFromRuToEn,
} from '../../utils/createRoleForRegister'
import { changeCompanyMainInformation } from '../../redux/actions/companiesAction'
import { waitTimer } from '../../utils/waitTimer'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getMe } from '../../redux/actions/meAction'

export type CompanyDataPropsType = {
  companyId: number
  companyName: string
  inn: string
  role: string | undefined
  city: string
  address: string
  email: string
}

const CompanyData: FC<CompanyDataPropsType> = ({
  companyId,
  companyName,
  role,
  inn,
  email,
  city,
  address,
}) => {
  const [editMode, setEditMode] = useState(false)
  const [companyError, setCompanyError] = useState<boolean>(false)
  const [companyConfirm, setCompanyConfirm] = useState<boolean>(false)

  const { token, userRole } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    companyName: yup.string().required('Поле является обязательным'),
    city: yup.string().required('Поле является обязательным'),
    address: yup.string().required('Поле является обязательным'),
    email: yup
      .string()
      .email('К сожалению, почта введена неверно, попробуйте еще раз')
      .required('Поле является обязательным'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const resultAction = await dispatch(
      changeCompanyMainInformation({
        token,
        companyId: String(companyId),
        name: values.companyName,
        email: values.email,
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
      setEditMode(false)
      await dispatch(getMe({ token }))
    }
  }

  const handleEditMode = () => {
    setEditMode(true)
  }

  return (
    <div className={styles.aboutMe}>
      {editMode ? (
        <div className={styles.editMode}>
          <Formik
            initialValues={{
              companyName: companyName ? companyName : '',
              inn: inn ? inn : '',
              role: role ? createRoleCompanyFromEnToRu(role) : '',
              city: city ? city : '',
              address: address ? address : '',
              email: email ? email : '',
            }}
            validateOnBlur
            onSubmit={(values) => handleSubmitHandler(values)}
            validationSchema={validationSchema}
          >
            {(props) => {
              const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } =
                props

              return (
                <>
                  <TitleForEditBlockWithButton title='Обо мне' handleSubmit={handleSubmit} />
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
                      <div className={styles.leftBlock}>Инн</div>
                      <div className={styles.rightBlock}>
                        <div className={styles.companyBlock}>{values.inn}</div>
                        {touched.inn && errors.inn && (
                          <p style={{ textAlign: 'start' }} className={s.errorValidation}>
                            {errors.inn}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={styles.companyNameBlock}>
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
                    <div className={styles.companyNameBlock}>
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
                    <div className={styles.companyNameBlock}>
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
                    <div className={styles.companyNameBlock}>
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
                        <p className={`${s.confirmValidation} ${s.networkConfirm}`}>
                          Данные обновлены
                        </p>
                      )}
                    </>
                  </div>
                </>
              )
            }}
          </Formik>
        </div>
      ) : (
        <div className={styles.staticInformation}>
          <div className={styles.header}>
            <h2 className={styles.title}>Компания</h2>
            {userRole !== 'employeeAgent' && userRole !== 'employeePlace' && (
              <div className={styles.editIconBlock}>
                <img
                  onClick={handleEditMode}
                  className={styles.editIcon}
                  src={editIcon}
                  alt='editIcon'
                />
              </div>
            )}
          </div>
          <div className={styles.mainInformationContainer}>
            <InformationItem title='Название организации' value={companyName} />
            <InformationItem notEdit title='ИНН' value={inn} />
            <InformationItem notEdit title='Роль' value={createRoleCompanyFromEnToRu(role)} />
            <InformationItem title='Город' value={city} />
            <InformationItem title='Адрес' value={address} />
            <InformationItem title='Электронная почта' value={email} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyData
