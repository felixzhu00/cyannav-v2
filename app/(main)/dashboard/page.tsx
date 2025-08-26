import React from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
// import RecentMaps from '@/components/dashboard/tabs/recent-maps'
// import PageSwapper from '@/components/user-settings/page-swapper'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import GeneralContent from '@/components/dashboard/general-content'
import { cookies } from 'next/headers'
import { MapFields } from '@/core/_entities/types/map.types'
import { dashboardViews } from '@/lib/const'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] }
}) {
  // Check if user is authenticated
  const session = await auth()

  if (!session) {
    return redirect('/login')
  }

  // Go to view by search param
  const { view } = searchParams

  // If searchParams doesnt have view redirect
  if (!view || typeof view !== 'string')
    return redirect('/dashboard?view=my-maps')

  // default to my-map if invalid
  if (!view || !Object.keys(dashboardViews).includes(view))
    return redirect('/dashboard?view=my-maps')

  try {
    const cookieStore = cookies() // reads cookies from incoming request

    // Fetch the data from the API route
    const response = await fetch(`http:/localhost:3000/api/map?view=${view}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(), // manually forward cookies
      },
      cache: 'no-store',
    })
    // Check if response errors
    if (!response.ok) {
      const errorData = await response.json()
      return <p>Error: {errorData.message}</p>
    }

    // Get the list of maps to display
    const maps = await response.json()

    // Get the maplist field
    const mapList = maps.payload as MapFields[]
    return (
      <div className="grid w-full grid-cols-[auto,1fr]">
        <DashboardSidebar view={view} />
        <GeneralContent view={view} mapList={mapList} />
      </div>
    )
  } catch (error) {
    console.error(error)
    return (
      <p className="mx-0 my-auto h-full w-full select-none justify-center pt-20 text-center text-3xl text-muted-foreground">
        Error fetching map
      </p>
    )
  }
}
