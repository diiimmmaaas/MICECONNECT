import jpgFile from '../assets/icons/fileJpg.svg'
import pdfFile from '../assets/icons/filePdf.svg'

export const createIconForExtension = (filePath: string) => {
  switch (filePath) {
    case 'JPG':
      return jpgFile
    case 'pdf':
      return pdfFile
  }
}
