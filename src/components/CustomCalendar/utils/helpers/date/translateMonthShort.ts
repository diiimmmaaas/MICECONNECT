export function translateMonthAbbreviation(monthAbbreviation: string): string {
  const translationDict: { [key: string]: string } = {
    Jan: 'Янв',
    Feb: 'Фев',
    Mar: 'Мар',
    Apr: 'Апр',
    May: 'Май',
    Jun: 'Июн',
    Jul: 'Июл',
    Aug: 'Авг',
    Sep: 'Сен',
    Oct: 'Окт',
    Nov: 'Ноя',
    Dec: 'Дек',
  }

  return translationDict[monthAbbreviation] || monthAbbreviation
}
