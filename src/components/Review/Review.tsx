import React, { FC } from 'react'
import styles from './Review.module.css'
import s from '../PlatformCardFilesBlock/PlatformCardFilesBlock.module.css'
import { createIconForExtension } from '../../utils/createIconForFiles'
import uploadIcon from '../../assets/icons/upload.svg'

export type ReviewPropsType = {
  fullname: string
  text: string
  date: string
  file: string
}

const Review: FC<ReviewPropsType> = ({ fullname, text, date, file }) => {
  return (
    <div className={styles.review}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <p className={styles.fullname}>{fullname}</p>
          <div className={styles.reviewText}>{text}</div>
        </div>
        <p className={styles.dateBlock}>{date}</p>
      </div>
      {file && (
        <div className={s.filesContainer}>
          <div className={s.uploadedFileName}>
            <img
              className={s.fileIcon}
              src={createIconForExtension(file.slice(-3))}
              alt='fileIcon'
            />
            <p className={s.fileName}>{file}</p>
          </div>
          <a
            target='_blank'
            href={`${process.env.REACT_APP_BASE_URL_IMAGES}${file}`}
            rel='noreferrer'
          >
            <img className={s.deleteFile} src={uploadIcon} alt='uploadIcon' />
          </a>
        </div>
      )}
      <div className={styles.line}></div>
    </div>
  )
}

export default Review
