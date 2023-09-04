import React, { FC, useMemo } from 'react'
import styles from './EventsList.module.css'
import s from '../../styles/common/Form.module.css'
import Event from '../Event/Event'
import { EventType } from '../../pages/MainPage/MainPage'
import CustomPagination from '../UI/CustomPagination/CustomPagination'

export type EventsListPropsType = {
  fromMainPage?: boolean
  eventList: EventType[]
  pageSize: number
  bookingData?: {
    city: string
    startDate: string
    finishDate: string
    startTime: string
    finishTime: string
    guestsNumber: string
    titlePage: string
  } | null
  totalCountPages?: number
  currentPage: number
  setCurrentPage: (page: number) => void
}

const EventsList: FC<EventsListPropsType> = ({
  fromMainPage,
  eventList,
  pageSize,
  bookingData,
  totalCountPages,
  currentPage,
  setCurrentPage,
}) => {
  return (
    <div className={styles.eventList}>
      <div className={styles.eventsListContainer}>
        {eventList?.map((event) => {
          return (
            <Event
              fromMainPage={fromMainPage}
              key={event.id}
              id={event.id}
              title={event.title}
              images={event.images}
              numberOfPerson={event.numberOfPerson}
              subTitle={event.subTitle}
              bookingData={bookingData}
            />
          )
        })}
      </div>
      <div className={s.paginationContainer}>
        <CustomPagination
          currentPage={currentPage}
          totalCount={totalCountPages}
          pageSize={pageSize}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}

export default EventsList
