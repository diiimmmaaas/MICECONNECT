import React, { FC } from 'react'
import styles from './HeaderForCardWithButtons.module.css'
import arrowLeft from '../../assets/icons/arrowLeft.svg'
import { useNavigate } from 'react-router-dom'
import BlockAndDeletePanel from '../BlockAndDeletePanel/BlockAndDeletePanel'
import { StaffType } from '../../redux/actions/types'
import { useAppSelector } from '../../redux/types/types'
import { useMediaQuery } from 'react-responsive'

type HeaderForCardPropsType = {
  title: string
  currentStaff: StaffType
  onRedirectHandler?: () => void
  onChangeSwipeCheckboxHandler: (checked: boolean) => void
  onDeletePopup: () => void
}

const HeaderForCardWithButtons: FC<HeaderForCardPropsType> = ({
  title,
  currentStaff,
  onDeletePopup,
  onChangeSwipeCheckboxHandler,
  onRedirectHandler,
}) => {
  const { userRole, user } = useAppSelector((state) => state.auth)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

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
      {!isMobile && (
        <>
          {user.employee.id !== currentStaff.id &&
            userRole !== 'employeeAgent' &&
            userRole !== 'employeePlace' && (
              <div className={styles.functionalBlock}>
                <BlockAndDeletePanel
                  blockText='Заблокирован'
                  isBlocked={currentStaff.user.isBlocked}
                  checkBoxTitle='Заблокировать'
                  buttonTitle='Удалить'
                  onChangeHandler={onChangeSwipeCheckboxHandler}
                  onDeleteHandler={onDeletePopup}
                />
              </div>
            )}
        </>
      )}
    </div>
  )
}

export default HeaderForCardWithButtons
