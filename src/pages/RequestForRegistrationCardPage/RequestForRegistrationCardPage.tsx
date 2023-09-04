import React, { useEffect, useState } from 'react'
import styles from './RequestForRegistrationCardPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import HeaderForCard from '../../components/HeaderForCard/HeaderForCard'
import Footer from '../../components/Footer/Footer'
import RequestForRegistrationMainInformation from '../../components/RequestForRegistrationMainInformation/RequestForRegistrationMainInformation'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import {
  acceptRegistrationRequests,
  getCurrentRegistrationRequests,
  rejectRegistrationRequests,
} from '../../redux/actions/registartionRequestAction'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/UI/Loader/Loader'
import { waitTimer } from '../../utils/waitTimer'
import PATH from '../../navigation/path'
import p from '../../components/UI/CustomInput/CustomInput.module.css'
import s from '../../styles/common/Form.module.css'

const RequestForRegistrationCardPage = () => {
  const [registrationRequestError, setRegistrationRequestError] = useState<string>('')

  const { isLoading, currentRegistrationRequests } = useAppSelector(
    (state) => state.registrationRequest,
  )

  const { requestId } = useParams<{ requestId: string }>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleReset = async () => {
    const resultAction = await dispatch(
      rejectRegistrationRequests({ requestId: String(currentRegistrationRequests.id) }),
    )

    if (rejectRegistrationRequests.rejected.match(resultAction)) {
      setRegistrationRequestError(
        'Произошла ошибка при попытке отклонить заявку на' +
          ' регистрацию. Попробуйте' +
          ' еще раз',
      )
      waitTimer(() => setRegistrationRequestError(''))
    } else {
      setRegistrationRequestError('')
      navigate(PATH.requestForRegistration)
    }
  }

  const handleSubmit = async () => {
    const resultAction = await dispatch(
      acceptRegistrationRequests({ requestId: String(currentRegistrationRequests.id) }),
    )

    if (acceptRegistrationRequests.rejected.match(resultAction)) {
      setRegistrationRequestError(
        'Произошла ошибка при попытке подтвердить заявку на' +
          ' регистрацию.' +
          ' Попробуйте еще раз',
      )
      waitTimer(() => setRegistrationRequestError(''))
    } else {
      setRegistrationRequestError('')
      navigate(PATH.requestForRegistration)
    }
  }

  useEffect(() => {
    dispatch(getCurrentRegistrationRequests({ requestId }))
  }, [dispatch, requestId])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={styles.requestCard}>
      <Navbar />
      <div className={styles.container}>
        <HeaderForCard title='Запрос на регистрацию' />
        <div className={styles.content}>
          <RequestForRegistrationMainInformation requestData={currentRegistrationRequests} />
        </div>
        <>
          {registrationRequestError && (
            <p className={`${s.errorValidation} ${s.networkError}`}>{registrationRequestError}</p>
          )}
        </>
        {currentRegistrationRequests.status === 'inProgress' && (
          <div className={styles.btnsBlock}>
            <CustomButton
              type='reset'
              onClick={handleReset}
              title='Отменить'
              className={styles.cancelBtn}
            />
            <CustomButton
              title='Принять'
              onClick={handleSubmit}
              type='submit'
              className={styles.saveBtn}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default RequestForRegistrationCardPage
