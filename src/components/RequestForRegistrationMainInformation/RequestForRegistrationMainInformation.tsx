import React, { FC } from 'react'
import styles from './RequestForRegistrationMainInformation.module.css'
import InformationItem from '../InformationItem/InformationItem'
import { RegistrationRequestType } from '../../redux/actions/types'
import {
  createRoleCompanyFromEnToRu,
  createStatusForRegistrationRequest,
} from '../../utils/createRoleForRegister'
import { createStatusIconForRegistrationRequest } from '../Table/Table'

export type RequestForRegistrationMainInformationPropsType = {
  requestData: RegistrationRequestType
}

const RequestForRegistrationMainInformation: FC<RequestForRegistrationMainInformationPropsType> = ({
  requestData,
}) => {
  return (
    <div className={styles.mainInformation}>
      <div className={styles.staticInformation}>
        <div className={styles.header}>
          <h2 className={styles.title}>Основная информация</h2>
        </div>
        <div className={styles.container}>
          <div className={styles.statusContainer}>
            <img
              className={styles.statusIcon}
              src={createStatusIconForRegistrationRequest(
                createStatusForRegistrationRequest(requestData.status),
              )}
              alt={requestData.status}
            />
            <div className={styles.statusText}>
              {createStatusForRegistrationRequest(requestData.status)}
            </div>
          </div>
          <InformationItem title='Название организации' value={requestData.companyName} />
          <InformationItem title='ИНН' value={requestData.inn} />
          <InformationItem title='Роль' value={createRoleCompanyFromEnToRu(requestData.role)} />
          <InformationItem title='Город' value={requestData.city} />
          <InformationItem title='Адрес' value={requestData.address} />
          <InformationItem title='ФИО контактного лица' value={requestData.contactFullName} />
          <InformationItem title='Телефон контактного лица' value={requestData.contactPhone} />
          <InformationItem title='Электронная почта/Логин' value={requestData.email} />
          <InformationItem title='Пароль' value={requestData.password} />
        </div>
      </div>
    </div>
  )
}

export default RequestForRegistrationMainInformation
