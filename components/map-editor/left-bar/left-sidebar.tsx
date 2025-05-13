import React from 'react'
import LeftSidebarItem from './left-sidebar-item'
import { useAtomValue } from 'jotai'
import { mapAtom } from '@/lib/jotai'
// Temp const var to populate

export default function LeftSidebar() {
  const map = useAtomValue(mapAtom)

  if (!map.geojson) return <div>GeoJSON not found</div>

  return (
    <div className="h-full max-h-[calc(100vh-74px)] w-full overflow-y-auto bg-zinc-900 pt-8">
      {/* Feature List */}
      <div className="w-full h-full">
        <ul className="flex flex-col h-full w-full">
          {map.geojson?.features?.map((feature) => (
            <LeftSidebarItem
              key={feature?.id.toString()}
              properties={feature?.properties || {}}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
