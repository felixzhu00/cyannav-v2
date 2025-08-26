import { MapFields } from '@/core/_entities/types/map.types'
import { useMemo, useState, useEffect } from 'react'

export function useFilteredMaps(
  mapList: MapFields[],
  sortKey: string,
  searchTerm: string,
  delay = 300
) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)

  const getScore = (m: MapFields) =>
    (m.likes?.length ?? 0) - (m.dislikes?.length ?? 0)
  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, delay])

  const filteredMapList = useMemo(() => {
    let result = [...mapList]

    if (debouncedSearch) {
      result = result.filter(
        (map) =>
          map.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ??
          false
      )
    }

    switch (sortKey) {
      case 'alphabet-a-z':
        result.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))

        break
      case 'created_at':
        result.sort(
          (a, b) =>
            new Date(b.dateCreated ?? '').getTime() -
            new Date(a.dateCreated ?? '').getTime()
        )
        break
      case 'updated_at':
        result.sort(
          (a, b) =>
            new Date(b.dateUpdated ?? '').getTime() -
            new Date(a.dateUpdated ?? '').getTime()
        )
        break
      case 'most_positive':
        result.sort((a, b) => getScore(b) - getScore(a))
        break
      case 'most_negative':
        result.sort((a, b) => getScore(a) - getScore(b))
        break
      default: {
        break
      }
    }

    return result
  }, [mapList, debouncedSearch, sortKey])

  return filteredMapList
}
