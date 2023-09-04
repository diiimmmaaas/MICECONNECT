import React, { FC, useEffect, useRef, useState } from 'react'
import * as yup from 'yup'
import { Formik, FormikValues } from 'formik'
import styles from './CreateClaim.module.css'
import PopupHeader from '../PopupHeader/PopupHeader'
import CustomInput from '../UI/CustomInput/CustomInput'
import CustomButton from '../UI/CustomButton/CustomButton'
import calendarIcon from '../../assets/icons/calendar.svg'
import clockIcon from '../../assets/icons/clock.svg'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { waitTimer } from '../../utils/waitTimer'
import { getPlaces } from '../../redux/actions/placesAction'
import s from '../../styles/common/Form.module.css'
import { format } from 'date-fns'
import { clearError } from '../../redux/reducers/claims/claimsSlice'
import DropDown from '../DropDown/DropDown'
import { Calendar } from '../CustomCalendar/components'
import DatePicker from 'react-datepicker'

export type CreateClaimPropsType = {
  onClickHandler: () => void
}

const CreateClaim: FC<CreateClaimPropsType> = ({ onClickHandler }) => {
  const [openStartDate, setOpenStartDate] = useState(false)
  const [openFinishDate, setOpenFinishDate] = useState(false)

  const [openStartTime, setOpenStartTime] = useState(false)
  const [openFinishTime, setOpenFinishTime] = useState(false)

  const [startDateString, setStartDateString] = useState('')
  const [finishDateString, setFinishDateString] = useState('')

  const [timeStart, setTimeStart] = useState<Date | null>(null)
  const [timeFinish, setTimeFinish] = useState<Date | null>(null)

  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date())
  const [selectedFinishDate, setSelectedFinishDate] = React.useState(new Date())

  const [validateError, setValidateError] = useState('')

  const getFormatDate = (time: Date | null) => {
    if (time !== null) {
      const hours: string = time.getHours().toString().padStart(2, '0')
      const minutes: string = time.getMinutes().toString().padStart(2, '0')
      const seconds: string = time.getSeconds().toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    } else {
      return null
    }
  }

  const onChangeStartDate = (date: Date) => {
    setSelectedStartDate(date)
    setStartDateString(format(date, 'dd.MM.yyyy'))
    setOpenStartDate(false)
  }

  const onChangeFinishDate = (date: Date) => {
    setSelectedFinishDate(date)
    setFinishDateString(format(date, 'dd.MM.yyyy'))
    setOpenFinishDate(false)
  }

  const navigate = useNavigate()

  const [claimError, setClaimError] = useState<boolean>(false)

  const { token } = useAppSelector((state) => state.auth)
  const { error } = useAppSelector((state) => state.places)

  const customInput = <input type='text' placeholder='Когда?' className={styles.datePickerInput} />

  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    city: yup.string().required('Поле не может быть'),
    guestsNumber: yup.string().required('Поле не может быть'),
  })

  const handleSubmitHandler = async (values: FormikValues) => {
    if (startDateString === '') {
      setValidateError('Дата начала мероприятия обязательна')
      waitTimer(() => setValidateError(''))
      waitTimer(() => clearError())
      return
    }

    if (finishDateString === '') {
      setValidateError('Дата окончания мероприятия обязательна')
      waitTimer(() => setValidateError(''))
      waitTimer(() => clearError())
      return
    }

    if (timeStart === null) {
      setValidateError('Время начала мероприятия обязательна')
      waitTimer(() => setValidateError(''))
      return
    }

    if (timeFinish === null) {
      setValidateError('Время окончания мероприятия обязательна')
      waitTimer(() => setValidateError(''))
      return
    }

    const startDate = `${startDateString.split('.').reverse().join('-')} ${getFormatDate(
      timeStart,
    )}`
    const endDate = `${finishDateString.split('.').reverse().join('-')} ${getFormatDate(
      timeFinish,
    )}`

    const resultAction = await dispatch(
      getPlaces({
        token,
        page: 1,
        itemsPerPage: 100,
        city: values.city,
        peopleCount: values.guestsNumber,
        startDate: startDate,
        endDate: endDate,
      }),
    )

    if (getPlaces.rejected.match(resultAction)) {
      setClaimError(true)
      waitTimer(() => setClaimError(false))
    } else {
      navigate(PATH.siteManagementPage, {
        state: {
          city: values.city,
          startDate: startDate,
          finishDate: endDate,
          startTime: timeStart,
          finishTime: timeFinish,
          guestsNumber: values.guestsNumber,
          titlePage: 'Доступные площадки',
        },
      })
      setClaimError(false)
    }
  }

  const openStartDateDropDown = (e: any) => {
    e.stopPropagation()
    setOpenStartDate(!openStartDate)
  }

  const openStartTimeDropDown = (e: any) => {
    e.stopPropagation()
    setOpenStartTime(!openStartTime)
  }

  const openFinishDateDropDown = (e: any) => {
    e.stopPropagation()
    setOpenFinishDate(!openFinishDate)
  }

  const openFinishTimeDropDown = (e: any) => {
    e.stopPropagation()
    setOpenFinishTime(!openFinishTime)
  }

  const handleTimeStartChange = (time: any) => {
    setTimeStart(time)
  }

  const handleTimeFinishChange = (time: any) => {
    setTimeFinish(time)
  }

  const dropdownStartDataRef = useRef<HTMLDivElement>(null)
  const dropdownStartTimeRef = useRef<HTMLDivElement>(null)
  const dropdownFinishDataRef = useRef<HTMLDivElement>(null)
  const dropdownFinishTimeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownStartDataRef.current &&
        !dropdownStartDataRef.current.contains(event.target as Node)
      ) {
        setOpenStartDate(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownFinishDataRef.current &&
        !dropdownFinishDataRef.current.contains(event.target as Node)
      ) {
        setOpenFinishDate(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownStartTimeRef.current &&
        !dropdownStartTimeRef.current.contains(event.target as Node)
      ) {
        setOpenStartTime(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownFinishTimeRef.current &&
        !dropdownFinishTimeRef.current.contains(event.target as Node)
      ) {
        setOpenFinishTime(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.createClaim}>
      <div className={styles.headerForm}>
        <PopupHeader title='Создание заявки' onClickHandler={onClickHandler} />
      </div>
      <div className={styles.form}>
        <Formik
          initialValues={{
            city: '',
            startDate: '',
            finishDate: '',
            startTime: '',
            finishTime: '',
            guestsNumber: '',
          }}
          validateOnBlur
          onSubmit={(values) => handleSubmitHandler(values)}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } =
              props

            return (
              <div className={styles.formContainer}>
                <div className={styles.inputGroup}>
                  <h4 className={styles.subtitle}>Город</h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='city'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.city}
                    className={
                      errors.city && touched.city
                        ? `${styles.inputError} ${styles.input}`
                        : styles.input
                    }
                  />
                  <div className={styles.dateBlock}>
                    <div className={styles.dateLeftBlock}>
                      <h4 className={styles.subtitle}>Дата начала</h4>
                      <div
                        className={styles.dateContainer}
                        onClick={(e) => openStartDateDropDown(e)}
                      >
                        <img className={styles.dateIcon} src={calendarIcon} alt='calendarIcon' />
                        <div className={styles.dateValue}>
                          {startDateString ? startDateString : 'Когда?'}
                        </div>
                      </div>

                      <DropDown
                        ref={dropdownStartDataRef}
                        className={styles.dropDown}
                        open={openStartDate}
                      >
                        <Calendar
                          selectedDate={selectedStartDate}
                          selectDate={(date) => onChangeStartDate(date)}
                        />
                      </DropDown>
                    </div>
                    <div className={styles.dateRightBlock}>
                      <h4 className={styles.subtitle}>Дата окончания</h4>
                      <div
                        className={styles.dateContainer}
                        onClick={(e) => openFinishDateDropDown(e)}
                      >
                        <img className={styles.dateIcon} src={calendarIcon} alt='calendarIcon' />
                        <div className={styles.dateValue}>
                          {finishDateString ? finishDateString : 'Когда?'}
                        </div>
                      </div>

                      <DropDown
                        ref={dropdownFinishDataRef}
                        className={styles.dropDown}
                        open={openFinishDate}
                      >
                        <Calendar
                          selectedDate={selectedFinishDate}
                          selectDate={(date) => onChangeFinishDate(date)}
                        />
                      </DropDown>
                    </div>
                  </div>
                  <div className={styles.timeBlock}>
                    <div className={styles.timeLeftBlock}>
                      <h4 className={styles.subtitle}>Время начала</h4>
                      <div
                        className={styles.timeContainer}
                        onClick={(e) => openStartTimeDropDown(e)}
                      >
                        <img className={styles.timeIcon} src={clockIcon} alt='clockIcon' />
                        <div className={styles.inputTimeBlock}>
                          <DatePicker
                            showTimeSelect
                            showTimeSelectOnly
                            selected={timeStart}
                            onChange={handleTimeStartChange}
                            dateFormat='h:mm aa'
                            timeIntervals={15}
                            timeCaption='Time'
                            customInput={customInput}
                            placeholderText='Когда?'
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.timeRightBlock}>
                      <h4 className={styles.subtitle}>Время окончания</h4>
                      <div
                        className={styles.timeContainer}
                        onClick={(e) => openFinishTimeDropDown(e)}
                      >
                        <img className={styles.timeIcon} src={clockIcon} alt='clockIcon' />
                        <div className={styles.inputTimeBlock}>
                          <DatePicker
                            showTimeSelect
                            showTimeSelectOnly
                            selected={timeFinish}
                            onChange={handleTimeFinishChange}
                            dateFormat='h:mm aa'
                            timeIntervals={15}
                            timeCaption='Time'
                            customInput={customInput}
                            placeholderText='Когда?'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h4 className={styles.subtitle}>Количество гостей</h4>
                  <CustomInput
                    type='text'
                    placeholder=''
                    name='guestsNumber'
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.guestsNumber}
                    className={
                      errors.guestsNumber && touched.guestsNumber
                        ? `${styles.inputError} ${styles.input}`
                        : styles.input
                    }
                  />
                  <>
                    {error && <p className={`${s.errorValidation} ${s.networkError}`}>{error}</p>}
                  </>
                  <>
                    {validateError && (
                      <p
                        style={{ marginBottom: 20 }}
                        className={`${s.errorValidation} ${s.networkError}`}
                      >
                        {validateError}
                      </p>
                    )}
                  </>
                </div>
                <div className={styles.buttonContainer}>
                  <CustomButton
                    title='Далее'
                    disabled={!isValid}
                    onClick={() => handleSubmit()}
                    type='submit'
                    className={styles.submitBtn}
                  />
                </div>
              </div>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default CreateClaim
