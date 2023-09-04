export function translateDayAbbreviation(dayAbbreviation: string): string {
  const translationDict: { [key: string]: string } = {
    Mon: 'ПН',
    Tue: 'ВТ',
    Wed: 'СР',
    Thu: 'ЧТ',
    Fri: 'ПТ',
    Sat: 'СБ',
    Sun: 'ВС',
  }

  return translationDict[dayAbbreviation] || dayAbbreviation
}
