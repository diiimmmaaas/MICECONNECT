import React, { FC, useEffect, useRef, useState } from 'react'
import styles from './PlatformCardBooking.module.css'
import s from '../../styles/common/Form.module.css'
import { Formik, FormikValues } from 'formik'
import CustomInput from '../UI/CustomInput/CustomInput'
import CustomButton from '../UI/CustomButton/CustomButton'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { PlaceType } from '../../redux/actions/types'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import DropDown from '../DropDown/DropDown'
import { Calendar } from '../CustomCalendar/components'
import { format } from 'date-fns'
import calendarIcon from '../../assets/icons/calendar.svg'
import clockIcon from '../../assets/icons/clock.svg'
import DatePicker from 'react-datepicker'
import { createClaim } from '../../redux/actions/claimsAction'
import { waitTimer } from '../../utils/waitTimer'
import PATH from '../../navigation/path'
import { clearError } from '../../redux/reducers/claims/claimsSlice'

export type PlatformCardBookingPropsType = {
  bookingData?: {
    city: string
    startDate: string
    finishDate: string
    startTime: Date
    finishTime: Date
    guestsNumber: string
    titlePage: string
  } | null
  platformData: PlaceType
  platformCity: string
}

const PlatformCardBooking: FC<PlatformCardBookingPropsType> = ({
  bookingData,
  platformData,
  platformCity,
}) => {
  const [openStartDate, setOpenStartDate] = useState(false)
  const [openFinishDate, setOpenFinishDate] = useState(false)

  const [openStartTime, setOpenStartTime] = useState(false)
  const [openFinishTime, setOpenFinishTime] = useState(false)

  const [startDateString, setStartDateString] = useState(
    bookingData?.startDate
      ? bookingData?.startDate?.slice(0, 10).split('-').reverse().join('.')
      : '',
  )
  const [finishDateString, setFinishDateString] = useState(
    bookingData?.finishDate
      ? bookingData?.startDate?.slice(0, 10).split('-').reverse().join('.')
      : '',
  )

  const [timeStart, setTimeStart] = useState<Date | null>(
    bookingData?.startTime ? bookingData?.startTime : null,
  )
  const [timeFinish, setTimeFinish] = useState<Date | null>(
    bookingData?.finishTime ? bookingData?.finishTime : null,
  )

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

  const [city, setCity] = useState('')

  const { token, user } = useAppSelector((state) => state.auth)
  const { error } = useAppSelector((state) => state.claims)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const validationSchema = yup.object().shape({
    guestsNumber: yup.string().required('Поле не может быть'),
  })

  const customInput = <input type='text' placeholder='Когда?' className={styles.datePickerInput} />

  const handleSubmitHandler = async (values: FormikValues) => {
    if (startDateString === '') {
      setValidateError('Дата начала мероприятия обязательна')
      waitTimer(() => setValidateError(''))
      return
    }

    if (finishDateString === '') {
      setValidateError('Дата окончания мероприятия обязательна')
      waitTimer(() => setValidateError(''))
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
      createClaim({
        token,
        userId: String(user.id),
        peopleCount: values.guestsNumber,
        placeId: String(platformData.id),
        startDate: startDate,
        endDate: endDate,
      }),
    )

    if (createClaim.rejected.match(resultAction)) {
      waitTimer(() => clearError())
    } else {
      navigate(PATH.reservationPlatformPage)
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

  useEffect(() => {
    setCity(platformCity)
  }, [platformCity])

  return (
    <div className={styles.platformCardBooking}>
      <div className={styles.form}>
        <h1 className={styles.title}>Бронь площадки</h1>
        <Formik
          initialValues={{
            city: city ? city : '',
            guestsNumber: bookingData ? bookingData.guestsNumber : '',
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
                  <div className={styles.companyBlock}>{city}</div>
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
                    {error && (
                      <p
                        style={{ marginBottom: 20 }}
                        className={`${s.errorValidation} ${s.networkError}`}
                      >
                        {error as string}
                      </p>
                    )}
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
                <div className={s.buttonGroup}>
                  <CustomButton
                    title='Забронировать'
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

export default PlatformCardBooking
