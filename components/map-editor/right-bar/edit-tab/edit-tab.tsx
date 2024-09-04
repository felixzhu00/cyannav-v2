import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { ChevronsUpDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  //   CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import CollapsibleVariables from './collapsible-variables'
import Variablebar from './variable-toolbar'
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'

import { useAtom } from 'jotai'
import { currLayerAtom, mapAtom } from '@/lib/jotai'
import VariableList from './variable-list'

const findFeatureById = (
  id: string | null,
  mapGeojson: CustomFeatureCollection
) => {
  if (!id || !mapGeojson || !mapGeojson.features) return null

  return (
    mapGeojson.features.find((feature) => feature?.properties?._id === id) ||
    null
  )
}

export default function EditTab() {
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')

  const [currLayer] = useAtom(currLayerAtom)

  const [map] = useAtom(mapAtom)

  // Function to find the feature with the matching ID

  const selectedFeature = findFeatureById(currLayer, map.geojson)

  const localItems = selectedFeature?.properties?._self
  const gobalItems = (map.geojson as CustomFeatureCollection)._shared

  if (!selectedFeature)
    return (
      <div className="mt-5 text-center text-sm text-gray-500">
        Select A Layer From The Left To Edit
      </div>
    )
  return (
    <div className="space-y-3">
      <Variablebar />
      {/* TODO add animation to Collapsible */}

      {/* Collapsible for _Self/Local */}
      <CollapsibleVariables header="Local Variables">
        <VariableList
          list={localItems}
          currLayerId={currLayer}
          mapId={map._id}
          mapGeo={map.geojson}
          listName="Local"
        />
      </CollapsibleVariables>

      {/* Collapsible for _Share/Global */}
      <CollapsibleVariables header="Global Variables">
        <VariableList
          list={gobalItems}
          currLayerId={currLayer}
          mapId={map._id}
          mapGeo={map.geojson}
          listName="Global"
        />
        {/* By Feature Selection */}
        <div className="w-full flex-col items-center gap-1.5 pt-2">
          {/* Sub Header */}
          <Label className="px-1">By Feature</Label>
          {/* Dropdown with integrated search feature */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex w-full items-center justify-between"
              >
                {selectedItem || 'Select an item...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 text-left" align="center">
              <Command>
                {/* <CommandInput placeholder="Search item..." /> */}
                <CommandList>
                  <CommandEmpty>No item found.</CommandEmpty>
                  <CommandGroup className="p-0">
                    {localItems &&
                      Object.entries(localItems).map(([key]) => (
                        <CommandItem
                          className="text-left"
                          key={key}
                          value={key}
                          onSelect={(currentValue) => {
                            setSelectedItem(currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedItem === key ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          {key}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CollapsibleVariables>
    </div>
  )
}
