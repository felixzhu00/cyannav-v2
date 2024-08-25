import { Button } from '@/components/ui/button'
import { User, File, ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import ShareDialog from './share-dialog'
import EditToolbar from './edit-toolbar'
import { useAtom } from 'jotai'
import { mapAtom } from '@/atoms/jotai'

// type MenuBarProps = {
//   title: string,
//   owner: string,
//   isPublished: boolean,
//   sharedUsers: string[] | undefined
//   forkedFrom: string[] | undefined    // Change DB model
// }

export default function MenuBar() {
  const [map, setMap] = useAtom(mapAtom)

  const { title, owner, isPublished, sharedUsers, forkedFrom } = map

  return (
    <div className="flex w-full items-center justify-between border-b-2 border-zinc-700 bg-zinc-900 p-4 text-white shadow">
      <EditToolbar className="flex-1" />

      {/* TODO display where fork from */}
      {/* Center Section: Placeholder Name */}
      <div className="flex-1 text-center">
        <span className="mr-4 text-xl font-semibold">{title}</span>
        <span className="mr-4 text-xl font-semibold text-zinc-400">/</span>
        <span className="text-zinc-500">By {owner}</span>
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
