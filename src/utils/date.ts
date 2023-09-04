import { monthsArr } from '../constants/constants'

export const getNumberDayOfCurrentMonth = (monthName: string): number => {
  switch (monthName) {
    case 'January':
      return 0
    case 'February':
      return 1
    case 'March':
      return 2
    case 'April':
      return 3
    case 'May':
      return 4
    case 'June':
      return 5
    case 'July':
      return 6
    case 'August':
      return 7
    case 'September':
      return 8
    case 'October':
      return 9
    case 'November':
      return 10
    case 'December':
      return 11
    default:
      return 4
  }
}

export const getDaysInMonth = (year: number, month: number) => {
  return 32 - new Date(year, month, 32).getDate()
}

export const fillingArray = (
  n: number,
  m: number,
  id: number,
  monthNumber: number,
  startDateString: string,
  endDateString: string,
) => {
  let daysInMonth = getDaysInMonth(2023, getNumberDayOfCurrentMonth(monthsArr[monthNumber]))

  const startDateMonthNumber = Number(startDateString.slice(5, 7))
  const endDateMonthNumber = Number(endDateString.slice(5, 7))

  let arr: number[] = []

  if (startDateMonthNumber < monthNumber + 1 && monthNumber + 1 < endDateMonthNumber) {
    for (let i = 1; i <= daysInMonth; i++) {
      arr.push(i)
    }
    return { arr: arr, id: id }
  }

  if (startDateMonthNumber < monthNumber + 1) {
    for (let i = 1; i <= m; i++) {
      arr.push(i)
    }
    return { arr: arr, id: id }
  }

  if (n > m && startDateString < endDateString) {
    for (let i = n; i <= daysInMonth; i++) {
      arr.push(i)
    }
    return { arr: arr, id: id }
  } else {
    for (let i = n; i <= m; i++) {
      arr.push(i)
    }
    return { arr: arr, id: id }
  }

  return { arr: arr, id: id }
}
