import React, { FC, useState } from 'react'
import * as yup from 'yup'
import { Formik, FormikValues } from 'formik'
import styles from '../EditCompanyCardMainInformation/EditCompanyCardMainInformation.module.css'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import CustomInput from '../UI/CustomInput/CustomInput'
import { useMediaQuery } from 'react-responsive'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { StaffType } from '../../redux/actions/types'
import { changeCurrentStaffMainInformation } from '../../redux/actions/staffAction'
import { useNavigate, useParams } from 'react-router-dom'
import PATH from '../../navigation/path'
import s from '../../styles/common/Form.module.css'
import MobileButtons from '../UI/MobileButtons/MobileButtons'
import { waitTimer } from '../../utils/waitTimer'
import p from '../UI/CustomInput/CustomInput.module.css'
import InputMask from 'react-input-mask'

export type EditStaffMainInformationPropsType = {
  staffData: StaffType
}

const EditStaffMainInformation: FC<EditStaffMainInformationPropsType> = ({ staffData }) => {
  const [staffError, setStaffError] = useState<boolean>(false)
  const [staffConfirm, setStaffConfirm] = useState<boolean>(false)

  const { token } = useAppSelector((state) => state.auth)

  const { companyId } = useParams<{ companyId: string }>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validationSchema = yup.object().shape({
    fullName: yup.string().required('Поле является обязательным'),
    phone: yup
      .string()
      .required('Поле является обязательным')
      .matches(
        /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
        'Неверный формат',
      ),
    companyName: yup.string().required('Поле является обязательным'),
  })

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const handleSubmitHandler = async (values: FormikValues) => {
    const resultAction = await dispatch(
      changeCurrentStaffMainInformation({
        token,
        staffId: String(staffData.id),
        phone: values.phone,
        fullName: values.fullName,
      }),
    )

    if (changeCurrentStaffMainInformation.rejected.match(resultAction)) {
      setStaffError(true)
      waitTimer(() => setStaffError(false))
    } else {
      setStaffConfirm(true)
      waitTimer(() => setStaffConfirm(false))
      setStaffError(false)
    }
  }

  const handleCancel = () => {
    navigate(`${PATH.companyStaffCardPage}${companyId}/${String(staffData.id)}`)
  }

  return (
    <div className={styles.mainInformationBlock}>
      <Formik
        initialValues={{
          fullName: staffData.user.fullName,
          phone: staffData.user.phone,
          companyName: staffData.company.name,
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
                <div className={styles.fullNameBlock}>
                  <div className={styles.leftBlock}>ФИО</div>
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
                <div className={styles.roleBlock}>
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
                {/* <div className={styles.cityBlock}> */}
                {/*   <div className={styles.leftBlock}>Электронная почта</div> */}
                {/*   <div className={styles.rightBlock}> */}
                {/*     <CustomInput */}
                {/*       type='text' */}
                {/*       placeholder='' */}
                {/*       name='email' */}
                {/*       required */}
                {/*       onChange={handleChange} */}
                {/*       onBlur={handleBlur} */}
                {/*       value={values.email} */}
                {/*       className={ */}
                {/*         errors.email && touched.email */}
                {/*           ? `${styles.inputError} ${styles.input}` */}
                {/*           : styles.input */}
                {/*       } */}
                {/*     /> */}
                {/*   </div> */}
                {/* </div> */}
                <div className={styles.companyNameBlock}>
                  <div className={styles.leftBlock}>Компания</div>
                  <div className={styles.rightBlock}>
                    <div className={styles.companyBlock}>{values.companyName}</div>
                  </div>
                </div>
                <>
                  {staffError && (
                    <p className={`${s.errorValidation} ${s.networkError}`}>
                      Произошла ошибка при изменении данных. Попробуйте еще раз...
                    </p>
                  )}
                </>
                <>
                  {staffConfirm && (
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

export default EditStaffMainInformation
