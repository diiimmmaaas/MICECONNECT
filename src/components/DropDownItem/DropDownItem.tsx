import React, { FC } from 'react'
import styles from './DropDownItem.module.css'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'

type DropDownItemPropsType = {
  title: string
  id: number
  active?: boolean
  setActive: (activeOption: null | number) => void
}

const DropDownItem: FC<DropDownItemPropsType> = ({ title, id, active, setActive }) => {
  const navigate = useNavigate()

  const redirectToPage = () => {
    switch (title) {
      case 'Площадки':
        navigate(PATH.siteManagementPage)
        return
      case 'Администраторы':
        navigate(PATH.administratorsManagementPage)
        return
      case 'Компании':
        navigate(PATH.companyManagementPage)
        return
      case 'Заявки':
        navigate(PATH.claimManagementPage)
        return
      case 'Сотрудники':
        navigate(`${PATH.companyManagementStaffPage}1`)
        return
      case 'Запросы на регистрацию':
        navigate(`${PATH.requestForRegistration}`)
        return
      case 'Профиль':
        navigate(`${PATH.profilePage}`)
        return
      case 'Главная':
        navigate('/')
        return
    }
  }

  const onActiveItem = () => {
    setActive(id)
    redirectToPage()
  }

  return (
    <li onClick={onActiveItem} className={`${styles.dropDownItem} ${active && styles.active}`}>
      {title}
    </li>
  )
}

export default DropDownItem
