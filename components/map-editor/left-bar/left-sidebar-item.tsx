import { Eye, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  currLayerAtom,
  currSelectedModeAtom,
  mapAtom,
  mapDrawAtom,
  setMapFieldAtom,
  setSelectedLayerStyleAtom,
  setToggleFeatureStateAtom,
} from '@/lib/jotai'
import {
  cn,
  // decodeGeo,
  editFeatureSelf,
  encodeGeo,
} from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import DeleteItemDialog from './delete-item-dialog'

type LeftSidebarItemProps = {
  properties: { [key: string]: any }
  isOwner?: Boolean
}

export default function LeftSidebarItem({
  properties,
  isOwner,
}: LeftSidebarItemProps) {
  // React State

  // Jotai Global State
  const currLayer = useAtomValue(currLayerAtom)
  const map = useAtomValue(mapAtom)
  const drawRef = useAtomValue(mapDrawAtom)

  const setMapField = useSetAtom(setMapFieldAtom)
  const setCurrLayerStyle = useSetAtom(setSelectedLayerStyleAtom)
  const setToggleFeatureState = useSetAtom(setToggleFeatureStateAtom)
  const setCurrSelectedMode = useSetAtom(currSelectedModeAtom)

  // Render Data
  const { id } = properties
  const name = properties.render?.name.payload || ''
  const visible = properties.render?.visible.payload
  const lock = properties.render?.lock.payload
  const draw = properties.render?.draw.payload

  // Trash Icon
  const hasTrash = properties.render?.trash?.payload || false

  const handleLayerChange = async () => {
    if (currLayer !== id) {
      // Change Tool Bar selected option
      setCurrSelectedMode({
        menuColIndex: 0,
        menuItemIndex: 0,
      })
      if (drawRef.getMode() !== 'select') {
        drawRef.changeMode('select')
      }

      // Change Edit bar to current layer
      setCurrLayerStyle(id)
    } else {
      // remove current Edit bar layer
      setCurrLayerStyle('')
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
    setMapField({ field: 'geojson', value: newGeo })
    setToggleFeatureState(id, property, changeValue, draw)

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

      // const result = await response.json()

      // toast({
      //   description: result.message,
      // })

      if (response.ok) {
        // const decodedGeo = decodeGeo(result.payload.geojson)
        // // setMapField({ field: 'geojson', value: decodedGeo }) // Update the global title state
        // setToggleFeatureState(id, property, changeValue, draw)
      }
    } catch (error) {
      // Reverse Optimistic if Error
      setMapField({ field: 'geojson', value: map.geojson })
      setToggleFeatureState(id, property, changeValue, draw)

      toast({
        description: 'An error occurred while updating the geojson',
      })
    }
  }

  return (
    <div className="flex max-w-full flex-row items-center">
      <DeleteItemDialog
        featureName={name}
        featureId={id}
        hasTrash={hasTrash}
        isOwner={isOwner}
      />
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center justify-between gap-1 rounded-md border border-transparent px-2 py-0.5 hover:border-sidebar-primary',
          currLayer === id && 'border-white-500'
        )}
        onClick={handleLayerChange}
      >
        <span className="ml-2 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {name}
        </span>
        <div className="min-w-0 flex-shrink items-center">
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
              className={cn(
                'h-4 w-4',
                visible === false ? 'text-gray-500' : ''
              )}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
