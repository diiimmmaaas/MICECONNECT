import React, { useEffect, useState } from 'react'
import styles from './EditClaimCardPage.module.css'
import CustomModal from '../../components/UI/CustomModal/CustomModal'
import DeleteComponent from '../../components/DeleteComponent/DeleteComponent'
import Navbar from '../../components/Navbar/Navbar'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import EditCardDescription from '../../components/EditCardDescription/EditCardDescription'
import BlockAndDeletePanel from '../../components/BlockAndDeletePanel/BlockAndDeletePanel'
import Footer from '../../components/Footer/Footer'
import EditClaimCardMainInformation from '../../components/EditClaimCardMainInformation/EditClaimCardMainInformation'
import {
  changeClaimDescription,
  deleteCurrentClaim,
  getCurrentClaim,
} from '../../redux/actions/claimsAction'
import Loader from '../../components/UI/Loader/Loader'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { waitTimer } from '../../utils/waitTimer'
import PATH from '../../navigation/path'

const EditClaimCardPage = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [claimError, setClaimError] = useState<boolean>(false)
  const [claimNetworkError, setClaimNetworkError] = useState<boolean>(false)
  const [claimConfirm, setClaimConfirm] = useState<boolean>(false)

  const { claimId } = useParams<{ claimId: string }>()

  const { isLoading, currentClaim } = useAppSelector((state) => state.claims)

  const { token } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onChangeSwipeCheckboxHandler = (checked: boolean) => {
    console.log(checked)
  }

  const waitNetworkTimer = () => {
    const timer = setTimeout(() => {
      setClaimError(false)
      setClaimNetworkError(false)
    }, 5000)

    return () => clearTimeout(timer)
  }

  const onSubmitDescription = async (newDescription: string) => {
    const resultAction = await dispatch(
      changeClaimDescription({
        token,
        claimId,
        description: newDescription,
      }),
    )

    if (changeClaimDescription.rejected.match(resultAction)) {
      setClaimError(true)
      waitNetworkTimer()
    } else {
      setClaimConfirm(true)
      waitTimer(() => setClaimConfirm(false))
      setClaimError(false)
    }
  }

  const onResetHandler = () => {
    navigate(`${PATH.claimCardPage}${currentClaim.id}`)
  }

  const onDeletePlatformHandler = () => {
    setVisible(true)
  }

  const onDeleteClaim = async () => {
    const resultAction = await dispatch(
      deleteCurrentClaim({ claimId: String(currentClaim.id), token }),
    )

    if (deleteCurrentClaim.rejected.match(resultAction)) {
      setClaimNetworkError(true)
      waitNetworkTimer()
    } else {
      navigate(PATH.claimManagementPage)
      setClaimNetworkError(false)
    }
  }

  useEffect(() => {
    dispatch(getCurrentClaim({ claimId, token }))
  }, [dispatch, claimId])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.editClaimCardPage}>
      <CustomModal visible={visible} setVisible={setVisible}>
        <DeleteComponent
          title='Удаление заявки'
          description='Хотите удалить данную заявку ?'
          onCancelHandler={() => setVisible(false)}
          onDeleteHandler={onDeleteClaim}
          deleteError={claimNetworkError}
        />
      </CustomModal>
      <Navbar />
      <div className={styles.headerBlock}>
        <HeaderForCard title='Детали заявки' onRedirectHandler={onResetHandler} />
      </div>
      <div className={styles.content}>
        <EditClaimCardMainInformation claimData={currentClaim} />
        {currentClaim.description && (
          <EditCardDescription
            text={currentClaim.description ? currentClaim.description : ''}
            onSubmitHandler={onSubmitDescription}
            error={claimError}
            companyConfirm={claimConfirm}
            onResetHandler={onResetHandler}
          />
        )}
        <BlockAndDeletePanel
          isClaims
          blockText='Заявка заблокирована'
          isBlocked={false}
          checkBoxTitle='Заблокировать заявку'
          buttonTitle='Удалить заявку'
          onChangeHandler={onChangeSwipeCheckboxHandler}
          onDeleteHandler={onDeletePlatformHandler}
        />
      </div>
      <Footer />
    </div>
  )
}

export default EditClaimCardPage
