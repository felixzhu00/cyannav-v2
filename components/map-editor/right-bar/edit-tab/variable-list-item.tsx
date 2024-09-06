import { decodeGeo, editMapGeo } from '@/lib/utils'
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
  varKey,
  varValue,
  listName,
  mapGeo,
  mapId,
  currLayerId,
  varType,
  hasTrash,
  selectOptions = [],
}: {
  varKey: string
  varValue: any
  listName: string
  mapGeo: CustomFeatureCollection
  mapId: string
  currLayerId: string
  varType: 'string' | 'number' | 'color' | 'select'
  hasTrash: boolean
  selectOptions?: string[]
}) {
  const setMapField = useSetAtom(setMapFieldAtom)
  // TODO check if isValid boolean and color
  const [inputValue, setInputValue] = useState(varValue)
  // delay PUT request
  const debouncedInputValue = useDebounce(inputValue)

  const updateVariable = async () => {
    const result = await editMapGeo(
      mapGeo,
      mapId,
      currLayerId,
      varKey,
      { payload: debouncedInputValue, variableType: varType },
      'addOrUpdate',
      listName === 'Local' ? 'editFeatureSelf' : 'editGeoSharedNested'
    )

    if (result.payload) {
      const decodedGeo = decodeGeo(result.payload.geojson)
      setMapField({ field: 'geojson', value: decodedGeo }) // Might hinder user experience
    }
  }

  const handleOnBlurColor = () => {
    if (inputValue.length !== 7) {
      setInputValue(varValue)
    } else {
      updateVariable()
    }
  }

  useEffect(() => {
    if (varValue !== inputValue) {
      if (varType !== 'color') {
        updateVariable()
      }
    }
  }, [debouncedInputValue])

  const renderInput = () => {
    if (varType === 'string') {
      return (
        <Input
          type="text" // Adjusted to "text" since inputType is "string"
          id={varKey}
          placeholder={varKey}
          className="flex-1"
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          value={inputValue}
        />
      )
    }
    if (varType === 'number') {
      return (
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
      )
    }
    if (varType === 'color') {
      return (
        <>
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
        </>
      )
    }
    if (varType === 'select' && selectOptions) {
      return (
        <Select value={inputValue} onValueChange={setInputValue}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {selectOptions.map((option, index) => (
                <SelectItem key={option + index.toString()} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    }
    return <div>Invalid variableType{varValue}</div>
  }

  return (
    <div className="flex w-full flex-col items-start gap-1.5 pt-2">
      <Label className="px-1" htmlFor={varKey}>
        {varKey}
      </Label>
      <div className="flex w-full flex-row items-center">
        {renderInput()}
        {hasTrash && (
          <TrashDialog variableName={varKey} collapsibleName={listName} />
        )}
      </div>
    </div>
  )
}
