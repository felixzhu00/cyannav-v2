'use client'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Search from '@/components/dashboard/search'
import CardGrid from './card-grid/card-grid'
import {
  CustomFeatureCollection,
  MapFields,
} from '@/core/_entities/types/map.types'
import { useFilteredMaps } from '@/lib/hooks/use-filtered-maps'

import { dashboardViews } from '@/lib/const'
import { usePersistentSearchSort } from '@/lib/hooks/use-persistent-search-sort'

interface GeneralContentProps {
  view: string
  mapList: MapFields[]
}

export default function GeneralContent({ view, mapList }: GeneralContentProps) {
  const title = dashboardViews[view].title
  const searchable = dashboardViews[view].searchable
  const selectOptions = dashboardViews[view].selectOptions
  const defaultSort = selectOptions[0]?.value || ''

  const { searchTerm, setSearchTerm, sortKey, setSortKey } =
    usePersistentSearchSort(view, defaultSort)

  const filteredMapList = useFilteredMaps(mapList, sortKey, searchTerm)

  return (
    <div className="w-full space-y-7 px-4 py-8 md:px-6 lg:px-24 lg:py-16">
      <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">{title}</h1>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0 lg:items-center lg:space-x-4 lg:space-y-0">
          {searchable && (
            <Search
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          {selectOptions.length > 0 && (
            <Select
              key={title}
              value={sortKey}
              onValueChange={(val) => setSortKey(val)}
            >
              <SelectTrigger className="w-full md:max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort By</SelectLabel>
                  {selectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {filteredMapList.length ? (
        <CardGrid
          // showAddNewMap={view === 'my-maps'}
          showAddNewMap={false}
          mapList={filteredMapList}
        />
      ) : (
        <p className="mx-0 my-auto h-full w-full select-none justify-center pt-20 text-center text-3xl text-muted-foreground">
          No Map To Display
        </p>
      )}
    </div>
  )
}
