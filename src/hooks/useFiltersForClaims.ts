import { useEffect, useState } from 'react'

export function useFiltersForClaims(value: string[]): string[] {
  const [debouncedFilters, setDebouncedFilters] = useState<string[]>(value ? value : [])

  useEffect(() => {
    setDebouncedFilters(value)
  }, [value])

  return debouncedFilters
}
