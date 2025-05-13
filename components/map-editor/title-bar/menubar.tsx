import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import ShareDialog from './share-dialog'
import EditToolbar from './edit-toolbar'
import Title from './title'

export default function MenuBar() {
  return (
    <div className="h-24 flex w-full items-center justify-between border-b-2 border-zinc-700 bg-zinc-900 text-white shadow min-h-0">
      <EditToolbar className="flex-1 flex-shrink-1" />

      {/* TODO display where fork from */}
      <Title className=""/>

      {/* Right Section: Profile Icon and Share Option */}
      <div className="mr-4 flex flex-1 items-center justify-end space-x-4 py-4">
        <Button variant="secondary" size="sm">
          <User className="h-5 w-5" />
        </Button>
        <ShareDialog />
      </div>
    </div>
  )
}
// TODO version control icon and menu
