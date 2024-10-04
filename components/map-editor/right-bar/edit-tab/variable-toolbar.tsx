import { ChevronDown, CirclePlus } from 'lucide-react'
import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import VariableDialog from './variable-dialog'

export default function VariableToolBar() {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    setPopoverOpen(false) // Close the popover
  }

  const handleDialogClose = () => {
    setSelectedOption(null)
  }

  return (
    <div className="flex justify-between px-4 py-2">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className="flex flex-row items-center space-x-1 px-2"
            onClick={() => setPopoverOpen((prev) => !prev)} // Toggle popover
          >
            <CirclePlus className="h-5 w-5" />
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="flex w-auto flex-col items-start border-2 p-0"
        >
          <Button
            variant="ghost"
            className="w-full rounded-none p-7"
            onClick={() => handleOptionClick('local')}
          >
            Add Local Variable
          </Button>
          <Button
            variant="ghost"
            className="w-full rounded-none p-7"
            onClick={() => handleOptionClick('global')}
          >
            Add Global Variable
          </Button>
        </PopoverContent>
      </Popover>

      {selectedOption && (
        <VariableDialog type={selectedOption} onClose={handleDialogClose} />
      )}
      {/* <Button
        variant="secondary"
        className="flex flex-row items-center space-x-2 px-3"
      >
        <List className="h-5 w-5" />
      </Button> */}
    </div>
  )
}
