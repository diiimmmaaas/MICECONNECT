export const stringMax = (b: string, c: number) => {
  if (b !== null && b.length > c) {
    const a = b.substring(0, c)
    return a.substring(0, Math.max(a.lastIndexOf(' '), a.lastIndexOf(',') - 1))
  } else if (b === null) {
    return 'Пользователь не предоставил описание'
  } else {
    return b
  }
}

export const truncateString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) {
    return str
  } else {
    return str.slice(0, maxLength) + '...'
  }
}
