import React, { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PATH from '../../navigation/path'
import styles from './ClaimCardMainInformation.module.css'
import editIcon from '../../assets/icons/orangePencil.svg'
import InformationItem from '../InformationItem/InformationItem'
import { ClaimResponseType } from '../../redux/actions/types'
import {
  createRuStatusValueForClaim,
  createStyleForStatusClaim,
} from '../../utils/createStatusForClaims'
import { useAppSelector } from '../../redux/types/types'

export type ClaimStatus = 'Завершена' | 'В работе' | 'Отклонена'

export type ClaimCardMainInformationPropsType = {
  claimData: ClaimResponseType
}

const ClaimCardMainInformation: FC<ClaimCardMainInformationPropsType> = ({ claimData }) => {
  const { claimId } = useParams<{ claimId: string }>()
  const navigate = useNavigate()

  const { user, userRole } = useAppSelector((state) => state.auth)
  const { meData } = useAppSelector((state) => state.me)

  const startDate = claimData.startDate.slice(0, 10).split('-').reverse().join('.')
  const startTime = claimData.startDate.slice(11, 16).split('-').reverse().join('.')
  const endDate = claimData.endDate.slice(0, 10).split('-').reverse().join('.')
  const endTime = claimData.endDate.slice(11, 16).split('-').reverse().join('.')

  const onRedirectToEditCardPage = () => {
    navigate(`${PATH.editClaimCardPage}${claimId}`)
  }

  const foundObject = claimData?.user?.employee?.company?.employees.find((item) => {
    return item.id === user.employee?.id
  })

  return (
    <div className={styles.mainInformationBlock}>
      <div className={styles.mainInformationHeader}>
        <h2 className={styles.mainInformationTitle}>Основная информация</h2>
        {(userRole === 'superAdmin' ||
          userRole === 'admin' ||
          userRole === 'employeePlace' ||
          userRole === 'directorPlace') && (
          <div className={styles.editIconBlock}>
            <img
              onClick={onRedirectToEditCardPage}
              className={styles.editIcon}
              src={editIcon}
              alt='editIcon'
            />
          </div>
        )}
      </div>
      <div className={styles.mainInformationContainer}>
        <InformationItem title='Площадка' value={claimData.place.name} />
        <InformationItem title='Город' value={claimData.place.city} />
        <InformationItem title='Заказчик' value={claimData.user.fullName} />
        <InformationItem
          isDateItem
          title='Дата и время начала'
          value={startDate}
          value2={startTime}
        />
        <InformationItem
          isDateItem
          title='Дата и время окончания'
          value={endDate}
          value2={endTime}
        />
        <InformationItem title='Количество гостей' value={`${claimData.peopleCount} человек(a)`} />
        <InformationItem
          title='Статус'
          value={createRuStatusValueForClaim(claimData.status)}
          classNameValue={createStyleForStatusClaim(claimData.status)}
        />
      </div>
    </div>
  )
}

export default ClaimCardMainInformation
