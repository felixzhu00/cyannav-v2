import { ChevronDown, CirclePlus, List } from 'lucide-react'
import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '../../ui/button'

export default function Variablebar() {
  return (
    <div className="flex justify-between px-4 py-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className="flex flex-row items-center space-x-1 px-2"
          >
            <CirclePlus className="h-5 w-5" />

            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="flex w-auto flex-col items-start"
        >
          <Button variant="ghost" className="w-full">
            <span className="w-full text-left">
              Add Local Variable(for selected)
            </span>
          </Button>
          <Button variant="ghost" className="w-full text-left">
            <span className="w-full text-left">
              Add Local Variable(for all)
            </span>
          </Button>
          <Button variant="ghost" className="w-full text-left">
            <span className="w-full text-left">Add Global Variable</span>
          </Button>
        </PopoverContent>
      </Popover>
      <Button
        variant="secondary"
        className="flex flex-row items-center space-x-2 px-3"
      >
        <List className="h-5 w-5" />
      </Button>
    </div>
  )
}
// TODO
// how does deleting work on (for all) variables
// add some indication for (selected) vs (all)
// multi select implemention
