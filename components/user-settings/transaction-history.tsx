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
import TransactionBox from '@/components/user-settings/transaction-box'
import PaginationComponent from '@/components/user-settings/pagination'

export default function TransactionHistory() {
  return (
    <div className="w-full space-y-7 px-12 py-16">
      <div className="flex flex-row items-center justify-between space-x-4">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <Select defaultValue="date">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="price(ascending)">
                Price (Low to High)
              </SelectItem>
              <SelectItem value="price(descending)">
                Price (High to Low)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2.5">
        <TransactionBox />
        <TransactionBox />
        <TransactionBox />
        <TransactionBox />
        <TransactionBox />
      </div>
      <PaginationComponent />
    </div>
  )
}
