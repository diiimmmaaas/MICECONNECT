import { ClaimForTableType, ClaimResponseType } from '../redux/actions/types'

export function mergeDuplicateObjectsByPlaceName(arr: ClaimResponseType[]) {
  const mergedObjects: any = {}

  arr.forEach((obj: any) => {
    const placeName = obj.place.name

    if (!mergedObjects[placeName]) {
      mergedObjects[placeName] = {
        ...obj,
        startDate: [obj.startDate],
        endDate: [obj.endDate],
        // id: [obj.id],
      }
    } else {
      mergedObjects[placeName].startDate.push(obj.startDate)
      mergedObjects[placeName].endDate.push(obj.endDate)
      // mergedObjects[placeName].id.push(obj.id)
    }
  })

  const mergedArray: ClaimForTableType[] = Object.values(mergedObjects)

  return mergedArray
}
