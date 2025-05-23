import React from 'react'
import { Card } from '../../ui/card'
import { Plus } from 'lucide-react'
import CardComponent from './card'
import { MapFields } from '@/core/_entities/types/map.types'

interface CardGridProps {
  showAddNewMap?: boolean
  mapList: MapFields[]
}

export default function CardGrid({
  showAddNewMap = true,
  mapList,
}: CardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {showAddNewMap && (
        <Card className="h-80 w-full rounded-lg bg-pf shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg p-6">
            <Plus className="h-12 w-12 text-zinc-600 transition-colors duration-300 hover:text-zinc-800" />
            <h3 className="text-center text-xl font-semibold text-zinc-600 transition-colors duration-300 hover:text-zinc-800">
              Add New Map
            </h3>
          </div>
        </Card>
      )}

      {/* Grid of map cards */}
      {mapList.map((_, index) => (
        <CardComponent key={index} index={index} mapMeta={mapList[index]} />
      ))}
    </div>
  )
}
