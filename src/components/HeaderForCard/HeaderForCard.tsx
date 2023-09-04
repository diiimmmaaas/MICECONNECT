import React, { FC } from 'react'
import styles from './HeaderForCard.module.css'
import arrowLeft from '../../assets/icons/arrowLeft.svg'
import { useNavigate } from 'react-router-dom'

type HeaderForCardPropsType = {
  title: string
  onRedirectHandler?: () => void
}

const HeaderForCard: FC<HeaderForCardPropsType> = ({ title, onRedirectHandler }) => {
  const navigate = useNavigate()

  const onRedirectBack = () => {
    navigate(-1)
  }
  return (
    <div className={styles.header}>
      <div
        className={styles.arrowLeftBlock}
        onClick={onRedirectHandler ? onRedirectHandler : onRedirectBack}
      >
        <img className={styles.arrowLeft} src={arrowLeft} alt='arrowLeft' />
      </div>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </div>
  )
}

export default HeaderForCard
