import React from 'react'

export default function TransactionBox() {
  return (
    <div className="flex h-[120px] w-full flex-row justify-between space-x-3 rounded-md border border-[#E2E8F0] bg-white p-6 drop-shadow-md">
      <div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">Date</p>
          <p className="text-sm text-[#64748B]">2024-06-07</p>
        </div>
      </div>
      <div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">Item</p>
          <p className="text-sm text-[#64748B]">
            Pro Plan. Thank you for subscribing!
          </p>
        </div>
      </div>
      <div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">Amount</p>
          <p className="text-sm text-[#64748B]">$50.00</p>
        </div>
      </div>

      <div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">Status</p>
          <p className="text-sm text-[#64748B]">Complete</p>
        </div>
      </div>
    </div>
  )
}
