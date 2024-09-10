import React from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="flex w-full items-center space-x-2 sm:ml-auto">
      <Input type="search" placeholder="Search..." />
      <button
        type="submit"
        className="flex items-center justify-center rounded-full"
      >
        <Search className="h-6 w-6" />
      </button>
    </div>
  )
}
