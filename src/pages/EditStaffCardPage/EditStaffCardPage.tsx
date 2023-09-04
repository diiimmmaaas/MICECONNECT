import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './EditStaffCardPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import CompanyCardCategories from '../../components/CompanyCardCategories/CompanyCardCategories'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import Footer from '../../components/Footer/Footer'
import EditStaffMainInformation from '../../components/EditStaffMainInformation/EditStaffMainInformation'
import EditStaffLoginDetails from '../../components/EditStaffLoginDetails/EditStaffLoginDetails'
import BlockAndDeletePanel from '../../components/BlockAndDeletePanel/BlockAndDeletePanel'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import DeleteComponent from '../../components/DeleteComponent/DeleteComponent'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { blockStaff, deleteStaff, getCurrentStaff } from '../../redux/actions/staffAction'
import Loader from '../../components/UI/Loader/Loader'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'

const EditStaffCardPage = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const { companyId } = useParams<{ companyId: string }>()
  const { workerId } = useParams<{ workerId: string }>()
  const [staffError, setStaffError] = useState<boolean>(false)

  const { token, user } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  let userRole = useAppSelector((state) => state.auth.userRole)
  const { currentStaff, isLoading } = useAppSelector((state) => state.staff)

  const onChangeSwipeCheckboxHandler = async (checked: boolean) => {
    await dispatch(
      blockStaff({
        staffId: String(currentStaff.id),
        isBlocked: !checked,
      }),
    )

    await dispatch(getCurrentStaff({ staffId: workerId, token }))
  }

  const onDeletePopup = () => {
    setVisible(true)
  }

  const onDeleteStaff = async () => {
    const resultAction = await dispatch(deleteStaff({ staffId: String(currentStaff.id), token }))

    if (deleteStaff.rejected.match(resultAction)) {
      setStaffError(true)
      waitTimer(() => setStaffError(false))
    } else {
      navigate(`${PATH.companyManagementStaffPage}${companyId}`)
      setStaffError(false)
    }
  }

  useEffect(() => {
    dispatch(getCurrentStaff({ staffId: workerId, token }))
  }, [companyId, workerId, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.editCompanyStaffCardPage}>
      <CustomModal visible={visible} setVisible={setVisible}>
        <DeleteComponent
          title='Удаление сотрудника'
          description='Хотите удалить данного сотрудника?'
          onCancelHandler={() => setVisible(false)}
          onDeleteHandler={onDeleteStaff}
          deleteError={staffError}
        />
      </CustomModal>
      <Navbar />
      {(userRole === 'superAdmin' ||
        userRole === 'admin' ||
        userRole === 'directorPlace' ||
        userRole === 'employeePlace' ||
        userRole === 'directorAgent') && (
        <CompanyCardCategories
          categories={[
            { id: 1, title: 'Основная информация' },
            { id: 2, title: 'Сотрудники компании' },
            { id: 3, title: 'Площадки компании' },
          ]}
          activeLink={2}
          cardId={companyId}
        />
      )}
      <HeaderForCard title='Карточка сотрудника' />
      <div className={styles.content}>
        <EditStaffMainInformation staffData={currentStaff} />
        <EditStaffLoginDetails staffData={currentStaff} />
        {user.employee.id != currentStaff.id && (
          <BlockAndDeletePanel
            blockText='Сотрудник заблокирован'
            isBlocked={currentStaff.user.isBlocked}
            checkBoxTitle='Заблокировать сотрудника'
            buttonTitle='Удалить администратора'
            onChangeHandler={onChangeSwipeCheckboxHandler}
            onDeleteHandler={onDeletePopup}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default EditStaffCardPage
