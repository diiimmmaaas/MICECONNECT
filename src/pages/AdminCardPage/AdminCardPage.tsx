import React, { useEffect, useState } from 'react'
import styles from './AdminCardPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import AdminCardMainInformation from '../../components/AdminCardMainInformation/AdminCardMainInformation'
import AdminCardLoginDetails from '../../components/AdminCardLoginDetails/AdminCardLoginDetails'
import BlockAndDeletePanel from '../../components/BlockAndDeletePanel/BlockAndDeletePanel'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import DeleteComponent from '../../components/DeleteComponent/DeleteComponent'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { blockAdmin, deleteAdmin, getCurrentAdmin } from '../../redux/actions/adminsAction'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/UI/Loader/Loader'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'

const AdminCardPage = () => {
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false)
  const [adminError, setAdminError] = useState<boolean>(false)

  const { adminId } = useParams<{ adminId: string }>()

  const { isLoading, currentAdmin } = useAppSelector((state) => state.admins)
  const { token, user } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onChangeSwipeCheckboxHandler = async (checked: boolean) => {
    const resultAction = await dispatch(
      blockAdmin({
        token,
        adminId: String(currentAdmin.id),
        isBlocked: !checked,
      }),
    )

    if (blockAdmin.rejected.match(resultAction)) {
      setAdminError(true)
      waitTimer(() => setAdminError(false))
    } else {
      setAdminError(false)
      await dispatch(getCurrentAdmin({ adminId, token }))
    }
  }

  const onDeletePopup = () => {
    setVisiblePopup(true)
  }

  const onDeleteAdmin = async () => {
    const resultAction = await dispatch(deleteAdmin({ adminId, token }))

    if (deleteAdmin.rejected.match(resultAction)) {
      setAdminError(true)
      waitTimer(() => setAdminError(false))
    } else {
      navigate(PATH.administratorsManagementPage)
      setAdminError(false)
    }
  }

  useEffect(() => {
    dispatch(getCurrentAdmin({ adminId, token }))
  }, [dispatch, adminId])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.adminCard}>
      <CustomModal visible={visiblePopup} setVisible={setVisiblePopup}>
        <DeleteComponent
          title='Удаление администратора'
          description='Хотите удалить данного администратора ?'
          onCancelHandler={() => setVisiblePopup(false)}
          onDeleteHandler={onDeleteAdmin}
          deleteError={adminError}
        />
      </CustomModal>
      <Navbar />
      <div className={styles.container}>
        <HeaderForCard title='Карточка администратора' />
        <div className={styles.content}>
          <AdminCardMainInformation adminData={currentAdmin} />
          <AdminCardLoginDetails adminData={currentAdmin} />
          {currentAdmin.id != user.id && (
            <BlockAndDeletePanel
              blockText='Администратор заблокирован'
              isBlocked={currentAdmin.isBlocked}
              checkBoxTitle='Заблокировать администратора'
              buttonTitle='Удалить администратора'
              onChangeHandler={onChangeSwipeCheckboxHandler}
              onDeleteHandler={onDeletePopup}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminCardPage
