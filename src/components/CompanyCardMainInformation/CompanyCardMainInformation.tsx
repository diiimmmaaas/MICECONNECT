import React, { FC } from 'react'
import styles from './CompanyCardMainInformation.module.css'
import editIcon from '../../assets/icons/orangePencil.svg'
import InformationItem from '../InformationItem/InformationItem'
import PATH from '../../navigation/path'
import { useNavigate, useParams } from 'react-router-dom'
import { CompaniesType } from '../../redux/actions/types'
import { createRoleCompanyFromEnToRu, createRoleForTable } from '../../utils/createRoleForRegister'
import { useAppSelector } from '../../redux/types/types'

export type CompanyCardMainInformationPropsType = {
  companyData: CompaniesType
}

const CompanyCardMainInformation: FC<CompanyCardMainInformationPropsType> = ({ companyData }) => {
  const { companyId } = useParams<{ companyId: string }>()

  const { userRole, user } = useAppSelector((state) => state.auth)

  const navigate = useNavigate()

  const onRedirectToEditCardPage = () => {
    navigate(`${PATH.editCompanyCardPage}${companyId}`)
  }

  const foundObject = companyData.employees.find((item) => item.id === user.employee?.id)

  return (
    <div className={styles.mainInformationBlock}>
      <div className={styles.mainInformationHeader}>
        <h2 className={styles.mainInformationTitle}>Основная информация</h2>
        {(userRole === 'superAdmin' ||
          userRole === 'admin' ||
          (userRole === 'directorPlace' && foundObject) ||
          (userRole === 'directorAgent' && foundObject)) && (
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
        <InformationItem title='Название организации' value={companyData.name} />
        <InformationItem title='ИНН' value={companyData.inn} />
        <InformationItem title='Роль' value={createRoleCompanyFromEnToRu(companyData.role)} />
        <InformationItem title='Город' value={companyData.city} />
        <InformationItem title='Адрес' value={companyData.address} />
        <InformationItem title='ФИО контактного лица' value={companyData.contactFullName} />
        <InformationItem title='Телефон контактного лица' value={companyData.contactPhone} />
        <InformationItem title='Электронная почта' value={companyData.email} />
      </div>
    </div>
  )
}

export default CompanyCardMainInformation
