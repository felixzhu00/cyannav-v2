import React from 'react'
import LeftSidebarItem from './left-sidebar-item'
import { FeatureCollection } from 'geojson'
// Temp const var to populate

export default function LeftSidebar({
  geojson,
}: {
  geojson: FeatureCollection | undefined
}) {
  const filterName = geojson?.features.map(
    (feature) => feature.properties?.name
  )

  if (!geojson) return <div>GeoJSON not found</div>

  return (
    <div className="h-full max-h-[calc(100vh-74px)] w-full overflow-y-auto bg-zinc-900 pt-8">
      {/* Feature List */}
      <div className="w-full">
        <ul className="w-full">
          {filterName?.map((name, index) => (
            <LeftSidebarItem key={name.concat(index.toString())} name={name} />
          ))}
        </ul>
      </div>
    </div>
  )
}
