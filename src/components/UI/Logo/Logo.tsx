import React, { FC, MouseEventHandler } from 'react'
import styles from './Logo.module.css'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../redux/types/types'

export type LogoPropsType = {
  isWhite?: boolean
}

const Logo: FC<LogoPropsType> = ({ isWhite }) => {
  const { isAuth } = useAppSelector((state) => state.auth)

  const navigate = useNavigate()

  const handleLinkClick = (event: any) => {
    if (event.button === 1) {
      event.preventDefault()
      window.open('/')
    }
  }

  const onNavigateToMainPage = () => {
    if (isAuth) {
      navigate('/')
    }
  }

  return (
    <div
      className={isWhite ? `${styles.whiteLogo} ${styles.logo}` : styles.logo}
      onClick={onNavigateToMainPage}
      onMouseDown={handleLinkClick}
    >
      MICEC<span className={styles.partOfLogo}>O</span>NNECT
    </div>
  )
}

export default Logo
