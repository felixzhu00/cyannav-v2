import React from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
// import RecentMaps from '@/components/dashboard/tabs/recent-maps'
// import PageSwapper from '@/components/user-settings/page-swapper'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import GeneralContent from '@/components/dashboard/general-content'
import CardGrid from '@/components/dashboard/card-grid/card-grid'
import { cookies } from 'next/headers'
import { MapFields } from '@/core/_entities/types/map.types'

type DashboardView = {
  title: string
  searchable: boolean
  selectOptions: { label: string; value: string }[]
}

const dashboardViews: { [key: string]: DashboardView } = {
  'my-maps': {
    title: 'My Maps',
    searchable: true,
    selectOptions: [
      { label: 'Recently Updated', value: 'updated_at' }, // default
      { label: 'A-Z', value: 'alphabet-a-z' },
      { label: 'Recently Created', value: 'created_at' },
    ],
  },
  community: {
    title: 'Community',
    searchable: true,
    selectOptions: [
      { label: 'Most Positive', value: 'most_positive' }, // default
      { label: 'Most Negative', value: 'most_negative' },
      { label: 'Recently Updated', value: 'updated_at' },
      { label: 'A-Z', value: 'alphabet-a-z' },
      { label: 'Recently Created', value: 'created_at' },
    ],
  },
  'shared-with-me': {
    title: 'Shared with Me',
    searchable: false,
    selectOptions: [], // no sort options
  },
  'starred-maps': {
    title: 'Starred Maps',
    searchable: false,
    selectOptions: [], // no sort options
  },
}

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

  //default to my-map if invalid
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
        <GeneralContent
          title={dashboardViews[view].title}
          searchable={dashboardViews[view].searchable}
          selectOptions={dashboardViews[view].selectOptions}
        >
          <CardGrid showAddNewMap={view === 'my-maps'} mapList={mapList} />
        </GeneralContent>
      </div>
    )
  } catch (error) {
    console.log(error)
    return <p>Error fetching map</p>
  }
}
