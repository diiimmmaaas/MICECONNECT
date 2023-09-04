import React, { FC } from 'react'
import styles from './BlockAndDeletePanel.module.css'
import SwipeCheckbox from '../UI/SwipeCheckbox/SwipeCheckbox'
import CustomButton from '../UI/CustomButton/CustomButton'
import whiteTrashIcon from '../../assets/icons/whiteTrash.svg'

export type BlockAndDeletePanel = {
  isClaims?: boolean
  blockText: string
  isBlocked: boolean
  checkBoxTitle: string
  buttonTitle: string
  onChangeHandler: (checked: boolean) => void
  onDeleteHandler: () => void
}

const BlockAndDeletePanel: FC<BlockAndDeletePanel> = ({
  isClaims,
  blockText,
  isBlocked,
  checkBoxTitle,
  buttonTitle,
  onChangeHandler,
  onDeleteHandler,
}) => {
  return (
    <div className={styles.blockAndDeletePanel}>
      {isClaims ? (
        <>
          <div></div>
          <CustomButton
            iconSrc={whiteTrashIcon}
            className={styles.btn}
            title={buttonTitle}
            onClick={onDeleteHandler}
          />
        </>
      ) : (
        <>
          <div className={styles.blockContainer}>
            <div className={styles.swipeContainer}>
              <SwipeCheckbox
                id='highload'
                name='highload'
                onChangeHandler={onChangeHandler}
                isBlocked={isBlocked}
              />
              {isBlocked ? (
                <p className={styles.blockTextBlock}>Заблокирован</p>
              ) : (
                <p className={styles.blockText}>{checkBoxTitle}</p>
              )}
            </div>
          </div>
          <CustomButton
            iconSrc={whiteTrashIcon}
            className={styles.btn}
            title={buttonTitle}
            onClick={onDeleteHandler}
          />
        </>
      )}
    </div>
  )
}

export default BlockAndDeletePanel
