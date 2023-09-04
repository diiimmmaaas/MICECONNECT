import React, { FC } from 'react'
import styles from './DeleteComponent.module.css'
import PopupHeader from '../PopupHeader/PopupHeader'
import CustomButton from '../UI/CustomButton/CustomButton'
import s from '../../styles/common/Form.module.css'

export type DeleteComponentsPropsType = {
  title: string
  description?: string
  onCancelHandler: () => void
  onDeleteHandler?: () => void
  deleteError?: boolean
}

const DeleteComponent: FC<DeleteComponentsPropsType> = ({
  title,
  description,
  onCancelHandler,
  onDeleteHandler,
  deleteError,
}) => {
  return (
    <div className={styles.deleteComponent}>
      <div className={styles.header}>
        <PopupHeader title={title} onClickHandler={onCancelHandler} />
      </div>
      {description && <div className={styles.description}>{description}</div>}
      {onDeleteHandler ? (
        <div className={styles.btnsBlock}>
          <CustomButton title='Отменить' className={styles.cancelBtn} onClick={onCancelHandler} />
          <CustomButton title='Удалить ' className={styles.deleteBtn} onClick={onDeleteHandler} />
        </div>
      ) : (
        <div>
          <CustomButton
            title='Войти'
            className={styles.deleteBtn}
            onClick={onCancelHandler}
            style={{ width: '100%' }}
          />
        </div>
      )}
      <>
        {deleteError && (
          <p className={`${s.errorValidation} ${s.networkError}`}>
            Произошла ошибка при удалении. Попробуйте еще раз...
          </p>
        )}
      </>
    </div>
  )
}

export default DeleteComponent
