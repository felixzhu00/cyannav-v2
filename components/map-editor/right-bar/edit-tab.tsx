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

import { items } from '@/lib/const'
import CollapsibleVariables from './collapsible-variables'
import Variablebar from './variablebar'

export default function EditTab() {
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  return (
    <div className="space-y-3">
      <Variablebar/>
      {/* TODO add animation to Collapsible */}

      {/* Collapsible for _Self/Local */}
      <CollapsibleVariables header="Local Variables">
        {items.map((item, index) => (
          <div
            key={item.value.concat(index.toString())}
            className="w-full flex-col items-center space-y-1"
          >
            <Label className="px-1" htmlFor={item.label}>
              {item.value}
            </Label>

            <Input
              type={item.label}
              id={item.label}
              placeholder={item.placeholder}
            />
          </div>
        ))}
      </CollapsibleVariables>

      {/* Collapsible for _Share/Global */}
      <CollapsibleVariables header="Global Variables">
        <div className="w-full flex-col items-center gap-1.5">
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
                    {items.map((item) => (
                      <CommandItem
                        className="w-full"
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                          setSelectedItem(currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedItem === item.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                        />
                        {item.label}
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
