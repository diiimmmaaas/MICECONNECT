import React, { ChangeEvent, FC, useState } from 'react'
import styles from './UploadFileComponent.module.css'
import exit from '../../assets/icons/trash.svg'
import grayPlusIcon from '../../assets/icons/gray-plus.svg'
import { createIconForExtension } from '../../utils/createIconForFiles'

export type UploadFilesType = {
  name: string
  type: string
  size: string
  src: string
}

export type UploadFileComponentPropsType = {
  setFiles: (files: any) => void
  filesArray: any
}

const UploadFileComponent: FC<UploadFileComponentPropsType> = ({ filesArray, setFiles }) => {
  const [uploaded, setUploaded] = useState<UploadFilesType[]>([])
  const [highlight, setHighlight] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    handFiles(files)
  }

  const handFiles = (files: any) => {
    setFiles([...filesArray, ...files])
    const filesArr: {
      name: string
      type: string
      size: string
      src: string
    }[] = []
    for (const file of files) {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.addEventListener('load', () => {
        const fileObj = {
          name: file.name as string,
          type: file.type as string,
          size: file.size as string,
          src: reader.result as string,
        }
        filesArr.push(fileObj)
        setUploaded([...uploaded, ...filesArr])
      })
    }
  }

  const handleDelete = (e: any) => {
    const targetIndex = e.target.dataset.imgindex * 1
    setUploaded([...uploaded.slice(0, targetIndex), ...uploaded.slice(targetIndex + 1)])
    setFiles([...filesArray.slice(0, targetIndex), ...filesArray.slice(targetIndex + 1)])
  }

  const handleHighlight = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setHighlight(true)
  }
  const handleUnHighlight = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setHighlight(false)
  }
  const handleDrop = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    const dt = e.dataTransfer
    const files = dt.files
    setHighlight(false)
    handFiles(files)
  }

  return (
    <div className={styles.uploadFilesContainer}>
      <div className={styles.uploadFilesBoard}>
        <input
          className={styles.inputFile}
          type='file'
          name='photos'
          placeholder='Добавьте картинки'
          multiple
          id='files'
          onChange={handleFileChange}
          accept='image/png,image/gif,.pdf'
        />
        <div className={styles.uploadFiles}>
          {uploaded.length > 0 &&
            uploaded.map((uploadedFile, index) => {
              const slicedName = uploadedFile.name.substring(uploadedFile.name.length - 3)
              return (
                <div className={styles.filesContainer} key={index} data-imgindex={index}>
                  <div className={styles.uploadedFileName}>
                    <img src={createIconForExtension(slicedName)} alt='fileIcon' />
                    <p>{uploadedFile.name}</p>
                  </div>
                  <img
                    className={styles.deleteFile}
                    src={exit}
                    alt='exit'
                    onClick={handleDelete}
                    data-imgindex={index}
                  />
                </div>
              )
            })}
        </div>
        <label
          className={highlight ? `${styles.label} ${styles.activeLabel}` : styles.label}
          htmlFor='files'
          onDragEnter={handleHighlight}
          onDragOver={handleHighlight}
          onDragLeave={handleUnHighlight}
          onDrop={handleDrop}
        >
          <img className={styles.uploadIcon} src={grayPlusIcon} alt='grayPlusIcon' />
          Добавить файл
        </label>
      </div>
    </div>
  )
}

export default UploadFileComponent
