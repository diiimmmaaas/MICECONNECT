export const sliceImagesForCarousel = (imagesArray: any[]) => {
  const temp = [...imagesArray]
  const newArray = []

  for (let i = 0; i < Math.ceil(imagesArray.length / 5); i++) {
    const tempArray = []
    temp[0] && tempArray.push(temp[0])
    temp[1] && tempArray.push(temp[1])
    temp[2] && tempArray.push(temp[2])
    temp[3] && tempArray.push(temp[3])
    temp[4] && tempArray.push(temp[4])
    temp[0] && temp.splice(0, 1)
    temp[0] && temp.splice(0, 1)
    temp[0] && temp.splice(0, 1)
    temp[0] && temp.splice(0, 1)
    temp[0] && temp.splice(0, 1)
    newArray.push(tempArray)
  }

  return newArray
}
