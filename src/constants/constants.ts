import { OptionType } from '../types'

export const mainColors = [
  '#2BBA47',
  '#A547D2',
  '#FFA11D',
  '#EC1A3C',
  '#49A2FF',
  '#6342D2',
  '#FD46D5',
]
export const colorsPalette = [
  '#B71C1C',
  '#880E4F',
  '#4A148C',
  '#194185',
  '#006064',
  '#33691E',
  '#F57F17',
  '#E65100',
  '#3E2723',
  '#C62828',
  '#AD1457',
  '#6A1B9A',
  '#1849A9',
  '#00838F',
  '#558B2F',
  '#F9A825',
  '#EF6C00',
  '#4E342E',
  '#D32F2F',
  '#C2185B',
  '#7B1FA2',
  '#175CD3',
  '#0097A7',
  '#689F38',
  '#FBC02D',
  '#F57C00',
  '#5D4037',
  '#E53935',
  '#D81B60',
  '#8E24AA',
  '#1570EF',
  '#00ACC1',
  '#7CB342',
  '#FDD835',
  '#FB8C00',
  '#6D4C41',
  '#E35141',
  '#E91E63',
  '#9C27B0',
  '#2E90FA',
  '#00BCD4',
  '#8BC34A',
  '#FFEB3B',
  '#FF9800',
  '#795548',
  '#EF5350',
  '#EC407A',
  '#AB47BC',
  '#53B1FD',
  '#26C6DA',
  '#9CCC65',
  '#FFEE58',
  '#FFA726',
  '#8D6E63',
  '#E57373',
  '#F06292',
  '#BA68C8',
  '#84CAFF',
  '#4DD0E1',
  '#AED581',
  '#FFF176',
  '#FFB74D',
  '#A1887F',
]
export const superAdminOptions: OptionType[] = [
  { id: 1, title: 'Главная' },
  { id: 2, title: 'Администраторы' },
  { id: 3, title: 'Компании' },
  { id: 4, title: 'Площадки' },
  { id: 5, title: 'Заявки' },
  { id: 6, title: 'Запросы на регистрацию' },
]
export const adminOptions: OptionType[] = [
  { id: 1, title: 'Главная' },
  { id: 2, title: 'Компании' },
  { id: 3, title: 'Площадки' },
  { id: 4, title: 'Заявки' },
  { id: 5, title: 'Запросы на регистрацию' },
]
export const directorAgentOptions: OptionType[] = [
  { id: 1, title: 'Главная' },
  { id: 2, title: 'Заявки' },
  { id: 3, title: 'Профиль' },
]
export const directorPlatformOptions: OptionType[] = [
  { id: 1, title: 'Главная' },
  { id: 2, title: 'Заявки' },
  { id: 3, title: 'Профиль' },
]
export const agentOptions: OptionType[] = [
  { id: 1, title: 'Главная' },
  { id: 2, title: 'Заявки' },
  { id: 3, title: 'Профиль' },
]
export const platformOptions: OptionType[] = [
  { id: 1, title: 'Главная' },
  { id: 2, title: 'Заявки' },
  { id: 3, title: 'Профиль' },
]

export const monthsArr = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const placesPerPage = 16
export const companiesPerPage = 10
export const adminsPerPage = 10
export const staffPerPage = 10
export const requestsPerPage = 10

export const adminFilters = ['Все', 'Суперадминистратор', 'Администратор']
export const companiesFilters = ['Все', 'Агент', 'Площадка']
export const staffAgentFilters = ['Все', 'Директор-Агент', 'Агент']
export const staffPlacesFilters = ['Все', 'Директор-Площадка', 'Площадка']
export const claimsFilters = ['Все', 'Завершенные', 'В работе', 'Отклонены']
export const registrationRequestFilters = ['Все', 'В ожидании', 'Отклонены', 'Приняты']

export const claimsStatuses = ['В работе', 'Завершена', 'Отклонена']
