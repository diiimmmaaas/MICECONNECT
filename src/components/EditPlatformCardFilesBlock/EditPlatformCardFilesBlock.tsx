import React, { FC, useState } from 'react'
import styles from './EditPlatformCardFilesBlock.module.css'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import { createIconForExtension } from '../../utils/createIconForFiles'
import deleteIcon from '../../assets/icons/trash.svg'
import loadIcon from '../../assets/icons/upload.svg'
import CustomButton from '../UI/CustomButton/CustomButton'
import { useMediaQuery } from 'react-responsive'
import { PlaceType } from '../../redux/actions/types'
import UploadFileComponent from '../UploadFileComponent/UploadFileComponent'
import PATH from '../../navigation/path'
import { useNavigate } from 'react-router-dom'
import {
  deleteCurrentFileFromPlatform,
  getCurrentPlaces,
  pushNewFilesToPlatform,
} from '../../redux/actions/placesAction'
import { waitTimer } from '../../utils/waitTimer'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import p from '../UI/CustomInput/CustomInput.module.css'
import s from '../../styles/common/Form.module.css'

export type EditPlatformCardFilesBlockPropsType = {
  platformData: PlaceType
}

const EditPlatformCardFilesBlock: FC<EditPlatformCardFilesBlockPropsType> = ({ platformData }) => {
  const [files, setFiles] = useState<any>([])
  const [platformError, setPlatformError] = useState<boolean>(false)
  const [postPlatformErrorText, setPostPlatformErrorText] = useState<string>('')

  const { token } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const waitNetworkTimer = () => {
    const timer = setTimeout(() => {
      setPlatformError(false)
      setPostPlatformErrorText('')
    }, 5000)

    return () => clearTimeout(timer)
  }

  const handleDeleteFileFromServer = async (fileName: string) => {
    const resultAction = await dispatch(
      deleteCurrentFileFromPlatform({
        token,
        placeId: String(platformData.id),
        filesToDelete: [fileName],
      }),
    )

    if (deleteCurrentFileFromPlatform.rejected.match(resultAction)) {
      setPlatformError(true)
      waitTimer(() => setPlatformError(false))
    } else {
      setPlatformError(false)
      await dispatch(getCurrentPlaces({ placeId: String(platformData.id), token }))
    }
  }

  const handleSubmit = async () => {
    const formData = new FormData()

    if (files.length > 10) {
      setPostPlatformErrorText('Вы можете загрузить максимум 10 картинок')
      waitNetworkTimer()

      return
    }

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      const resultAction = await dispatch(
        pushNewFilesToPlatform({ placeId: String(platformData.id), formData, token }),
      )

      if (pushNewFilesToPlatform.rejected.match(resultAction)) {
        setPlatformError(true)
        waitNetworkTimer()
      } else {
        setPlatformError(false)
        setFiles([])
        await dispatch(getCurrentPlaces({ placeId: String(platformData.id), token }))
      }
    }
  }

  const handleReset = () => {
    navigate(`${PATH.platformCardPage}${platformData.id}`)
  }

  return (
    <>
      <div className={styles.editFiles}>
        <TitleBlockForEditPages
          title='Файл:'
          disabled={files.length === 0}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
        />
        <div className={styles.filesBlock}>
          {platformData.files.length !== 0 &&
            platformData.files.map((f, index) => {
              return (
                <div key={index} className={styles.fileBlock}>
                  <div className={styles.nameBlock}>
                    <img
                      className={styles.fileIcon}
                      src={createIconForExtension(f.substr(f.length - 3))}
                      alt='fileIcon'
                    />
                    <p className={styles.fileName}>{f}</p>
                  </div>
                  <div className={styles.iconsBlock}>
                    <img
                      onClick={() => handleDeleteFileFromServer(f)}
                      className={styles.deleteIcon}
                      src={deleteIcon}
                      alt='deleteIcon'
                    />
                    <a
                      className={styles.loadIcon}
                      href={`${process.env.REACT_APP_BASE_URL_IMAGES}${f}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <img className={styles.loadIcon} src={loadIcon} alt='loadIcon' />
                    </a>
                  </div>
                </div>
              )
            })}
          <UploadFileComponent setFiles={setFiles} filesArray={files} />
          <>
            {platformError && (
              <p className={`${s.errorValidation} ${s.networkError}`}>
                Произошла ошибка при обновлении данных. Попробуйте еще раз...
              </p>
            )}
          </>
        </div>
        {isMobile && (
          <div className={styles.btnsBlock}>
            <CustomButton
              title='Сохранить'
              disabled={files.length === 0}
              onClick={handleSubmit}
              type='submit'
              className={styles.saveBtn}
            />
            <CustomButton
              type='reset'
              onClick={handleReset}
              title='Отменить'
              className={styles.cancelBtn}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default EditPlatformCardFilesBlock
