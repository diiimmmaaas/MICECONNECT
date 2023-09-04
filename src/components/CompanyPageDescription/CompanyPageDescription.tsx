import React, { FC, useState } from 'react'
import { truncateString } from '../../utils/sliceString'
import styles from './CompanyPageDescription.module.css'
import arrowRightGray from '../../assets/icons/arrowRightGray.svg'

export type CompanyPageDescriptionPropsType = {
  text: string
}

const CompanyPageDescription: FC<CompanyPageDescriptionPropsType> = ({ text }) => {
  const [showFullText, setShowFullText] = useState(false)

  const slicedText = truncateString(text, 250)

  return (
    <div className={styles.descriptionBlock}>
      <h2 className={styles.title}>Описание:</h2>
      {text.length < 250 ? (
        <div className={styles.container}>
          <div className={styles.descriptionText}>{text}</div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.descriptionText}>{showFullText ? text : `${slicedText}...`}</div>
          <div className={styles.showMore} onClick={() => setShowFullText(!showFullText)}>
            {!showFullText ? (
              <>
                <div className={styles.showMore}>Показать больше</div>
                <img className={styles.arrowRightGray} src={arrowRightGray} alt='arrowRightGray' />
              </>
            ) : (
              <>
                <div className={styles.showMore}>Показать меньше</div>
                <img className={styles.arrowRightGray} src={arrowRightGray} alt='arrowRightGray' />
              </>
            )}
          </div>
        </div>
      )}
      <div className={styles.line}></div>
    </div>
  )
}

export default CompanyPageDescription
