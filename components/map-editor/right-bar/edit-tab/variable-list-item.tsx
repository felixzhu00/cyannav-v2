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
import { ColorPicker } from '@/components/ui/color-picker'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'

export default function VariableListItem({
  variablekey,
  value,
  listName,
  mapGeo,
  mapId,
  currLayerId,
  variableType,
}: {
  variablekey: string
  value: any
  listName: string
  mapGeo: CustomFeatureCollection
  mapId: string
  currLayerId: string
  variableType: 'string' | 'number' | 'color' | 'boolean'
}) {
  const setMapField = useSetAtom(setMapFieldAtom)
  // TODO check if isValid boolean and color
  const [inputValue, setInputValue] = useState(value)
  // delay PUT request
  const debouncedInputValue = useDebounce(inputValue)

  const updateVariable = async () => {
    const newGeo = editFeatureSelf(
      mapGeo,
      currLayerId,
      variablekey,
      { payload: debouncedInputValue, variableType },
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

  const handleOnBlurColor = () => {
    if (inputValue.length !== 7) {
      setInputValue(value)
    } else {
      updateVariable()
    }
  }

  useEffect(() => {
    if (value !== inputValue) {
      if (variableType !== 'color') {
        updateVariable()
      }
    }
  }, [debouncedInputValue])

  console.log(variableType)
  return (
    <>
      {variableType === 'string' && (
        <div className="flex w-full flex-col items-start gap-1.5 pt-2">
          <Label className="px-1" htmlFor={variablekey}>
            {variablekey}
          </Label>
          <div className="flex w-full flex-row items-center">
            <Input
              type="text" // Adjusted to "text" since inputType is "string"
              id={variablekey}
              placeholder={variablekey}
              className="flex-1"
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
              value={inputValue}
            />
            <TrashDialog
              variableName={variablekey}
              collapsibleName={listName}
            />
          </div>
        </div>
      )}
      {variableType === 'color' && (
        <div className="flex w-full flex-col items-start justify-between gap-1.5 pt-2">
          <Label className="px-1" htmlFor={variablekey}>
            {variablekey}
          </Label>
          <div className="flex w-full flex-row">
            <Input
              id="value"
              placeholder="#FFFFFF"
              className="text-sm"
              onBlur={handleOnBlurColor}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
            />
            <ColorPicker
              className="aspect-square"
              value={inputValue}
              onChange={setInputValue}
            />
            <TrashDialog
              variableName={variablekey}
              collapsibleName={listName}
            />
          </div>
        </div>
      )}
      {variableType === 'number' && (
        <div className="flex w-full flex-col items-start justify-between gap-1.5 pt-2">
          <Label className="px-1" htmlFor={variablekey}>
            {variablekey}
          </Label>
          <div className="flex w-full flex-row">
            <Input
              type="number"
              id="value"
              placeholder="111111"
              className="text-sm"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
            />
            <TrashDialog
              variableName={variablekey}
              collapsibleName={listName}
            />
          </div>
        </div>
      )}

      {variableType === 'boolean' && (
        <div className="flex w-full flex-col items-start justify-between gap-1.5 pt-2">
          <Label className="px-1" htmlFor={variablekey}>
            {variablekey}
          </Label>
          <div className="flex w-full flex-row">
            <Select value={inputValue} onValueChange={setInputValue}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <TrashDialog
              variableName={variablekey}
              collapsibleName={listName}
            />
          </div>
        </div>
      )}
    </>
  )
}
