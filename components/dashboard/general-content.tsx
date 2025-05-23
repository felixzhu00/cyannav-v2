import React from 'react'
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

interface DashboardView {
  title: string
  searchable: boolean
  selectOptions: { label: string; value: string }[]
}

interface GeneralContentProps extends DashboardView {
  children: React.ReactNode
}

export default function GeneralContent({
  title,
  searchable,
  selectOptions,
  children,
}: GeneralContentProps) {
  return (
    <div className="w-full space-y-7 px-4 py-8 md:px-6 lg:px-24 lg:py-16">
      <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">{title}</h1>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0 lg:items-center lg:space-x-4 lg:space-y-0">
          {searchable && <Search />}
          {selectOptions.length > 0 && (
            <Select defaultValue={selectOptions[0].value}>
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

      {children}
    </div>
  )
}
