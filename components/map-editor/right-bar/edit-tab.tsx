import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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

import { currLayerAtom, mapAtom } from '@/atoms/jotai'

import CollapsibleVariables from './collapsible-variables'
import Variablebar from './variablebar'
import { useAtom } from 'jotai'
import { CustomFeatureCollection, CustomFeature } from '@/lib/types'

const findFeatureById = (
  id: string | null,
  mapGeojson: CustomFeatureCollection
) => {
  if (!id || !mapGeojson || !mapGeojson.features) return null

  return (
    mapGeojson.features.find((feature: CustomFeature) => feature.id === id) ||
    null
  )
}

function VariableList({
  list,
  listName,
}: {
  list: Map<string, string | number> | undefined
  listName: string
}) {
  if (!list) return <span>_self/_share not found</span> // If list is undefined, return null

  return (
    <div>
      {list.size === 0 && (
        <div className="mr-5 text-center text-sm text-gray-500">
          Start by Adding a {listName} Variable
        </div>
      )}
      {list.size > 0 &&
        Array.from(list).map(([key, value], index) => (
          <div
            key={key.toString().concat(index.toString())}
            className="w-full flex-col items-center space-y-1"
          >
            <label className="px-1" htmlFor={key}>
              {value}
            </label>
            <input type={key} id={key} placeholder={key} />
          </div>
        ))}
    </div>
  )
}

export default function EditTab() {
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')

  const [currLayer, setCurrLayer] = useAtom(currLayerAtom)

  const [map, setMapAtom] = useAtom(mapAtom)

  // Function to find the feature with the matching ID

  const selectedFeature = findFeatureById(
    currLayer,
    map.geojson as CustomFeatureCollection
  )

  const localItems = selectedFeature?._self
  const gobalItems = (map.geojson as CustomFeatureCollection)._shared

  if (!selectedFeature) return <div>Select A Layer</div>
  return (
    <div className="space-y-3">
      <Variablebar />
      {/* TODO add animation to Collapsible */}

      {/* Collapsible for _Self/Local */}
      <CollapsibleVariables header="Local Variables">
        <VariableList list={localItems} listName="Local" />
      </CollapsibleVariables>

      {/* Collapsible for _Share/Global */}
      <CollapsibleVariables header="Global Variables">
        <VariableList list={gobalItems} listName="Global" />
        {/* By Feature Selection */}
        <div className="w-full flex-col items-center gap-1.5 pt-4">
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
            <PopoverContent className="p-0">
              <Command>
                {/* <CommandInput placeholder="Search item..." /> */}
                <CommandList>
                  <CommandEmpty>No item found.</CommandEmpty>
                  <CommandGroup>
                    {localItems &&
                      Array.from(localItems).map(([key]) => (
                        <CommandItem
                          className="w-full"
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
