import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import ShareDialog from './share-dialog'
import EditToolbar from './edit-toolbar'
import Title from './title'

export default function MenuBar({ isOwner }: { isOwner?: Boolean }) {
  return (
    <div className="flex h-24 min-h-0 w-full items-center justify-between border-b-2 border-border bg-pf shadow">
      <EditToolbar
        className={`flex-shrink-1 flex-1 ${!isOwner ? 'hidden' : ''}`}
      />
      {!isOwner && <div className={`flex-shrink-1 flex-1`} />}

      {/* TODO display where fork from */}
      <Title className="" />

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
