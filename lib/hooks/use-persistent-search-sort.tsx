import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function usePersistentSearchSort(
  view: string,
  defaultSortKey: string,
  debounceDelay = 300
) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
  const [sortKey, setSortKey] = useState(
    searchParams.get('sort') || defaultSortKey
  )

  // Reset state when `view` changes
  useEffect(() => {
    setSearchTerm('')
    setSortKey(defaultSortKey)
  }, [view, defaultSortKey])

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, debounceDelay)
    return () => clearTimeout(handler)
  }, [searchTerm, debounceDelay])

  // Update URL when search or sort changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm)
    } else {
      params.delete('search')
    }

    if (sortKey) {
      params.set('sort', sortKey)
    } else {
      params.delete('sort')
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }, [debouncedSearchTerm, sortKey, router])

  return { searchTerm, setSearchTerm, sortKey, setSortKey }
}
