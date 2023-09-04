import { useEffect, useState } from 'react'

export function useRequestStatus(value: string): string {
  const [debouncedStatus, setDebouncedStatus] = useState(value ? value : '')

  useEffect(() => {
    setDebouncedStatus(value)
  }, [value])

  return debouncedStatus
}
