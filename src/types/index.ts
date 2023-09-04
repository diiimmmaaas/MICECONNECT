export type UploadImagesType = {
  name: string
  type: string
  size: string
  src: string
}

export type TableItem = {
  id: number
  firstColumn: string
  secondColumn: string
  thirdColumn: string
  fourthColumn: string | undefined
  fifthColumn?: string | undefined
}

export type FiltersTitlesForTable = {
  firstBtnTitle: string
  secondBtnTitle: string
  thirdBtnTitle: string
  fourthBtnTitle?: string
}

export type OptionType = {
  id: number
  title: string
}
