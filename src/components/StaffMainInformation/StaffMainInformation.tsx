import React, { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PATH from '../../navigation/path'
import styles from './StaffMainInformation.module.css'
import editIcon from '../../assets/icons/orangePencil.svg'
import InformationItem from '../InformationItem/InformationItem'
import { GetCurrentAdminResponseType, StaffType } from '../../redux/actions/types'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getCurrentCompany } from '../../redux/actions/companiesAction'

export type StaffMainInformationPropsType = {
  staffData: StaffType
}

const StaffMainInformation: FC<StaffMainInformationPropsType> = ({ staffData }) => {
  const { companyId } = useParams<{ companyId: string }>()
  const { workerId } = useParams<{ workerId: string }>()

  const { token, user, userRole } = useAppSelector((state) => state.auth)
  const { currentCompany } = useAppSelector((state) => state.companies)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onRedirectToEditCardPage = () => {
    navigate(`${PATH.editStaffCardPage}${companyId}/${workerId}`)
  }

  const foundObject = currentCompany.employees.find((item) => item.id === user.employee?.id)

  useEffect(() => {
    dispatch(getCurrentCompany({ companyId, token }))
  }, [companyId, dispatch])

  return (
    <div className={styles.mainInformationBlock}>
      <div className={styles.mainInformationHeader}>
        <h2 className={styles.mainInformationTitle}>Основная информация</h2>
        <div className={styles.editIconBlock}>
          <img
            onClick={onRedirectToEditCardPage}
            className={styles.editIcon}
            src={editIcon}
            alt='editIcon'
          />
        </div>
      </div>
      <div className={styles.mainInformationContainer}>
        <InformationItem title='ФИО' value={staffData.user.fullName} />
        <InformationItem title='Номер телефона' value={staffData.user.phone} />
        <InformationItem title='Компания' value={staffData.company.name} />
      </div>
    </div>
  )
}

export default StaffMainInformation
