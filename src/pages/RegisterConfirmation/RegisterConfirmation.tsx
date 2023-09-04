import React from 'react'
import styles from './RegisterConfirmation.module.css'
import s from '../../styles/common/Form.module.css'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import HeaderForAuth from '../../components/HeaderForAuth/HeaderForAuth'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import mainBackground from '../../assets/img/mainBackground.png'

const RegisterConfirmation = () => {
  const navigate = useNavigate()

  const handleSubmit = () => {
    navigate(PATH.authPage)
  }

  return (
    <div
      className={styles.registerConfirmation}
      style={{
        background: `linear-gradient(90deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), url(${mainBackground}), lightgray 50% / cover no-repeat`,
      }}
    >
      <div className={s.container}>
        <HeaderForAuth />
        <div className={`${s.formContentBlock} ${styles.formContentBlock}`}>
          <div className={styles.leftBlock}>
            <h2 className={styles.whiteTitle}>
              {'Ваш запрос на регистрацию\nотправлен' + ' системному администратору' + ' сервиса'}
            </h2>
            <div className={s.buttonGroup}>
              <CustomButton
                title='К входу'
                onClick={handleSubmit}
                type='submit'
                className={s.submitBtn}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterConfirmation
