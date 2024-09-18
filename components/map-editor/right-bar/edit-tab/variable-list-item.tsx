import {
  decodeGeo,
  editFeatureSelf,
  editMapGeo,
  isValidHex,
  propNameToString,
} from '@/lib/utils'
import { useAtomValue, useSetAtom } from 'jotai'
import { mapLibreAtom, setMapFieldAtom } from '@/lib/jotai'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import TrashDialog from './trash-dialog'
import { useRef, useState } from 'react'
import { CustomFeature, CustomFeatureCollection } from '@/core/_entities/types/map.types'
import { ColorPicker } from '@/components/ui/color-picker'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import {
  editLayerStyle,
  updateSourceById,
} from '@/lib/maplibre-actions/map-utils'
import { Switch } from '@/components/ui/switch'

export default function VariableListItem({
  inputObject,
  listName,
  mapGeo,
  mapId,
  currLayerId,
  hasTrash,
  draw,
  selectOptions = [],
  byFeature = '',
}: {
  inputObject: { [key: string]: any }
  listName: string
  mapGeo: CustomFeatureCollection
  mapId: string
  currLayerId: string
  hasTrash: boolean
  draw: string
  selectOptions?: string[]
  byFeature?: string
}) {
  // TODO add Toast when input not valid onBlur
  // Jotai
  const setMapField = useSetAtom(setMapFieldAtom)
  const mapLibre = useAtomValue(mapLibreAtom)

  // Destructure Logic
  const [[varKey, propValue]] = Object.entries(inputObject)

  const varValue =
    propValue.payload !== undefined
      ? propValue.payload.toString()
      : propValue.toString()
  const varType = propValue.variableType || 'string'
  // React Hooks
  const [inputValue, setInputValue] = useState<string | number | boolean>(
    varValue
  )
  const transientName = useRef<string | number | boolean>('')

  // console.log(inputObject)
  // console.log(varKey, varValue, varType)

  // console.log(mapGeo.features.find((feature) => feature.id === currLayerId))
  // Updates Jotai Atom and Backend
  const updateVariable = async (payload: string | number | boolean) => {
    const result = await editMapGeo(
      mapGeo,
      mapId,
      currLayerId,
      varKey,
      { ...propValue, payload },
      'addOrUpdate',
      listName === 'Local' ? 'editFeatureSelf' : 'editGeoSharedNested'
    )

    if (result.payload) {
      const decodedGeo = decodeGeo(result.payload.geojson)
      setMapField({ field: 'geojson', value: decodedGeo })
      console.log('joati set1')
    }
  }

  // Updates MapLibre ref
  const handleInputChange = (value: string | number | boolean) => {
    setInputValue(value)
    // Ignore maplibre style change if is name
    if (varKey === 'name') return

    // Check if valid color
    if (
      varType === 'color' &&
      ((value as string).length !== 7 || !isValidHex(value as string))
    )
      return

    // Change the style of shape
    editLayerStyle(mapLibre, varKey, value, currLayerId, draw)

    // Get the feature of with currLayerId
    const feature = mapGeo.features.find(
      (feature) => feature.id === currLayerId
    ) as CustomFeature

    // Convert feature into Feature collection
    const newCollection: CustomFeatureCollection = {
      type: 'FeatureCollection',
      features: [feature],
      _shared: { mode: 'none' },
    }
    // Get a updateGeo
    const newGeo = editFeatureSelf(
      newCollection,
      currLayerId,
      varKey,
      { ...propValue, payload: value },
      'addOrUpdate'
    )

    // Update the source of the shape
    updateSourceById(mapLibre, currLayerId, newGeo)
  }

  const handleBlur = () => {
    // This will only trigger if they blur AND the name has changed
    if (transientName.current !== inputValue) {
      // Update the transient name value
      transientName.current = inputValue

      // // Parse if is number
      let validValue = inputValue
      //   varType === 'number' ? parseFloat(inputValue) : inputValue

      // Impute number if invalid
      if (Number.isNaN(validValue)) {
        validValue = propValue.payload
      }

      // Impute number if out of range
      if (varType === 'number') {
        validValue = Math.max(
          propValue?.range[0],
          Math.min(propValue?.range[1], Number(validValue))
        )
      }

      // Impute color if invalid
      if (varType === 'color' && (inputValue as string).length !== 7) {
        validValue = propValue.payload
      }

      // Make the change if input is invalid
      if (validValue !== inputValue) {
        handleInputChange(
          varType === 'number' ? validValue : validValue.toString()
        )
      }

      // Update backend
      updateVariable(validValue)
    }
  }

  const renderInput = () => {
    // the payload type can be 'string' | 'number' | 'color' | 'select'

    if (varType === 'string') {
      return (
        <Input
          type="text"
          id={varKey}
          placeholder={varKey}
          className="flex-1"
          onChange={(e) => handleInputChange(e.target.value)}
          value={inputValue as string}
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
          step={propValue?.step || '1'}
          value={inputValue as number}
          onChange={(e) => handleInputChange(parseFloat(e.target.value))}
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
            value={inputValue as string}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur} // Blur handling
          />
          <ColorPicker
            className="aspect-square"
            value={inputValue as string}
            onChange={handleInputChange}
            setIsBlurred={handleBlur}
          />
        </>
      )
    }
    if (varType === 'select' && selectOptions) {
      return (
        <Select value={inputValue as string} onValueChange={setInputValue}>
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

    if (varType === 'boolean') {
      return (
        <div className="ml-2 flex flex-grow items-center justify-start space-x-2">
          <Label htmlFor="off-mode">Off</Label>
          <Switch
            checked={inputValue as boolean}
            onCheckedChange={handleInputChange}
          />
          <Label htmlFor="on-mode">On</Label>
        </div>
      )
    }
    return <div>Invalid Variable Type {varType}</div>
  }

  return (
    <div className="flex w-full flex-col items-start gap-1.5 pt-2">
      <Label className="px-1" htmlFor={varKey}>
        {propNameToString(varKey)}
      </Label>
      <div className="flex w-full flex-row items-center justify-between">
        {renderInput()}
        {hasTrash && (
          <TrashDialog variableName={varKey} collapsibleName={listName} />
        )}
      </div>
    </div>
  )
}
