import React, { FC, useState } from 'react'
import styles from './EditCompanyShortInformation.module.css'
import { Formik, FormikValues } from 'formik'
import TitleForEditBlockWithButton from '../TitleForEditBlockWithButton/TitleForEditBlockWithButton'
import CustomInput from '../UI/CustomInput/CustomInput'
import InputMask from 'react-input-mask'
import s from '../../styles/common/Form.module.css'
import p from '../UI/CustomInput/CustomInput.module.css'
import editIcon from '../../assets/icons/orangePencil.svg'
import InformationItem from '../InformationItem/InformationItem'
import * as yup from 'yup'
import { useMediaQuery } from 'react-responsive'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { waitTimer } from '../../utils/waitTimer'
import {
  changeCompanyShortInformation,
  getCurrentCompany,
} from '../../redux/actions/companiesAction'

export type EditCompanyShortInformationPropsType = {
  companyId: number
  city: string
  address: string
  phone: string
  email: string
}

const EditCompanyShortInformation: FC<EditCompanyShortInformationPropsType> = ({
  companyId,
  phone,
  email,
  city,
  address,
}) => {
  const [editMode, setEditMode] = useState(false)
  const [companyError, setCompanyError] = useState<boolean>(false)
  const [companyConfirm, setCompanyConfirm] = useState<boolean>(false)

  const { userRole, token } = useAppSelector((state) => state.auth)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const dispatch = useAppDispatch()

  const handleSubmitHandler = async (values: FormikValues) => {
    const mobileWithoutSymbols = `+${values.phone.replace(/[\D]+/g, '')}`

    const resultAction = await dispatch(
      changeCompanyShortInformation({
        token,
        companyId: String(companyId),
        email: values.email,
        contactPhone: mobileWithoutSymbols,
        city: values.city,
        address: values.address,
      }),
    )

    if (changeCompanyShortInformation.rejected.match(resultAction)) {
      setCompanyError(true)
      waitTimer(() => setCompanyError(false))
    } else {
      setCompanyConfirm(true)
      waitTimer(() => setCompanyConfirm(false))
      setCompanyError(false)
      setEditMode(false)
      await dispatch(getCurrentCompany({ companyId: String(companyId), token }))
    }
  }

  const validationSchema = yup.object().shape({
    city: yup.string().required('Поле является обязательным'),
    address: yup.string().required('Поле является обязательным'),
    phone: yup.string().required('Поле является обязательным'),
    email: yup.string().required('Поле является обязательным'),
  })

  const handleEditMode = () => {
    setEditMode(true)
  }

  return (
    <div className={styles.editCompanyShortInformation}>
      {editMode ? (
        <div className={styles.editMode}>
          <Formik
            initialValues={{
              city: city ? city : '',
              address: address ? address : '',
              email: email ? email : '',
              phone: phone ? phone : '',
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
                  <TitleForEditBlockWithButton
                    title='Общая информация'
                    handleSubmit={handleSubmit}
                  />
                  <div className={styles.container}>
                    <div className={styles.fullNameBlock}>
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
                    <div className={styles.fullNameBlock}>
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
                    <div className={styles.phoneBlock}>
                      <div className={styles.leftBlock}>Номер телефона</div>
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
                    <div className={styles.fullNameBlock}>
                      <div className={styles.leftBlock}>E-mail</div>
                      <div className={styles.rightBlock}>
                        <CustomInput
                          type='text'
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
                          Произошла ошибка при изменении данных. Попробуйте еще раз...
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
            <h2 className={styles.title}>Общая информация</h2>
            {userRole !== 'employeePlace' && userRole !== 'employeeAgent' && (
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
          <div className={styles.container}>
            <InformationItem title='Город' value={city} />
            <InformationItem title='Адрес' value={address} />
            <InformationItem title='Телефон' value={phone} />
            <InformationItem title='E-mail' value={email} />
          </div>
        </div>
      )}
    </div>
  )
}

export default EditCompanyShortInformation
