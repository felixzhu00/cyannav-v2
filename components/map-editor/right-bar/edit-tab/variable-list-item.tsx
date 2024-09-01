import { decodeGeo, editFeatureSelf, encodeGeo } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { useSetAtom } from 'jotai'
import { setMapFieldAtom } from '@/lib/jotai'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import TrashDialog from './trash-dialog'
import { useEffect, useState } from 'react'
import useDebounce from '@/lib/hooks/useDebounce'
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'

export default function VariableListItem({
  variablekey,
  value,
  listName,
  mapGeo,
  mapId,
  currLayerId,
}: {
  variablekey: string
  value: any
  listName: string
  mapGeo: CustomFeatureCollection
  mapId: string
  currLayerId: string
}) {
  const setMapField = useSetAtom(setMapFieldAtom)

  const [inputValue, setInputValue] = useState(value)
  // delay PUT request
  const debouncedInputValue = useDebounce(inputValue)

  useEffect(() => {
    const updateVariable = async () => {
      const newGeo = editFeatureSelf(
        mapGeo,
        currLayerId,
        variablekey,
        debouncedInputValue,
        'addOrUpdate'
      )
      // Encode geoJSON
      const encodedGeoJSON = encodeGeo(newGeo)

      // Call Put API
      try {
        const response = await fetch(`/api/map/${mapId}`, {
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
          setMapField({ field: 'geojson', value: decodedGeo }) // Might hinder user experience
        }
      } catch (error) {
        toast({
          description: 'An error occurred while updating the geojson',
        })
      }
    }

    if (value !== inputValue) {
      updateVariable()
    }
  }, [debouncedInputValue])

  return (
    <div className="flex w-full flex-col items-start gap-1.5 pt-2">
      <Label className="px-1" htmlFor={variablekey}>
        {variablekey}
      </Label>
      <div className="flex w-full flex-row items-center">
        <Input
          type={variablekey}
          id={variablekey}
          placeholder={variablekey}
          className="flex-1"
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          value={inputValue}
        />
        <TrashDialog variableName={variablekey} collapsibleName={listName} />
      </div>
    </div>
  )
}
