import React, { FC } from 'react'
import styles from './MobileButtons.module.css'
import CustomButton from '../CustomButton/CustomButton'
import { FormikValues } from 'formik'

export type MobileButtonsPropsType = {
  className?: string
  isValid: boolean
  handleSubmitHandler?: (values: FormikValues) => Promise<void>
  handleSubmit?: () => void
  handleCancel: (() => void) | undefined
}

const MobileButtons: FC<MobileButtonsPropsType> = ({
  className,
  isValid,
  handleSubmitHandler,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <div className={className ? `${className} ${styles.btnsBlock}` : styles.btnsBlock}>
      <CustomButton
        title='Сохранить'
        disabled={!isValid}
        onClick={handleSubmit ? handleSubmit : handleSubmitHandler}
        type='submit'
        className={styles.saveBtn}
      />
      <CustomButton
        type='reset'
        onClick={handleCancel}
        title='Отменить'
        className={styles.cancelBtn}
      />
    </div>
  )
}

export default MobileButtons
