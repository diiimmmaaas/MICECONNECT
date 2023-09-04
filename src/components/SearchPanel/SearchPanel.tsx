import React, { FC, useEffect, useRef, useState } from 'react'
import styles from './SearchPanel.module.css'
import glassIcon from '../../assets/icons/glass.svg'
import { useMediaQuery } from 'react-responsive'
import DropDown from '../DropDown/DropDown'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../../styles/common/datePicker.css'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { getPlaces } from '../../redux/actions/placesAction'
import { placesPerPage } from '../../constants/constants'
import { waitTimer } from '../../utils/waitTimer'
import CalendarComponent from '../CalendarComponent/CalendarComponent'

export type SearchPanelPropsType = {
  currentPage: number
  cityState?: string
  startDateStringState?: string
  finishDateStringState?: string
  timeStartState?: Date | null
  timeFinishState?: Date | null
  peopleCountState?: string
}

const SearchPanel: FC<SearchPanelPropsType> = ({
  currentPage,
  peopleCountState,
  finishDateStringState,
  startDateStringState,
  timeStartState,
  timeFinishState,
  cityState,
}) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [city, setCity] = useState(cityState ? cityState : '')

  const [openDate, setOpenDate] = useState(false)
  const [openTime, setOpenTime] = useState(false)

  const [startDateString, setStartDateString] = useState(
    startDateStringState ? startDateStringState : '',
  )
  const [finishDateString, setFinishDateString] = useState(
    finishDateStringState ? finishDateStringState : '',
  )

  const [timeStart, setTimeStart] = useState<Date | null>(timeStartState ? timeStartState : null)
  const [timeFinish, setTimeFinish] = useState<Date | null>(
    timeFinishState ? timeFinishState : null,
  )

  const [peopleCount, setPeopleCount] = useState(peopleCountState ? peopleCountState : '')

  const { token } = useAppSelector((state) => state.auth)
  const { error } = useAppSelector((state) => state.places)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const customInput = <input type='text' placeholder='Когда?' className={styles.datePickerInput} />

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

  const handleSearch = async () => {
    if (city || startDateString || timeStart || finishDateString || timeFinish || peopleCount) {
      let startDateAndTime
      let finishDateAndTime

      if (startDateString !== '' || finishDateString !== '') {
        if (startDateString === '' || finishDateString === '') {
          setErrorMessage('Дата начала и Дата конца обязательны для ввода')
          waitTimer(() => setErrorMessage(''))
          return
        }
      }

      if (startDateString !== '' && timeStart !== null) {
        startDateAndTime = `${startDateString.split('.').reverse().join('-')} ${getFormatDate(
          timeStart,
        )}`
      }

      if (startDateString !== '' && timeStart === null) {
        const now = new Date()
        startDateAndTime = `${startDateString.split('.').reverse().join('-')} ${getFormatDate(now)}`
      }

      if (finishDateString !== '' && timeFinish !== null) {
        finishDateAndTime = `${finishDateString.split('.').reverse().join('-')} ${getFormatDate(
          timeFinish,
        )}`
      }

      if (finishDateString !== '' && timeFinish === null) {
        const now = new Date()
        finishDateAndTime = `${finishDateString.split('.').reverse().join('-')} ${getFormatDate(
          now,
        )}`
      }

      const resultAction = await dispatch(
        getPlaces({
          token,
          page: currentPage,
          itemsPerPage: placesPerPage,
          startDate: startDateAndTime,
          endDate: finishDateAndTime,
          city: city,
          peopleCount: peopleCount,
        }),
      )

      if (getPlaces.rejected.match(resultAction)) {
        return
      } else {
        navigate('/', {
          state: {
            startDateAndTime,
            finishDateAndTime,
            city,
            peopleCount,
            startDateString,
            finishDateString,
            startTime: timeStart,
            finishTime: timeFinish,
          },
        })
      }
      return
    }

    if (
      !city &&
      !startDateString &&
      !finishDateString &&
      !timeStart &&
      !timeFinish &&
      !peopleCount
    ) {
      await dispatch(getPlaces({ token, page: currentPage, itemsPerPage: placesPerPage }))
    }
  }

  const handleCityChange = (e: any) => {
    setCity(e.target.value)
  }

  const handleTimeStartChange = (time: any) => {
    setTimeStart(time)
  }

  const handleTimeFinishChange = (time: any) => {
    setTimeFinish(time)
  }

  const handlePeopleCountChange = (e: any) => {
    setPeopleCount(e.target.value)
  }

  const handleCloseAllDropDowns = () => {
    setOpenDate(false)
    setOpenTime(false)
  }

  const openDateDropDown = (e: any) => {
    e.stopPropagation()
    setOpenDate(!openDate)
    if (openTime) {
      setOpenTime(false)
    }
  }

  const openTimeDropDown = (e: any) => {
    e.stopPropagation()
    setOpenTime(!openTime)
    if (openDate) {
      setOpenDate(false)
    }
  }

  const isTablet = useMediaQuery({ query: '(max-width: 1439px)' })

  const dropdownDataRef = useRef<HTMLDivElement>(null)
  const dropdownTimeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownDataRef.current && !dropdownDataRef.current.contains(event.target as Node)) {
        setOpenDate(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownTimeRef.current && !dropdownTimeRef.current.contains(event.target as Node)) {
        setOpenTime(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.searchPanelContainer}>
      <div className={styles.searchPanel}>
        <div className={styles.cityBlock}>
          <input
            className={styles.cityInput}
            type='text'
            placeholder='Ваш город'
            value={city}
            onChange={handleCityChange}
            onFocus={handleCloseAllDropDowns}
          />
        </div>
        <div className={styles.dateBlock} onClick={(e) => openDateDropDown(e)}>
          <span style={error || errorMessage ? { color: '#EC1A3C' } : {}} className={styles.input}>
            Дата
          </span>
          <DropDown ref={dropdownDataRef} className={styles.dropDown} open={openDate}>
            <CalendarComponent
              startDateString={startDateString}
              finishDateString={finishDateString}
              setStartDateString={setStartDateString}
              setFinishDateString={setFinishDateString}
            />
            {error && <div className={styles.errorBlock}>{error}</div>}
            {errorMessage && <div className={styles.errorBlock}>{errorMessage}</div>}
          </DropDown>
        </div>
        <div className={styles.hourBlock} onClick={(e) => openTimeDropDown(e)}>
          <span className={styles.input}>Время</span>
          <DropDown ref={dropdownTimeRef} className={styles.dropDownTime} open={openTime}>
            <div className={styles.dropDownContainer}>
              <div className={styles.timeBlock}>
                <div className={styles.inputTimeTitle}>Начало</div>
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
                    isClearable
                  />
                </div>
              </div>
              <div className={styles.timeBlock}>
                <div className={styles.inputTimeTitle}>Конец</div>
                <div className={styles.inputTimeBlock}>
                  <DatePicker
                    showTimeSelect
                    showTimeSelectOnly
                    selected={timeFinish}
                    onChange={handleTimeFinishChange}
                    dateFormat='h:mm aa'
                    timeIntervals={15}
                    timeCaption='Time'
                    placeholderText='Когда?'
                    customInput={customInput}
                    isClearable
                  />
                </div>
              </div>
            </div>
          </DropDown>
        </div>
        <div className={styles.guestsBlock}>
          {isTablet ? (
            <input
              className={styles.input}
              type='text'
              placeholder='Кол-во гостей'
              value={peopleCount}
              onChange={handlePeopleCountChange}
              onFocus={handleCloseAllDropDowns}
            />
          ) : (
            <input
              className={styles.input}
              type='text'
              placeholder='Количество гостей'
              value={peopleCount}
              onChange={handlePeopleCountChange}
              onFocus={handleCloseAllDropDowns}
            />
          )}
        </div>
        <div className={styles.glassBlock} onClick={handleSearch}>
          <img className={styles.glassIcon} src={glassIcon} alt='glass' />
        </div>
      </div>
      {error && <div className={styles.errorBlock}>{error}</div>}
      {errorMessage && <div className={styles.errorBlock}>{errorMessage}</div>}
    </div>
  )
}

export default SearchPanel
