import React from 'react'
import Sidebar from '@/components/user-settings/sidebar'
import TransactionHistory from '@/components/user-settings/transaction-history'
import ProfileSettings from '@/components/user-settings/profile-settings'
// import PageSwapper from '@/components/user-settings/page-swapper'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] }
}) {
  const { view } = searchParams
  return (
    <div className="grid w-full grid-cols-[auto,1fr]">
      <Sidebar view={view} />
      {view === 'settings' && <ProfileSettings />}
      {view === 'transactions' && <TransactionHistory />}
    </div>
  )
}
