import React, { FC, useState } from 'react'
import styles from './AdminCardMainInformation.module.css'
import editIcon from '../../assets/icons/orangePencil.svg'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import CustomInput from '../UI/CustomInput/CustomInput'
import { Formik, FormikValues } from 'formik'
import * as yup from 'yup'
import InformationItem from '../InformationItem/InformationItem'
import { GetCurrentAdminResponseType } from '../../redux/actions/types'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { changeAdminMainInformation } from '../../redux/actions/adminsAction'
import s from '../../styles/common/Form.module.css'
import { useMediaQuery } from 'react-responsive'
import MobileButtons from '../UI/MobileButtons/MobileButtons'
import { waitTimer } from '../../utils/waitTimer'
import InputMask from 'react-input-mask'
import p from '../UI/CustomInput/CustomInput.module.css'

export type AdminCardMainInformationPropsType = {
  adminData: GetCurrentAdminResponseType
}

const AdminCardMainInformation: FC<AdminCardMainInformationPropsType> = ({ adminData }) => {
  const [editMode, setEditMode] = useState(false)

  const { token } = useAppSelector((state) => state.auth)

  const [adminError, setAdminError] = useState<boolean>(false)
  const [adminConfirm, setAdminConfirm] = useState<boolean>(false)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    fullName: yup.string().required('Поле является обязательным'),
    phone: yup.string().required('Поле является обязательным'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    const mobileWithoutSymbols = `+${values.phone.replace(/[\D]+/g, '')}`

    const resultAction = await dispatch(
      changeAdminMainInformation({
        token,
        adminId: String(adminData.id),
        fullName: values.fullName,
        phone: mobileWithoutSymbols,
      }),
    )

    if (changeAdminMainInformation.rejected.match(resultAction)) {
      setAdminError(true)
      waitTimer(() => setAdminError(false))
    } else {
      setAdminConfirm(true)
      waitTimer(() => setAdminConfirm(false))
      setAdminError(false)
    }
  }

  const handleCancel = async () => {
    setEditMode(false)
  }

  const handleEditMode = () => {
    setEditMode(true)
  }

  return (
    <div className={styles.mainInformation}>
      {editMode ? (
        <div className={styles.editMode}>
          <Formik
            initialValues={{
              fullName: adminData.fullName,
              phone: adminData.phone,
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
                    <>
                      {adminError && (
                        <p className={`${s.errorValidation} ${s.networkError}`}>
                          Произошла ошибка при изменении данных. Попробуйте еще раз...
                        </p>
                      )}
                    </>
                    <>
                      {adminConfirm && (
                        <p className={`${s.confirmValidation} ${s.networkConfirm}`}>
                          Данные обновлены
                        </p>
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
      ) : (
        <div className={styles.staticInformation}>
          <div className={styles.header}>
            <h2 className={styles.title}>Основная информация</h2>
            <div className={styles.editIconBlock}>
              <img
                onClick={handleEditMode}
                className={styles.editIcon}
                src={editIcon}
                alt='editIcon'
              />
            </div>
          </div>
          <div className={styles.container}>
            <InformationItem title='ФИО' value={adminData.fullName} />
            <InformationItem title='Номер телефона' value={adminData.phone} />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCardMainInformation
