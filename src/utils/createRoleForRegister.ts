export const createRoleForRegister = (role: string | undefined) => {
  switch (role) {
    case 'Площадка':
      return 'employeePlace'
    case 'площадка':
      return 'employeePlace'
    case 'Агент':
      return 'employeeAgent'
    case 'агент':
      return 'employeeAgent'
    case 'Суперадминистратор':
      return 'superAdmin'
    case 'суперадминистратор':
      return 'superAdmin'
    case 'Администратор':
      return 'admin'
    case 'администратор':
      return 'admin'
    case 'Директор-Агент':
      return 'directorAgent'
    case 'директор-агент':
      return 'directorAgent'
    case 'директор-Агент':
      return 'directorAgent'
    case 'Директор-агент':
      return 'directorAgent'
    case 'Директор-Площадка':
      return 'directorPlace'
    case 'директор-площадка':
      return 'directorPlace'
    case 'Директор-площадка':
      return 'directorPlace'
    case 'директор-Площадка':
      return 'directorPlace'
  }
}

export const createRoleForTable = (roleEN: string | undefined) => {
  switch (roleEN) {
    case 'superAdmin':
      return 'Суперадминистратор'
    case 'admin':
      return 'Администратор'
    case 'directorAgent':
      return 'Директор-Агент'
    case 'directorPlace':
      return 'Директор-Площадка'
    case 'employeeAgent':
      return 'Агент'
    case 'employeePlace':
      return 'Площадка'
  }
}

export const createRoleCompanyFromRuToEn = (role: string) => {
  switch (role) {
    case 'Площадка':
      return 'directorPlace'
    case 'Агент':
      return 'directorAgent'
  }
}

export const createRoleCompanyFromEnToRu = (roleEN: string | undefined) => {
  switch (roleEN) {
    case 'directorAgent':
      return 'Агент'
    case 'directorPlace':
      return 'Площадка'
  }
}

export const createStatusForRegistrationRequest = (status: string | undefined) => {
  switch (status) {
    case 'inProgress':
      return 'В ожидании'
    case 'accepted':
      return 'Принят'
    case 'rejected':
      return 'Отклонен'
  }
}

export const createStatusForRegistrationRequestFilters = (status: string | undefined) => {
  switch (status) {
    case 'inProgress':
      return 'В ожидании'
    case 'accepted':
      return 'Приняты'
    case 'rejected':
      return 'Отклонены'
    case 'directorPlace':
      return 'Директор-Площадка'
    case 'directorAgent':
      return 'Директор-Агент'
    case 'employeePlace':
      return 'Площадка'
    case 'employeeAgent':
      return 'Агент'
    case 'admin':
      return 'Администратор'
    case 'superAdmin':
      return 'Суперадминистратор'
    default:
      return 'Все'
  }
}

export const createStatusForCompanyFilters = (status: string | undefined) => {
  switch (status) {
    case 'directorPlace':
      return 'Площадка'
    case 'directorAgent':
      return 'Агент'
    case 'inProgress':
      return 'В работе'
    case 'accepted':
      return 'Завершенные'
    case 'rejected':
      return 'Отклонены'
    default:
      return 'Все'
  }
}
