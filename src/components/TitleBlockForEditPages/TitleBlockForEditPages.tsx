import React, { FC } from 'react'
import styles from './TitleBlockForEditPages.module.css'
import { useMediaQuery } from 'react-responsive'

export type TitleBlockForEditPagesPropsType = {
  title: string
  disabled: boolean
  handleSubmit: () => void
  handleReset: () => void
}

const TitleBlockForEditPages: FC<TitleBlockForEditPagesPropsType> = ({
  title,
  disabled,
  handleSubmit,
  handleReset,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  return (
    <div className={styles.titleBlock}>
      <h2 className={styles.title}>{title}</h2>
      {!isMobile && !disabled && (
        <div className={styles.btnsBlock}>
          <div className={styles.editIconBlock} onClick={handleSubmit}>
            Ok
          </div>
        </div>
      )}
    </div>
  )
}

export default TitleBlockForEditPages
