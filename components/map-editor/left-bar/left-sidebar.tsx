import React from 'react'
import LeftSidebarItem from './left-sidebar-item'
import { useAtomValue } from 'jotai'
import { mapAtom } from '@/lib/jotai'
// Temp const var to populate

export default function LeftSidebar({ isOwner }: { isOwner?: boolean }) {
  const map = useAtomValue(mapAtom)

  if (!map.geojson) return <div>GeoJSON not found</div>

  return (
    <div className="h-full max-h-[calc(100vh-74px)] w-full overflow-y-auto pt-8">
      {/* Feature List */}
      <div className="h-full w-full">
        <ul className="flex h-full w-full flex-col">
          {map.geojson?.features?.map((feature) => (
            <LeftSidebarItem
              isOwner={isOwner}
              key={feature?.id.toString()}
              properties={feature?.properties || {}}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
