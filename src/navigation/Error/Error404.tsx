import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Error404.module.css'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import s from '../../styles/common/Form.module.css'
import errorImage from '../../assets/img/errorImage.png'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const Error404 = () => {
  const navigate = useNavigate()

  const onClickHandler = () => {
    return navigate('/')
  }
  return (
    <div className={styles.errorPage}>
      <Navbar />
      <div className={styles.container}>
        <div className={s.leftBlock}>
          <h1 className={styles.errorTitle}>404</h1>
          <div className={styles.errorDescription}>Мы не можем найти нужную страницу...</div>
          <CustomButton title='Вернуться на главную' onClick={onClickHandler} type='button' />
        </div>
        <div className={s.rightBlock}>
          <img className={s.mainImg} src={errorImage} alt='errorImage' />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Error404
