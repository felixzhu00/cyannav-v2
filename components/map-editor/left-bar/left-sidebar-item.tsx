import React from 'react'
import { Eye, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  currLayerAtom,
  currSelectedModeAtom,
  mapAtom,
  mapDrawAtom,
  mapLibreAtom,
  mapSourceAtom,
  setCurrLayerSelectAtom,
  setMapFieldAtom,
  setToggleFeatureStateAtom,
  updateMapByNewFeatureAtom,
} from '@/lib/jotai'
import { cn, decodeGeo, editFeatureSelf, encodeGeo } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import { unrenderFeatureLayer } from '@/lib/maplibre-actions/map-render-layers'
import {
  handleAddToDraw,
  handleSelectionChange,
} from '@/lib/maplibre-actions/map-apply-handler'

type LeftSidebarItemProps = {
  properties: { [key: string]: any }
}

export default function LeftSidebarItem({ properties }: LeftSidebarItemProps) {
  // Jotai Global State
  const currLayer = useAtomValue(currLayerAtom)
  const map = useAtomValue(mapAtom)
  const mapRef = useAtomValue(mapLibreAtom)
  const drawRef = useAtomValue(mapDrawAtom)

  const setMapField = useSetAtom(setMapFieldAtom)
  const setCurrLayerStyle = useSetAtom(currLayerAtom)
  const setToggleFeatureState = useSetAtom(setToggleFeatureStateAtom)
  const setCurrSelectedMode = useSetAtom(currSelectedModeAtom)
  const updateMapByNewFeature = useSetAtom(updateMapByNewFeatureAtom)

  // Render Data
  const { id } = properties
  const name = properties.render?.name.payload || ''
  const visible = properties.render?.visible.payload
  const lock = properties.render?.lock.payload
  const draw = properties.render?.draw.payload

  const handleLayerChange = async () => {
    if (currLayer !== id) {
      // Change Tool Bar selected option
      setCurrSelectedMode({
        menuColIndex: 0,
        menuItemIndex: 0,
      })
      // Change Edit bar to current layer
      setCurrLayerStyle(id)

      // Return if MapLibre/Draw has not loaded yet
      if (!mapRef || !drawRef) return

      // If you have a layer selected, changing layer will run this
      // if (drawRef.getAll().features.length > 0) {
      //   // Manually trigger handleSelectionChange as if unselect happened

      // }

      if (drawRef.getAll().features.length > 0) {
        // Unselect previous features programmatically
        drawRef.changeMode('simple_select', {
          featureIds: [],
        })

        if (!mapRef) return
        // Manually trigger handleSelectionChange as if unselect happened
        handleSelectionChange(
          { features: [] }, // Simulate empty selected features
          mapRef,
          drawRef,
          setCurrLayerStyle
        )
      }
      // Add current ID layer to Draw
      setTimeout(() => {
        handleAddToDraw(undefined, mapRef, drawRef, id)
      }, 0)
    } else {
      // remove current Edit bar layer
      setCurrLayerStyle('')
      // Remove the layer from draw and render to maplibre, update feature source if needed
      // If you have a layer selected, changing layer will run this
      if (drawRef.getAll().features.length > 0) {
        // Unselect previous features programmatically
        drawRef.changeMode('simple_select', {
          featureIds: [],
        })

        if (!mapRef) return
        // Manually trigger handleSelectionChange as if unselect happened
        handleSelectionChange(
          { features: [] }, // Simulate empty selected features
          mapRef,
          drawRef,
          setCurrLayerStyle,
          updateMapByNewFeature
        )
      }
    }
  }

  // console.log("renderadas")
  const handleToggleProperty = async (property: string) => {
    // init newGeo with a not null value
    // console.log("asdasd",properties[property] === undefined)
    const changeValue =
      properties.render[property].payload === undefined
        ? false
        : !properties.render[property].payload

    // console.log(changeValue)
    const newGeo = editFeatureSelf(
      map.geojson,
      id,
      property,
      {
        ...properties.render?.visible,
        payload: changeValue,
      },
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
        setToggleFeatureState(id, property, changeValue, draw)
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
            className={cn('h-4 w-4', lock === false ? 'text-gray-500' : '')}
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
            className={cn('h-4 w-4', visible === false ? 'text-gray-500' : '')}
          />
        </Button>
      </div>
    </div>
  )
}
