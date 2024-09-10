import React from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
import RecentMaps from '@/components/dashboard/recent-maps'
import MyMaps from '@/components/dashboard/my-maps'
import Community from '@/components/dashboard/community'
import SharedWithMe from '@/components/dashboard/shared-with-me'
import StarredMaps from '@/components/dashboard/starred-maps'
// import PageSwapper from '@/components/user-settings/page-swapper'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] }
}) {
  const { view } = searchParams
  const session = await auth()

  if (!session) {
    return redirect('/login')
  }

  return (
    <div className="grid w-full grid-cols-[auto,1fr]">
      <DashboardSidebar view={view} />
      {view === 'recent-maps' && <RecentMaps />}
      {view === 'my-maps' && <MyMaps />}
      {view === 'community' && <Community />}
      {view === 'shared-with-me' && <SharedWithMe />}
      {view === 'starred-maps' && <StarredMaps />}
    </div>
  )
}
