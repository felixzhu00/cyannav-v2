import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import {
  attachedHandlersAtom,
  currLayerAtom,
  mapAtom,
  mapLibreAtom,
  setMapFieldAtom,
} from '@/lib/jotai'
import { unrenderFeatureLayer } from '@/lib/maplibre-actions/map-render-layers'
import {
  decodeGeo,
  editFeatureSelf,
  editGeoShared,
  encodeGeo,
} from '@/lib/utils'
import { useAtomValue, useSetAtom } from 'jotai'
import { Minus } from 'lucide-react'

export default function DeleteItemDialog({
  featureName,
  featureId,
  hasTrash,
}: {
  featureId: string
  featureName: string
  hasTrash: boolean
}) {
  const map = useAtomValue(mapAtom)
  const mapRef = useAtomValue(mapLibreAtom)
  const handlerRef = useAtomValue(attachedHandlersAtom)
  const setMapField = useSetAtom(setMapFieldAtom)

  const handleDeleteVariable = async () => {
    // init newGeo with a not null value
    const newGeo = map.geojson

    const filteredFeatures = newGeo.features.filter(
      (feature) => feature.id !== featureId
    )

    const filteredGeoJSON = {
      ...newGeo,
      features: filteredFeatures,
    }

    // Encode geoJSON
    const encodedGeoJSON = encodeGeo(filteredGeoJSON)

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

        // Remove from MapLibre
        if (!mapRef) return
        unrenderFeatureLayer(mapRef, featureId, handlerRef)
      }
    } catch (error) {
      toast({
        description: 'An error occurred while updating the geojson',
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild disabled={!hasTrash}>
        <Button
          variant="ghost"
          className={`px-3 ${!hasTrash ? 'cursor-not-allowed' : ''}`} // Add a not-allowed cursor when disabled
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Minus
            className={`h-4 w-4 ${hasTrash ? 'text-red-500' : 'text-gray-300'}`}
          />
        </Button>
      </DialogTrigger>
      {hasTrash && (
        <DialogContent
          className="sm:max-w-[425px]"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <DialogHeader>
            <DialogTitle>Delete Layer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-bold text-gray-100">{featureName}</span>{' '}
              from <span className="font-bold text-gray-100">Map</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              onClick={handleDeleteVariable}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
