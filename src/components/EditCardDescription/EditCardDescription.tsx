import React, { FC, useEffect, useState } from 'react'
import styles from './EditCardDescription.module.css'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import { useMediaQuery } from 'react-responsive'
import s from '../../styles/common/Form.module.css'
import MobileButtons from '../UI/MobileButtons/MobileButtons'
import TitleForEditBlockWithButton from '../TitleForEditBlockWithButton/TitleForEditBlockWithButton'
import arrowRightGray from '../../assets/icons/arrowRightGray.svg'
import { truncateString } from '../../utils/sliceString'
import editIcon from '../../assets/icons/orangePencil.svg'
import InformationItem from '../InformationItem/InformationItem'
import { createRoleCompanyFromEnToRu } from '../../utils/createRoleForRegister'
import { useAppSelector } from '../../redux/types/types'

export type EditCardDescriptionPropsType = {
  text: string
  error?: boolean
  companyConfirm?: boolean
  onSubmitHandler: (description: string) => void
  onResetHandler: () => void
}

const EditCardDescription: FC<EditCardDescriptionPropsType> = ({
  text,
  error,
  companyConfirm,
  onSubmitHandler,
  onResetHandler,
}) => {
  const [editMode, setEditMode] = useState(false)
  const [description, setDescription] = useState('')
  const [showFullText, setShowFullText] = useState(false)

  const { userRole } = useAppSelector((state) => state.auth)

  const slicedText = truncateString(text, 250)

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const onSubmit = () => {
    onSubmitHandler(description)
    setEditMode(false)
  }

  const handleEditMode = () => {
    setEditMode(true)
  }

  useEffect(() => {
    setDescription(text)
  }, [text])

  return (
    <>
      {editMode ? (
        <div className={styles.editDescription}>
          <TitleForEditBlockWithButton title='Описание' handleSubmit={onSubmit} />
          <div className={styles.textareaBlock}>
            <textarea
              value={description}
              className={styles.textarea}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete='on'
            />
          </div>
          <>
            {error && (
              <p className={`${styles.errorValidation} ${s.networkError}`}>
                Произошла ошибка при изменении данных. Попробуйте еще раз...
              </p>
            )}
          </>
          <>
            {companyConfirm && (
              <p className={`${s.confirmValidation} ${s.networkConfirm}`}>Данные обновлены</p>
            )}
          </>
        </div>
      ) : (
        <div className={styles.staticInformation}>
          <div className={styles.header}>
            <h2 className={styles.title}>Описание</h2>
            {userRole !== 'employeeAgent' && userRole !== 'employeePlace' && (
              <div className={styles.editIconBlock}>
                <img
                  onClick={handleEditMode}
                  className={styles.editIcon}
                  src={editIcon}
                  alt='editIcon'
                />
              </div>
            )}
          </div>
          {text.length < 250 ? (
            <div className={styles.mainInformationContainer}>
              <div className={styles.descriptionText}>{text}</div>
            </div>
          ) : (
            <div className={styles.mainInformationContainer}>
              {text ? (
                <>
                  <div className={styles.descriptionText}>
                    {showFullText ? text : `${slicedText}...`}
                  </div>
                  <div className={styles.showMore} onClick={() => setShowFullText(!showFullText)}>
                    {!showFullText ? (
                      <>
                        <div className={styles.showMore}>Показать больше</div>
                        <img
                          className={styles.arrowRightGray}
                          src={arrowRightGray}
                          alt='arrowRightGray'
                        />
                      </>
                    ) : (
                      <>
                        <div className={styles.showMore}>Показать меньше</div>
                        <img
                          className={styles.arrowRightGray}
                          src={arrowRightGray}
                          alt='arrowRightGray'
                        />
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.descriptionText}>Напишите пару слов о вашей компании</div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default EditCardDescription
