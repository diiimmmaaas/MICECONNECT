import React, { FC, ReactNode } from 'react'
import styles from './CustomModal.module.css'

export type CustomModalPropsType = {
  visible: boolean
  setVisible: (visible: boolean) => void
  children?: ReactNode
}

const CustomModal: FC<CustomModalPropsType> = ({ children, visible, setVisible }) => {
  const rootClasses = [styles.myModal]

  if (visible) {
    rootClasses.push(styles.active)
  }

  return (
    <div className={rootClasses.join(' ')}>
      <div className={styles.myModalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default CustomModal
