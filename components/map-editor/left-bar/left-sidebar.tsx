
import React from 'react'
import geojsondata from '@/public/america.geo.json'
import LeftSidebarItem from './left-sidebar-item'

// Temp const var to populate
const parsedGeo = {
  ...geojsondata,
  features: geojsondata.features.map((feature) => ({
    ...feature,
    properties: { name: feature.properties?.name },
  })),
}

const filterName = parsedGeo.features.map((feature) => feature.properties?.name)

export default function LeftSidebar() {
  return (
    <div className="max-h-[calc(100vh-74px)] w-full h-full overflow-y-auto bg-zinc-900 pt-8">
      {/* Feature List */}
      <div className="w-full">
        <ul className="w-full">
          {filterName.map((name, index) => (
            <LeftSidebarItem key={name.concat(index.toString())} name={name} />
          ))}
        </ul>
      </div>
    </div>
  )
}
