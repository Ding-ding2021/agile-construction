import { useMemo, useState } from 'react'

type UseListStateParams<T, TFilter> = {
  source: T[]
  initialFilters: TFilter
  initialSearch?: string
  initialPage?: number
  pageSize?: number
  process: (args: {
    source: T[]
    filters: TFilter
    page: number
    pageSize: number
    searchQuery: string
  }) => {
    data: T[]
    total: number
  }
}

export const useListState = <T, TFilter>({
  source,
  initialFilters,
  initialSearch = '',
  initialPage = 1,
  pageSize = 10,
  process,
}: UseListStateParams<T, TFilter>) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [filters, setFilters] = useState<TFilter>(initialFilters)
  const [currentPage, setCurrentPage] = useState(initialPage)

  const result = useMemo(() => {
    return process({ source, filters, page: currentPage, pageSize, searchQuery })
  }, [currentPage, filters, pageSize, process, searchQuery, source])

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    data: result.data,
    total: result.total,
  }
}
