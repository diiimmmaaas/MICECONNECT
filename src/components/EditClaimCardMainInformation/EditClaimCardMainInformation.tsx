import React, { FC, useEffect, useState } from 'react'
import styles from './EditClaimCardMainInformation.module.css'
import * as yup from 'yup'
import { Formik } from 'formik'
import TitleBlockForEditPages from '../TitleBlockForEditPages/TitleBlockForEditPages'
import CustomInput from '../UI/CustomInput/CustomInput'
import calendarIcon from '../../assets/icons/calendar.svg'
import clockIcon from '../../assets/icons/clock.svg'
import { useMediaQuery } from 'react-responsive'
import { ClaimResponseType } from '../../redux/actions/types'
import { ClaimStatus } from '../ClaimCardMainInformation/ClaimCardMainInformation'
import MobileButtons from '../UI/MobileButtons/MobileButtons'
import s from '../../styles/common/Form.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useNavigate, useParams } from 'react-router-dom'
import PATH from '../../navigation/path'
import {
  createEnStatusValueForClaim,
  createRuStatusValueForClaim,
} from '../../utils/createStatusForClaims'
import { claimsStatuses } from '../../constants/constants'
import CustomSelect from '../UI/CustomSelect/CustomSelect'
import { changeClaimMainInformation } from '../../redux/actions/claimsAction'
import { waitTimer } from '../../utils/waitTimer'

export type EditClaimCardMainInformationPropsType = {
  claimData: ClaimResponseType
}

const EditClaimCardMainInformation: FC<EditClaimCardMainInformationPropsType> = ({ claimData }) => {
  const [checkedData, setCheckedData] = useState<any>()

  const [staffError, setStaffError] = useState<boolean>(false)
  const [staffConfirm, setStaffConfirm] = useState<boolean>(false)

  const { claimId } = useParams<{ claimId: string }>()

  const { token } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const startDate = claimData.startDate.slice(0, 10)
  const startTime = claimData.startDate.slice(11, 16).split('-').reverse().join('.')
  const endDate = claimData.endDate.slice(0, 10)
  const endTime = claimData.endDate.slice(11, 16).split('-').reverse().join('.')

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const initialValues: any = {
    platformName: claimData?.place?.name ? claimData.place.name : '',
    city: claimData?.place?.city ? claimData.place.city : '',
    client: claimData?.user?.fullName ? claimData.user.fullName : '',
    dateStart: claimData?.startDate ? startDate : '',
    timeStart: claimData?.startDate ? startTime : '',
    dateFinish: claimData?.endDate ? endDate : '',
    timeFinish: claimData?.endDate ? endTime : '',
    peopleCount: claimData?.peopleCount ? claimData.peopleCount : '',
    status: createRuStatusValueForClaim(claimData.status),
  }

  const handleSubmitHandler = async (values: any) => {
    let changedFields: any = {}

    Object.keys(values).forEach((key) => {
      if (values[key] !== initialValues[key]) {
        changedFields[key] = values[key]
      }
    })

    const payload = { ...changedFields }

    delete payload.dateStart
    delete payload.dateFinish
    delete payload.timeFinish
    delete payload.timeStart

    if (changedFields.dateStart || changedFields.timeStart) {
      payload.startDate = `${
        changedFields.dateStart ? changedFields.dateStart : values.dateStart
      } ${changedFields.timeStart ? changedFields.timeStart : values.timeStart}:00`
    }

    if (changedFields.dateFinish || changedFields.timeFinish) {
      payload.endDate = `${
        changedFields.dateFinish ? changedFields.dateFinish : values.dateFinish
      } ${changedFields.timeFinish ? changedFields.timeFinish : values.timeFinish}:00`
    }

    if (changedFields.status) {
      payload.status = createEnStatusValueForClaim(payload.status)
    }

    if (changedFields.peopleCount) {
      payload.peopleCount = String(changedFields.peopleCount)
    }

    if (Object.keys(payload).length === 0) {
      navigate(`${PATH.claimCardPage}${claimId}`)
      return
    }

    const resultAction = await dispatch(
      changeClaimMainInformation({
        token,
        claimId: String(claimData.id),
        payload,
      }),
    )

    if (changeClaimMainInformation.rejected.match(resultAction)) {
      setStaffError(true)
      waitTimer(() => setStaffError(false))
    } else {
      setStaffConfirm(true)
      waitTimer(() => setStaffConfirm(false))
      setStaffError(false)
    }
  }

  const handleCancel = () => {
    navigate(`${PATH.claimCardPage}${claimData.id}`)
  }

  return (
    <div className={styles.mainInformationBlock}>
      <Formik
        initialValues={initialValues}
        validateOnBlur
        onSubmit={(values) => handleSubmitHandler(values)}
      >
        {(props) => {
          const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } = props

          return (
            <>
              <TitleBlockForEditPages
                title='Основная информация'
                disabled={!isValid}
                handleSubmit={handleSubmit}
                handleReset={handleCancel}
              />
              <div className={styles.container}>
                <div className={styles.platformNameBlock}>
                  <div className={styles.leftBlock}>Название площадки</div>
                  <div className={styles.rightBlock}>
                    <div className={styles.companyBlock}>{values.platformName}</div>
                  </div>
                </div>
                <div className={styles.cityBlock}>
                  <div className={styles.leftBlock}>Город</div>
                  <div className={styles.rightBlock}>
                    <div className={styles.companyBlock}>{values.city}</div>
                  </div>
                </div>
                <div className={styles.clientBlock}>
                  <div className={styles.leftBlock}>Заказчик</div>
                  <div className={styles.rightBlock}>
                    <div className={styles.companyBlock}>{values.client}</div>
                  </div>
                </div>
                <div className={styles.dateAndTimeBlock}>
                  <div className={styles.leftBlock}>Дата и время начала</div>
                  <div className={styles.rightDateBlock}>
                    <div className={styles.startDateBlock}>
                      <div className={styles.companyBlock}>{values.dateStart}</div>
                    </div>
                    <div className={styles.startTimeBlock}>
                      <div className={styles.companyBlock}>{values.timeStart}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.dateAndTimeBlock}>
                  <div className={styles.leftBlock}>Дата и время окончания</div>
                  <div className={styles.rightDateBlock}>
                    <div className={styles.startDateBlock}>
                      <div className={styles.companyBlock}>{values.dateFinish}</div>
                    </div>
                    <div className={styles.startTimeBlock}>
                      <div className={styles.companyBlock}>{values.timeFinish}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.guestsBlock}>
                  <div className={styles.leftBlock}>Количество гостей</div>
                  <div className={styles.rightBlock}>
                    <div className={styles.companyBlock}>{values.peopleCount}</div>
                  </div>
                </div>
                <div className={styles.statusBlock}>
                  <div className={styles.leftBlock}>Статус</div>
                  <div className={styles.rightDateBlock}>
                    <CustomSelect
                      name='status'
                      options={claimsStatuses}
                      value={values.status}
                      onChangeOption={handleChange('status')}
                    />
                  </div>
                </div>
                <>
                  {staffError && (
                    <p className={`${s.errorValidation} ${s.networkError}`}>
                      Произошла ошибка при обновлении
                    </p>
                  )}
                </>
                <>
                  {staffConfirm && (
                    <p className={`${s.confirmValidation} ${s.networkConfirm}`}>Данные обновлены</p>
                  )}
                </>
                {isMobile && (
                  <MobileButtons
                    isValid={isValid}
                    handleSubmitHandler={handleSubmitHandler}
                    handleCancel={handleCancel}
                  />
                )}
              </div>
            </>
          )
        }}
      </Formik>
    </div>
  )
}

export default EditClaimCardMainInformation
