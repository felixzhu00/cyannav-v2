import { decodeGeo, editFeatureSelf, encodeGeo } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { useAtomValue, useSetAtom } from 'jotai'
import { currLayerAtom, mapAtom, setMapFieldAtom } from '@/lib/jotai'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import TrashDialog from './trash-dialog'
import { useEffect, useState } from 'react'
import useDebounce from '@/lib/hooks/useDebounce'

export default function VariableListItem({
  variablekey,
  value,
  listName,
}: {
  variablekey: string
  value: any
  listName: string
}) {
  const currLayer = useAtomValue(currLayerAtom)
  const map = useAtomValue(mapAtom)
  const setMapField = useSetAtom(setMapFieldAtom)

  const [inputValue, setInputValue] = useState(value)
  const debouncedInputValue = useDebounce(inputValue, 500)

  const handleChangeValue = async () => {
    const newGeo = editFeatureSelf(
      map.geojson,
      currLayer,
      variablekey,
      inputValue,
      'addOrUpdate'
    )

    // Optimisic update
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

      const result = await response.json()

      toast({
        description: result.message || result.error,
      })

      if (response.ok) {
        const decodedGeo = decodeGeo(result.map.geojson)
        console.log(decodedGeo)

        // setMapField({ field: 'geojson', value: decodedGeo }) // Might hinder user experience
      }
    } catch (error) {
      toast({
        description: 'An error occurred while updating the geojson',
      })
    }
  }

  useEffect(() => {
    const updateVariable = async () => {
      if (debouncedInputValue) {
        await handleChangeValue()
        console.log('trigger', debouncedInputValue)
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
