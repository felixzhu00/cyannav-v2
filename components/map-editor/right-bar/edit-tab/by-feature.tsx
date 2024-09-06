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

export default function ByFeature({
  localItems,
}: {
  localItems: { [key: string]: any }
}) {
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  return (
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
  )
}
