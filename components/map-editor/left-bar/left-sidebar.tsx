import React from 'react'
import LeftSidebarItem from './left-sidebar-item'
import { useAtom } from 'jotai'
import { mapAtom } from '@/lib/jotai'
// Temp const var to populate

export default function LeftSidebar() {
  const [map] = useAtom(mapAtom)

  if (!map.geojson) return <div>GeoJSON not found</div>

  const filterName = map.geojson?.features.map((feature) => [
    feature.properties?._self.name.payload,
    feature.properties?._id,
    feature?.properties,
  ])

  return (
    <div className="h-full max-h-[calc(100vh-74px)] w-full overflow-y-auto bg-zinc-900 pt-8">
      {/* Feature List */}
      <div className="w-full">
        <ul className="w-full">
          {filterName?.map((tuple) => (
            <LeftSidebarItem
              key={tuple[0] + tuple[1]}
              name={tuple[0]}
              id={tuple[1]}
              properties={tuple[2]}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
