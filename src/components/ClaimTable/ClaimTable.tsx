import React, { FC, useEffect, useState } from 'react'
import styles from './ClaimTable.module.css'
import ClaimTableHeader from '../ClaimTableHeader/ClaimTableHeader'
import { fillingArray, getDaysInMonth, getNumberDayOfCurrentMonth } from '../../utils/date'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import companyIcon from '../../assets/icons/briefcase.svg'
import userIcon from '../../assets/icons/user.svg'
import clockIcon from '../../assets/icons/clock.svg'
import { ClaimForTableType, ClaimsFromPlacesType } from '../../redux/actions/types'
import { monthsArr } from '../../constants/constants'
import Tooltip from '../UI/Tooltip/Tooltip'

const emptyArray = [1, 2, 3, 4, 5]

export type ClaimTablePropsType = {
  fromCurrentPlatform?: boolean
  yearsAndMonth: string
  monthNumber: number
  setMonthNumber: (monthNumber: number) => void
  onOpenClaimFilters: () => void
  onCheckMonthHandler: (month: string, year: string) => void
  claims: any
}

const ClaimTable: FC<ClaimTablePropsType> = ({
  fromCurrentPlatform,
  yearsAndMonth,
  monthNumber,
  setMonthNumber,
  onOpenClaimFilters,
  claims,
  onCheckMonthHandler,
}) => {
  const [platforms, setPlatforms] = useState<ClaimForTableType[]>([])
  const [days, setDays] = useState<number[]>([])

  const [weekMode, setWeekMode] = useState(false)

  const [displayedHover, setDisplayedHover] = React.useState(true)
  const [displayedHoverId, setDisplayedHoverId] = React.useState<number | null>(null)

  const [currentDate, setCurrentDate] = useState<{ month: string; year: number }>({
    month: monthsArr[monthNumber],
    year: 2023,
  })

  const dummyData = (array: any) => {
    const newClaims = array.map((newClaim: ClaimsFromPlacesType) => {
      return {
        ...newClaim,
        requests: newClaim.requests.map((a) => {
          const startDate = Number(a.startDate.slice(8, 10))
          const finishDate = Number(a.endDate.slice(8, 10))
          const startTime = a.startDate.slice(11, 16)
          const endTime = a.endDate.slice(11, 16)
          return {
            ...a,
            startDate: startDate,
            endDate: finishDate,
            startTime: startTime,
            endTime: endTime,
            startStringDate: a.startDate,
            endStringDate: a.endDate,
          }
        }),
      }
    })

    return newClaims
  }

  const now = new Date()

  const navigate = useNavigate()

  let daysInMonth = getDaysInMonth(2023, getNumberDayOfCurrentMonth(currentDate.month))

  const onNextMonth = async () => {
    if (monthNumber === 11) {
      setCurrentDate({ ...currentDate, month: monthsArr[0], year: currentDate.year + 1 })
      setMonthNumber(0)
      onCheckMonthHandler(monthsArr[0], String(currentDate.year + 1))
    } else {
      setCurrentDate({
        ...currentDate,
        month: monthsArr[monthNumber + 1],
      })
      setMonthNumber(monthNumber + 1)
      onCheckMonthHandler(monthsArr[monthNumber + 1], String(currentDate.year))
    }
  }
  const onPrevMonth = () => {
    if (monthNumber === 0) {
      setCurrentDate({ ...currentDate, month: monthsArr[11], year: currentDate.year - 1 })
      setMonthNumber(11)
      onCheckMonthHandler(monthsArr[11], String(currentDate.year - 1))
    } else {
      setCurrentDate({ ...currentDate, month: monthsArr[monthNumber - 1] })
      setMonthNumber(monthNumber - 1)
      onCheckMonthHandler(monthsArr[monthNumber - 1], String(currentDate.year))
    }
  }

  const onChangeTypeOfCalendar = (checked: boolean) => {
    if (!checked) {
      setWeekMode(true)
      setDays(
        [...Array(daysInMonth)]
          .map((e, i) => i + now.getDate())
          .slice(0, daysInMonth - now.getDate() + 1),
      )
    } else {
      setWeekMode(false)
      setDays([...Array(daysInMonth)].map((e, i) => i + 1))
    }
  }

  const onNavigateToCurrentClaim = (id: number) => {
    navigate(`${PATH.claimCardPage}${id}`)
  }

  useEffect(() => {
    setDays([...Array(daysInMonth)].map((e, i) => i + 1))
  }, [daysInMonth])

  useEffect(() => {
    setPlatforms(dummyData(claims))
  }, [])

  return (
    <div className={styles.claimTable}>
      <ClaimTableHeader
        weekMode={weekMode}
        fromCurrentPlatform={fromCurrentPlatform}
        yearsAndMonth={yearsAndMonth}
        currentDate={currentDate}
        onOpenClaimFilters={onOpenClaimFilters}
        onNextClickHandler={onNextMonth}
        onPrevClickHandler={onPrevMonth}
        onSwipeHandler={onChangeTypeOfCalendar}
      />
      <div className={styles.claimTableContent}>
        <div className={styles.leftBlock}>
          <div className={styles.platformEmptyItem}></div>
          {platforms.map((platform: any) => {
            return (
              <Tooltip key={platform.id} text={platform.name}>
                <div className={styles.platformItem} key={platform.id}>
                  {platform.name.length > 30 ? `${platform.name.slice(0, 30)}...` : platform.name}
                </div>
              </Tooltip>
            )
          })}
          {emptyArray.map((empt) => {
            return <div key={empt} className={styles.platformItem}></div>
          })}
        </div>
        <div className={styles.rightBlock}>
          <div
            className={styles.rightBlockHeader}
            style={
              weekMode
                ? {
                    gridTemplateColumns: `repeat(${days.length},minmax(160px, 1fr))`,
                  }
                : { gridTemplateColumns: `repeat(${days.length},minmax(42px, 1fr))` }
            }
          >
            {days.map((day, index) => {
              return (
                <div className={styles.headerItem} key={index}>
                  {day}
                </div>
              )
            })}
          </div>
          <div
            className={styles.rightBlockContent}
            style={{
              gridTemplateRows: `repeat(${platforms?.length},70px)`,
            }}
          >
            {platforms.map((p: any, ind: number) => {
              let request: any
              const rangeOfClaim: any = []
              for (let i = 0; i < p.requests.length; i++) {
                let rangeItemOfClaim = fillingArray(
                  p.requests[i].startDate,
                  p.requests[i].endDate,
                  p.requests[i].id,
                  monthNumber,
                  p.requests[i].startStringDate,
                  p.requests[i].endStringDate,
                )

                console.log('rangeItemOfClaim', rangeItemOfClaim)
                rangeOfClaim.push(rangeItemOfClaim)

                const containsRequest = p.requests.some(
                  (request: any) => request.id === displayedHoverId,
                )
                const index = p.requests.findIndex(
                  (request: any) => request.id === displayedHoverId,
                )
                if (containsRequest) {
                  request = {
                    title: p.name,
                    personCount: p.requests[index].peopleCount,
                    startTime: p.requests[index].startTime,
                    finishTime: p.requests[index].endTime,
                  }
                }
              }

              const onMouseEnterHandler = (id: number) => {
                setDisplayedHover(true)
                setDisplayedHoverId(id)
              }

              return (
                <div
                  key={ind}
                  className={styles.contentRowItem}
                  style={
                    weekMode
                      ? {
                          gridTemplateColumns: `repeat(${days.length},minmax(160px, 1fr))`,
                        }
                      : { gridTemplateColumns: `repeat(${days.length},minmax(42px, 1fr))` }
                  }
                >
                  <>
                    {days.map((d) => {
                      let resultBack = 'white'
                      let resultId: any

                      rangeOfClaim.forEach((range: any) => {
                        for (let j = 0; j < range.arr.length; j++) {
                          if (range.arr[j] === d) {
                            resultBack = p.color
                            resultId = range.id
                          }
                        }
                      })

                      return (
                        <div
                          className={styles.contentItem}
                          style={{ border: resultBack !== 'white' ? 'none' : '1px dashed #E5E7EB' }}
                          key={d}
                        >
                          {resultBack !== 'white' && (
                            <div
                              onClick={() => onNavigateToCurrentClaim(resultId ? resultId : null)}
                              className={styles.claimItem}
                              style={{ background: resultBack }}
                              onMouseEnter={() => onMouseEnterHandler(resultId ? resultId : null)}
                              onMouseLeave={() => setDisplayedHover(false)}
                            ></div>
                          )}
                        </div>
                      )
                    })}
                    {displayedHover &&
                      p.requests.some((request: any) => request.id === displayedHoverId) && (
                        <div className={styles.hoverPopup}>
                          <div className={styles.hoverPopupTimeBlock}>
                            <div className={styles.hoverPopupStartTimeBlock}>
                              <img
                                className={styles.hoverPopupPointIcon}
                                src={clockIcon}
                                alt='clockIcon'
                              />
                              <div className={styles.hoverPopupText}>{request.startTime}</div>
                            </div>
                            <div>-</div>
                            <div className={styles.hoverPopupFinishTimeBlock}>
                              <img
                                className={styles.hoverPopupPointIcon}
                                src={clockIcon}
                                alt='clockIcon'
                              />
                              <div className={styles.hoverPopupText}>{request.finishTime}</div>
                            </div>
                          </div>
                          <div className={styles.hoverPopupPointBlock}>
                            <img
                              className={styles.hoverPopupPointIcon}
                              src={companyIcon}
                              alt='companyIcon'
                            />
                            <div className={styles.hoverPopupText}>{request.title}</div>
                          </div>
                          <div className={styles.hoverPopupPointBlock}>
                            <img
                              className={styles.hoverPopupPointIcon}
                              src={userIcon}
                              alt='userIcon'
                            />
                            <div className={styles.hoverPopupText}>
                              {request.personCount} человек
                            </div>
                          </div>
                        </div>
                      )}
                  </>
                </div>
              )
            })}
            {emptyArray.map((emptyItem) => {
              return (
                <div
                  key={emptyItem}
                  className={styles.contentRowItem}
                  style={
                    weekMode
                      ? {
                          gridTemplateColumns: `repeat(${days.length},minmax(160px, 1fr))`,
                        }
                      : { gridTemplateColumns: `repeat(${days.length},minmax(42px, 1fr))` }
                  }
                >
                  {days.map((d) => {
                    let resultBack = 'white'
                    return (
                      <div
                        className={styles.contentItem}
                        style={{ border: resultBack !== 'white' ? 'none' : '1px dashed #E5E7EB' }}
                        key={d}
                      >
                        <div className={styles.claimItem} style={{ background: resultBack }}></div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClaimTable
