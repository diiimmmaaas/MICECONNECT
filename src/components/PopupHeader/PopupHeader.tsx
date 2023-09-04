import React, { FC } from 'react'
import styles from './PopupHeader.module.css'
import exitIcon from '../../assets/icons/close.svg'

export type PopupHeader = {
  title: string
  onClickHandler: () => void
}

const PopupHeader: FC<PopupHeader> = ({ title, onClickHandler }) => {
  return (
    <div className={styles.popupHeader}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.iconContainer} onClick={onClickHandler}>
        <img className={styles.exitIcon} src={exitIcon} alt='exitIcon' />
      </div>
    </div>
  )
}

export default PopupHeader
