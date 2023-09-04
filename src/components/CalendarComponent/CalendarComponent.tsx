import React, { FC, useState } from 'react'
import styles from './CalendarComponent.module.css'
import clearIcon from '../../assets/icons/x.svg'
import { Calendar } from '../CustomCalendar/components'
import { format } from 'date-fns'

export type CalendarComponentPropsType = {
  startDateString: string
  finishDateString: string
  setStartDateString: (startDateString: string) => void
  setFinishDateString: (finishDateString: string) => void
}

const CalendarComponent: FC<CalendarComponentPropsType> = ({
  setStartDateString,
  setFinishDateString,
  startDateString,
  finishDateString,
}) => {
  const [showStartCalendar, setShowStartCalendar] = useState(true)
  const [showFinishCalendar, setShowFinishCalendar] = useState(false)

  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date())
  const [selectedFinishDate, setSelectedFinishDate] = React.useState(new Date())

  const onChangeStartDate = (date: Date) => {
    setSelectedStartDate(date)
    setStartDateString(format(date, 'dd.MM.yyyy'))
  }

  const onChangeFinishDate = (date: Date) => {
    setSelectedFinishDate(date)
    setFinishDateString(format(date, 'dd.MM.yyyy'))
  }

  const onCheckStartCalendar = () => {
    setShowStartCalendar(true)
    setShowFinishCalendar(false)
  }
  const onCheckFinishCalendar = () => {
    setShowFinishCalendar(true)
    setShowStartCalendar(false)
  }

  const onClearStartDate = () => {
    setStartDateString('')
  }
  const onClearFinishDate = () => {
    setFinishDateString('')
  }

  return (
    <div className={styles.calendarComponent}>
      <div className={styles.calendarContainer}>
        <div className={styles.inputsBlock}>
          <div
            className={
              showStartCalendar
                ? `${styles.activeInputBlock} ${styles.inputBlock}`
                : styles.inputBlock
            }
          >
            <div className={styles.text} onClick={onCheckStartCalendar}>
              <div className={styles.inputTitle}>Начало</div>
              <div className={styles.inputValue}>
                {startDateString ? startDateString : 'Когда?'}
              </div>
            </div>
            <div className={styles.imageBlock}>
              <img
                className={styles.clearIcon}
                src={clearIcon}
                alt='clearIcon'
                onClick={onClearStartDate}
              />
            </div>
          </div>
          <div
            className={
              showFinishCalendar
                ? `${styles.activeInputBlock} ${styles.inputBlock}`
                : styles.inputBlock
            }
          >
            <div className={styles.text} onClick={onCheckFinishCalendar}>
              <div className={styles.inputTitle}>Конец</div>
              <div className={styles.inputValue}>
                {finishDateString ? finishDateString : 'Когда?'}
              </div>
            </div>
            <div className={styles.imageBlock}>
              <img
                className={styles.clearIcon}
                src={clearIcon}
                alt='clearIcon'
                onClick={onClearFinishDate}
              />
            </div>
          </div>
        </div>
        <div className={styles.calendarBlock}>
          {showStartCalendar && (
            <Calendar
              selectedDate={selectedStartDate}
              selectDate={(date) => onChangeStartDate(date)}
            />
          )}
          {showFinishCalendar && (
            <Calendar
              selectedDate={selectedFinishDate}
              selectDate={(date) => onChangeFinishDate(date)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarComponent
