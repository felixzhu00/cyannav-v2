import React from 'react'
import { Input } from '@/components/ui/input'
import { Search as SearchIcon } from 'lucide-react'

interface SearchProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Search({ value, onChange }: SearchProps) {
  return (
    <div className="flex w-full items-center space-x-2 sm:ml-auto">
      <Input
        type="search"
        placeholder="Search..."
        value={value}
        onChange={onChange}
      />
      <button
        type="submit"
        className="flex items-center justify-center rounded-full"
      >
        <SearchIcon className="h-6 w-6" />
      </button>
    </div>
  )
}
