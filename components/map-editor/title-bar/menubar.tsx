import { Button } from '@/components/ui/button'
import { User, File, ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import ShareDialog from './share-dialog'

export default function MenuBar() {
  return (
    <div className="flex w-full items-center justify-between border-b-2 border-zinc-700 bg-zinc-900 p-4 text-white shadow">
      {/* Left Section: File Options */}

      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              className="flex flex-row items-center space-x-2 px-3"
            >
              <File className="mr-1 h-5 w-5" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="flex w-auto flex-col items-start"
          >
            <Button variant="ghost" className="w-full">
              <span className="w-full text-left">Export</span>
            </Button>
            <Button variant="ghost" className="w-full text-left">
              <span className="w-full text-left">Fork</span>
            </Button>
            <Button variant="ghost" className="w-full text-left">
              <span className="w-full text-left">Download PNG</span>
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {/* TODO display where fork from */}
      {/* Center Section: Placeholder Name */}
      <div className="flex-1 text-center">
        <span className="mr-4 text-xl font-semibold">Map Name</span>
        <span className="mr-4 text-xl font-semibold text-zinc-400">/</span>
        <span className="text-zinc-500">By Username</span>
      </div>

      {/* Right Section: Profile Icon and Share Option */}
      <div className="flex flex-1 items-center justify-end space-x-4">
        <Button variant="secondary" size="sm">
          <User className="h-5 w-5" />
        </Button>
        <ShareDialog />
      </div>
    </div>
  )
}
// TODO version control icon and menu