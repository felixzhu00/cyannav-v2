import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/components/ui/use-toast'

import { currLayerAtom, mapAtom, setMapFieldAtom } from '@/lib/jotai'
import {
  decodeGeo,
  editAllFeatureSelf,
  editFeatureSelf,
  editGeoShared,
  encodeGeo,
} from '@/lib/utils'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import NumberInput from '@/components/ui/number-input'

export default function VariableDialog({
  type,
  onClose,
}: {
  type: string
  onClose: () => void
}) {
  // Initialize state for the selected radio option
  const [selectedValue, setSelectedValue] = useState('selected')
  const [variableName, setVariableName] = useState('')
  const [variableValue, setVariableValue] = useState<string | number>('')
  const [variableType, setVariableType] = useState('string')

  const setMapField = useSetAtom(setMapFieldAtom)
  const featureId = useAtomValue(currLayerAtom)

  const map = useAtomValue(mapAtom)

  console.log(selectedValue, variableName, variableType, variableValue)
  // Handle changes in input fields
  const handleVariableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariableName(e.target.value)
  }

  const handleVariableValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVariableValue(e.target.value)
  }

  // Handle Submit(Save)
  const handleSave = async () => {
    // Close Dialog
    onClose()

    // Check for Empty Values (backend should check) (frontend z warning) (consider form rather than states)
    if (variableName === '' || variableValue === '') {
      // display toast
    }

    // init newGeo with a not null value
    let newGeo = map.geojson

    // branch base on cases of which add(TODO can user be able to update through add menu)
    if (type === 'local') {
      if (selectedValue === 'selected') {
        newGeo = editFeatureSelf(
          map.geojson,
          featureId,
          variableName,
          { payload: variableValue, variableType },
          'addOrUpdate'
        )
      } else {
        newGeo = editAllFeatureSelf(
          map.geojson,
          variableName,
          { payload: variableValue, variableType },
          'addOrUpdate'
        )
      }
    } else if (type === 'global') {
      // Adding a Global State
      newGeo = editGeoShared(
        map.geojson,
        variableName,
        { payload: variableValue, variableType },
        'addOrUpdate'
      )
    }
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
      }
    } catch (error) {
      toast({
        description: 'An error occurred while updating the geojson',
      })
    }
  }

  const cap = type.charAt(0).toUpperCase() + type.slice(1)
  return (
    <Dialog open={!!type} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {cap} Variable</DialogTitle>
          <DialogDescription>
            Add a new {type} variable to this layer. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        {type === 'local' && (
          <RadioGroup
            defaultValue="selected"
            className="flex justify-center space-x-4 py-4 pb-2"
            value={selectedValue}
            onValueChange={setSelectedValue}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selected" id="r1" />
              <Label htmlFor="r1">For Currently Selected Layer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="r2" />
              <Label htmlFor="r2">For All Layer</Label>
            </div>
          </RadioGroup>
        )}

        <RadioGroup
          defaultValue="string"
          className="flex justify-center space-x-4 py-4 pb-2"
          value={variableType}
          onValueChange={setVariableType}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="string" id="r1" />
            <Label htmlFor="r1">String</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="color" id="r2" />
            <Label htmlFor="r2">Color</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="boolean" id="r2" />
            <Label htmlFor="r2">Boolean</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="number" id="r2" />
            <Label htmlFor="r2">Number</Label>
          </div>
        </RadioGroup>

        <div className="grid gap-4 py-4">
          <div className="items-left flex flex-col gap-4">
            <Label htmlFor="name" className="pl-2 font-semibold">
              Variable Name
            </Label>
            <Input
              id="name"
              placeholder="Est. Population"
              className="text-sm"
              value={variableName}
              onChange={handleVariableNameChange}
            />
          </div>
          <div className="items-left flex flex-col gap-4">
            <Label htmlFor="username" className="pl-2 font-semibold">
              Variable Value
            </Label>
            {variableType === 'string' && (
              <Input
                id="value"
                placeholder="123456789"
                className="text-sm"
                value={variableValue}
                onChange={handleVariableValueChange}
              />
            )}

            {variableType === 'color' && (
              <div className="flex flex-row">
                <Input
                  id="value"
                  placeholder="#FFFFFF"
                  className="text-sm"
                  value={variableValue}
                  onChange={handleVariableValueChange}
                />
                <ColorPicker
                  className="aspect-square"
                  value={variableValue.toString() || ''}
                  onChange={setVariableValue}
                />
              </div>
            )}

            {variableType === 'boolean' && (
              <div className="flex flex-row">
                <Select
                  value={variableValue.toString() || ''}
                  onValueChange={setVariableValue}
                >
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
              </div>
            )}

            {variableType === 'number' && (
              <div className="flex flex-row">
                <Input
                  type="number"
                  id="value"
                  placeholder="111111"
                  className="text-sm"
                  value={variableValue}
                  onChange={handleVariableValueChange}
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
