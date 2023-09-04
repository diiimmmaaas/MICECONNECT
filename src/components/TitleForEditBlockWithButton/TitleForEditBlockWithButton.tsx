import React, { FC } from 'react'
import styles from './TitleForEditBlockWithButton.module.css'

export type TitleBlockForEditPagesPropsType = {
  title: string
  handleSubmit: () => void
}

const TitleForEditBlockWithButton: FC<TitleBlockForEditPagesPropsType> = ({
  title,
  handleSubmit,
}) => {
  return (
    <div className={styles.titleBlock}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.btnsBlock}>
        <div className={styles.editIconBlock} onClick={handleSubmit}>
          Ok
        </div>
      </div>
    </div>
  )
}

export default TitleForEditBlockWithButton
