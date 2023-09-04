import React, { ChangeEvent, DetailedHTMLProps, JSX, TextareaHTMLAttributes, useState } from 'react'

import styles from './CustomTextArea.module.css'
import clipIcon from '../../../assets/icons/clipIcon.svg'
import deleteIcon from '../../../assets/icons/trash.svg'

type DefaultTextAreaPropsType = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

type CustomTextAreaType = DefaultTextAreaPropsType & {
  value?: string
  placeholder?: string
  withoutFile?: boolean
  callbackHandler?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  setCommentFile: (files: any) => void
}

const CustomTextArea: React.FC<CustomTextAreaType> = ({
  value,
  placeholder,
  withoutFile,
  callbackHandler,
  className,
  setCommentFile,
  ...restProps
}): JSX.Element => {
  const [uploaded, setUploaded] = useState<any>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    // @ts-ignore
    setCommentFile([...files])
    // @ts-ignore
    for (const file of files) {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.addEventListener('load', () => {
        const fileObj = {
          name: file.name as string,
          src: reader.result as string,
        }
        setUploaded(fileObj)
      })
    }
  }

  const handleDelete = () => {
    setUploaded(null)
    setCommentFile([])
  }

  return (
    <div className={styles.textareaBlock}>
      <textarea
        value={value}
        className={`${styles.textarea} ${className}`}
        placeholder={placeholder}
        onChange={callbackHandler}
        autoComplete='on'
        {...restProps}
      />
      <div className={styles.labelBlock}>
        <input
          className={styles.inputFile}
          type='file'
          name='fileAny'
          multiple
          id='fileAny'
          onChange={handleFileChange}
          accept='image/png,image/gif,.pdf'
        />
        {!withoutFile && (
          <>
            {uploaded ? (
              <>
                <div className={styles.uploadedFile}>{uploaded.name}</div>
                <img
                  onClick={handleDelete}
                  className={styles.deleteIcon}
                  src={deleteIcon}
                  alt='deleteIcon'
                />
              </>
            ) : (
              <label className={styles.label} htmlFor='fileAny'>
                <img className={styles.uploadIcon} src={clipIcon} alt='clipIcon' />
                <div className={styles.uploadText}>Прикрепить файл</div>
              </label>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CustomTextArea
