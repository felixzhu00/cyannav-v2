import React from 'react'
import { Eye, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  currLayerAtom,
  mapAtom,
  setCurrLayerSelectAtom,
  setMapFieldAtom,
  setToggleFeatureStateAtom,
} from '@/lib/jotai'
import { cn, decodeGeo, editFeatureSelf, encodeGeo } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

type LeftSidebarItemProps = {
  name: string
  id: string
  properties: { [key: string]: any }
}

export default function LeftSidebarItem({
  name,
  id,
  properties,
}: LeftSidebarItemProps) {
  const currLayer = useAtomValue(currLayerAtom)
  const map = useAtomValue(mapAtom)
  const setMapField = useSetAtom(setMapFieldAtom)

  const setCurrLayerStyle = useSetAtom(setCurrLayerSelectAtom)
  const setToggleFeatureState = useSetAtom(setToggleFeatureStateAtom)

  // console.log("rerender", properties)

  const handleLayerChange = () => {
    if (currLayer !== id) {
      setCurrLayerStyle(id)
    } else {
      setCurrLayerStyle('')
    }
  }

  const handleToggleProperty = async (property: string) => {
    // init newGeo with a not null value
    // console.log("asdasd",properties[property] === undefined)
    const changeValue =
      properties[property] === undefined ? false : !properties[property]

    // console.log(changeValue)
    const newGeo = editFeatureSelf(
      map.geojson,
      id,
      property,
      changeValue,
      'addOrUpdate'
    )

    // Optimisic update
    // setMapField({ field: 'geojson', value: newGeo })

    // Encode geoJSON
    const encodedGeoJSON = encodeGeo(newGeo)

    // Call Put API
    try {
      const response = await fetch(`/api/map/${map._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ geojson: encodedGeoJSON }),
      })

      const result = await response.json()

      toast({
        description: result.message,
      })

      if (response.ok) {
        const decodedGeo = decodeGeo(result.payload.geojson)

        setMapField({ field: 'geojson', value: decodedGeo }) // Update the global title state
        setToggleFeatureState(id, property, changeValue)
      }
    } catch (error) {
      toast({
        description: 'An error occurred while updating the geojson',
      })
    }
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between rounded-md border border-transparent px-2 py-0.5 hover:border-blue-500',
        currLayer === id && 'border-white-500'
      )}
      onClick={handleLayerChange}
    >
      <span className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-white">
        {name}
      </span>
      <div className="flex">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            handleToggleProperty('lock')
          }}
        >
          <Lock
            className={cn(
              'h-4 w-4',
              properties.lock === false ? 'text-gray-500' : ''
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            handleToggleProperty('visible')
          }}
        >
          <Eye
            className={cn(
              'h-4 w-4',
              properties.visible === false ? 'text-gray-500' : ''
            )}
          />
        </Button>
      </div>
    </div>
  )
}
