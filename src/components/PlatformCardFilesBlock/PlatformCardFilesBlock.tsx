import React, { FC, useEffect, useState } from 'react'
import styles from './PlatformCardFilesBlock.module.css'
import uploadIcon from '../../assets/icons/upload.svg'
import { createIconForExtension } from '../../utils/createIconForFiles'
import { PlaceType } from '../../redux/actions/types'

export type PlatformCardFilesBlockPropsType = {
  platformData: PlaceType
}

const PlatformCardFilesBlock: FC<PlatformCardFilesBlockPropsType> = ({ platformData }) => {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    setFiles(platformData.files)
  }, [platformData.files])

  return (
    <div className={styles.filesBlock}>
      <h2 className={styles.title}>Файл:</h2>
      <div className={styles.container}>
        {files.map((file, index) => {
          const fileExtension = file.slice(-3)
          const fileName = file
          const filePath = `${process.env.REACT_APP_BASE_URL_IMAGES}${file}`

          return (
            <div key={index} className={styles.filesContainer}>
              <div className={styles.uploadedFileName}>
                <img
                  className={styles.fileIcon}
                  src={createIconForExtension(fileExtension)}
                  alt='fileIcon'
                />
                <p className={styles.fileName}>{fileName}</p>
              </div>
              <a target='_blank' href={filePath} rel='noreferrer'>
                <img className={styles.deleteFile} src={uploadIcon} alt='uploadIcon' />
              </a>
            </div>
          )
        })}
      </div>
      <div className={styles.line}></div>
    </div>
  )
}

export default PlatformCardFilesBlock
