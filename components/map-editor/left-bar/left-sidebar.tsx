import React from 'react'
import LeftSidebarItem from './left-sidebar-item'
import { useAtom } from 'jotai'
import { mapAtom } from '@/lib/jotai'
// Temp const var to populate

export default function LeftSidebar() {
  const [map] = useAtom(mapAtom)

  if (!map.geojson) return <div>GeoJSON not found</div>

  return (
    <div className="h-full max-h-[calc(100vh-74px)] w-full overflow-y-auto bg-zinc-900 pt-8">
      {/* Feature List */}
      <div className="w-full">
        <ul className="w-full">
          {map.geojson?.features?.map((feature) => (
            <LeftSidebarItem
              key={feature.properties?.id.toString()}
              name={feature.properties?.name.payload}
              id={feature.properties?.id}
              properties={feature?.properties || {}}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
