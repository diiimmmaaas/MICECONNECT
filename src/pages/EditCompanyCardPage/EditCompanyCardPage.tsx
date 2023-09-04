import React, { useEffect, useState } from 'react'
import styles from './EditCompanyCardPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import CompanyCardCategories from '../../components/CompanyCardCategories/CompanyCardCategories'
import Footer from '../../components/Footer/Footer'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import EditCardDescription from '../../components/EditCardDescription/EditCardDescription'
import EditCompanyCardMainInformation from '../../components/EditCompanyCardMainInformation/EditCompanyCardMainInformation'
import BlockAndDeletePanel from '../../components/BlockAndDeletePanel/BlockAndDeletePanel'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import DeleteComponent from '../../components/DeleteComponent/DeleteComponent'
import { useNavigate, useParams } from 'react-router-dom'
import {
  blockCompany,
  changeCompanyDetails,
  deleteCompany,
  getCurrentCompany,
} from '../../redux/actions/companiesAction'
import Loader from '../../components/UI/Loader/Loader'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import PATH from '../../navigation/path'
import { waitTimer } from '../../utils/waitTimer'

const EditCompanyCardPage = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [companyError, setCompanyError] = useState<boolean>(false)
  const [companyNetworkError, setCompanyNetworkError] = useState<boolean>(false)
  const [companyConfirm, setCompanyConfirm] = useState<boolean>(false)

  const { companyId } = useParams<{ companyId: string }>()
  const { token, user, userRole } = useAppSelector((state) => state.auth)

  const { currentCompany, isLoading } = useAppSelector((state) => state.companies)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const waitNetworkTimer = () => {
    const timer = setTimeout(() => {
      setCompanyError(false)
      setCompanyNetworkError(false)
    }, 5000)

    return () => clearTimeout(timer)
  }

  const onSubmitDescription = async (newDescription: string) => {
    const resultAction = await dispatch(
      changeCompanyDetails({
        token,
        companyId: String(currentCompany.id),
        description: newDescription,
      }),
    )

    if (changeCompanyDetails.rejected.match(resultAction)) {
      setCompanyError(true)
      waitNetworkTimer()
    } else {
      setCompanyConfirm(true)
      waitTimer(() => setCompanyConfirm(false))
      setCompanyError(false)
    }
  }

  const onResetHandler = () => {
    navigate(`${PATH.companyCardPage}${currentCompany.id}`)
  }

  const onChangeSwipeCheckboxHandler = async (checked: boolean) => {
    await dispatch(
      blockCompany({
        token,
        companyId: String(currentCompany.id),
        isBlocked: !checked,
      }),
    )

    await dispatch(getCurrentCompany({ companyId, token }))
  }

  const onDeletePlatformHandler = () => {
    setVisible(true)
  }

  const onDeleteCompany = async () => {
    const resultAction = await dispatch(deleteCompany({ companyId, token }))

    if (deleteCompany.rejected.match(resultAction)) {
      setCompanyNetworkError(true)
      waitNetworkTimer()
    } else {
      navigate(PATH.companyManagementPage)
      setCompanyNetworkError(false)
    }
  }

  const foundObject = currentCompany.employees.find((item) => item.id === user.employee?.id)

  useEffect(() => {
    dispatch(getCurrentCompany({ companyId, token }))
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.editCompanyCardPage}>
      <CustomModal visible={visible} setVisible={setVisible}>
        <DeleteComponent
          title='Удаление компании'
          description='Хотите удалить данную компанию ?'
          onCancelHandler={() => setVisible(false)}
          onDeleteHandler={onDeleteCompany}
          deleteError={companyNetworkError}
        />
      </CustomModal>
      <Navbar />
      <CompanyCardCategories
        categories={
          userRole === 'superAdmin' ||
          userRole === 'admin' ||
          userRole === 'directorPlace' ||
          (userRole === 'employeePlace' && foundObject) ||
          userRole === 'directorAgent'
            ? [
                { id: 1, title: 'Основная информация' },
                { id: 2, title: 'Сотрудники компании' },
                { id: 3, title: 'Площадки компании' },
              ]
            : [
                { id: 1, title: 'Основная информация' },
                { id: 3, title: 'Площадки компании' },
              ]
        }
        activeLink={1}
        cardId={companyId}
      />
      <HeaderForCard title='Карточка компании' />
      <div className={styles.content}>
        <EditCompanyCardMainInformation companyData={currentCompany} />
        <EditCardDescription
          text={currentCompany.description ? currentCompany.description : ''}
          onSubmitHandler={onSubmitDescription}
          error={companyError}
          companyConfirm={companyConfirm}
          onResetHandler={onResetHandler}
        />
        {(userRole === 'superAdmin' || userRole === 'admin') && (
          <BlockAndDeletePanel
            blockText='Компания заблокирована'
            isBlocked={currentCompany.isBlocked}
            checkBoxTitle='Заблокировать компанию'
            buttonTitle='Удалить компанию '
            onChangeHandler={onChangeSwipeCheckboxHandler}
            onDeleteHandler={onDeletePlatformHandler}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default EditCompanyCardPage
