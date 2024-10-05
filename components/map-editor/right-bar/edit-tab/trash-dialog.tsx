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
import { currLayerAtom, mapAtom, setMapFieldAtom } from '@/lib/jotai'
import {
  // decodeGeo,
  editFeatureSelf,
  editGeoShared,
  encodeGeo,
} from '@/lib/utils'
import { useAtomValue, useSetAtom } from 'jotai'
import { Trash } from 'lucide-react'

export default function TrashDialog({
  variableName,
  collapsibleName,
}: {
  variableName: string
  collapsibleName: string
}) {
  const map = useAtomValue(mapAtom)
  const featureId = useAtomValue(currLayerAtom)
  const setMapField = useSetAtom(setMapFieldAtom)

  const handleDeleteVariable = async () => {
    // init newGeo with a not null value
    let newGeo = map.geojson

    if (collapsibleName === 'Local') {
      newGeo = editFeatureSelf(
        map.geojson,
        featureId,
        variableName,
        '',
        'remove'
      )
    } else if (collapsibleName === 'Global') {
      newGeo = editGeoShared(map.geojson, variableName, '', 'remove')
    }

    // Optimistic Update
    setMapField({ field: 'geojson', value: newGeo })

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
        // setMapField({ field: 'geojson', value: decodedGeo })
      }
    } catch (error) {
      // Reverse Optimistic if Error
      setMapField({ field: 'geojson', value: map.geojson })

      toast({
        description: 'An error occurred while updating the geojson',
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-2">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Variable</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-bold text-gray-100">{variableName}</span> from{' '}
            <span className="font-bold text-gray-100">{collapsibleName} </span>
            Variable
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
    </Dialog>
  )
}
