import React from 'react'
import styles from './Footer.module.css'
import Logo from '../UI/Logo/Logo'

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topBlock}>
          <Logo />
        </div>
        <div className={styles.content}>
          <div className={styles.forUserBlock}>
            <p className={styles.linksTitle}>Пользователям</p>
            <ul className={styles.linksList}>
              <li className={styles.link}>О сервисе </li>
              <li className={styles.link}>Служба поддержки</li>
              <li className={styles.link}>Пользовательское соглашение</li>
            </ul>
          </div>
          <div className={styles.forPartnerBlock}>
            <p className={styles.linksTitle}>Партнерам</p>
            <ul className={styles.linksList}>
              <li className={styles.link}>Подключить площадку </li>
              <li className={styles.link}>Личный кабинет</li>
            </ul>
          </div>
          <div className={styles.supportBlock}>
            <p className={styles.linksTitle}>Поддержки</p>
          </div>
          <div className={styles.contactsBlock}>
            <p className={styles.linksTitle}>Контакты</p>
          </div>
        </div>
        <div className={styles.bottomBlock}>© 2023 • Все права защищены</div>
      </div>
    </div>
  )
}

export default Footer
