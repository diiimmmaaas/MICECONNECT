import React from 'react'
import styles from './HeaderForAuth.module.css'
import Logo from '../UI/Logo/Logo'

const HeaderForAuth = () => {
  return (
    <div className={styles.formHeaderBlock}>
      <Logo isWhite />
    </div>
  )
}

export default HeaderForAuth
