import { decodeGeo, editMapGeo, isValidHex } from '@/lib/utils'
import { useAtomValue, useSetAtom } from 'jotai'
import { mapLibreAtom, setMapFieldAtom } from '@/lib/jotai'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import TrashDialog from './trash-dialog'
import { useEffect, useRef, useState } from 'react'
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
import { editLayerStyleGlobal } from '@/lib/map-render'
import usePrevious from '@/lib/hooks/usePrevious'

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
  byFeature = '',
}: {
  varKey: string
  varValue: { [key: string]: any }
  listName: string
  mapGeo: CustomFeatureCollection
  mapId: string
  currLayerId: string
  varType: 'string' | 'number' | 'color' | 'select'
  hasTrash: boolean
  selectOptions?: string[]
  byFeature?: string
}) {
  const setMapField = useSetAtom(setMapFieldAtom)
  const mapLibre = useAtomValue(mapLibreAtom)

  const [inputValue, setInputValue] = useState<string>(
    varValue.payload.toString()
  )
  const transientName = useRef('')

  const updateVariable = async (payload: string) => {
    const result = await editMapGeo(
      mapGeo,
      mapId,
      currLayerId,
      varKey,
      { ...varValue, payload },
      'addOrUpdate',
      listName === 'Local' ? 'editFeatureSelf' : 'editGeoSharedNested'
    )

    if (result.payload) {
      const decodedGeo = decodeGeo(result.payload.geojson)
      setMapField({ field: 'geojson', value: decodedGeo })
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (listName === 'Global') {
      if (
        varType === 'color' ? value.length === 7 && isValidHex(value) : true
      ) {
        editLayerStyleGlobal(
          mapLibre,
          {
            ...varValue,
            payload: varType === 'number' ? parseFloat(value) : value,
          },
          byFeature
        )
      }
    }
  }

  const handleBlur = () => {
    console.log('trigger', transientName.current, inputValue)
    // This will only trigger if they blur AND the name has changed
    if (transientName.current !== inputValue) {
      // Update the transient name value
      transientName.current = inputValue

      console.log('asdasd')
      // Do other on blur analytics stuff
      let validValue =
        varType === 'number' ? parseFloat(inputValue) : inputValue

      if (Number.isNaN(validValue)) {
        validValue = varValue.payload
      }

      if (varType === 'number') {
        validValue = Math.max(
          varValue.range[0],
          Math.min(varValue.range[1], Number(validValue))
        )
      }

      if (varType === 'color' && inputValue.length !== 7) {
        validValue = varValue.payload
      }

      if (validValue !== inputValue) {
        handleInputChange(validValue.toString())
      }
      updateVariable(validValue.toString())
    }
  }

  const renderInput = () => {
    if (varType === 'string') {
      return (
        <Input
          type="text"
          id={varKey}
          placeholder={varKey}
          className="flex-1"
          onChange={(e) => handleInputChange(e.target.value)}
          value={inputValue}
          onBlur={handleBlur} // Blur handling
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
          step="0.01"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleBlur} // Blur handling
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
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur} // Blur handling
          />
          <ColorPicker
            className="aspect-square"
            value={inputValue}
            onChange={handleInputChange}
            setIsBlurred={handleBlur}
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
    return <div>Invalid variableType {varValue.payload}</div>
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
