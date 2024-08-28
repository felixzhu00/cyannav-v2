import { Check, Copy, Lock, Minus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAtom } from 'jotai'
import { mapAtom, setMapFieldAtom } from '@/lib/jotai'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log('Text copied to clipboard successfully!')
      // Optionally, you could show a toast notification or some UI feedback here
    },
    (err) => {
      console.error('Failed to copy text: ', err)
      // Handle the error appropriately, maybe show an error message
    }
  )
}

const shareOptions = {
  public: {
    mode: 'Public',
    des: 'Everyone can view your map',
  },
  invited: {
    mode: 'Invited',
    des: 'Only invited people can view your map',
  },
  private: { mode: 'Private', des: 'No one can view your map' },
}

export default function DialogCloseButton() {
  const [map] = useAtom(mapAtom)
  const [, setMapField] = useAtom(setMapFieldAtom)
  const { _id, title, owner, sharedUsers, isPublished } = map

  const [shareOption, setShareOption] = useState(isPublished)
  console.log(shareOption)
  const handleSelectChange = (value: string) => {
    setShareOption(value)
  }

  const url = `http://localhost:3000/api/map/${_id}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Share</Button>
      </DialogTrigger>
      <DialogContent className="gap-0 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{title}"</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center gap-4 py-2 pt-4">
          <Input type="email" placeholder="Enter email/username to add user" />
          <Button variant="secondary"> Add</Button>
        </div>
        <div className="flex-col items-center py-2">
          <div className="font-bold">People With Access</div>
          <div className="max-h-[130px] overflow-y-auto pr-2">
            <div className="flex flex-row items-center justify-between py-1.5">
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">{owner.username}</span>
                  <span className="text-sm text-gray-500">{owner.email}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">OWNER</div>
            </div>

            {sharedUsers &&
              sharedUsers.map(
                (user: { username: string; email: string }, index) => (
                  <div
                    key={index.toString() + user.username}
                    className="flex flex-row items-center justify-between py-1.5"
                  >
                    <div className="flex flex-row items-center gap-2">
                      <Avatar>
                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.username}</span>
                        <span className="text-sm text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <Button variant="secondary" className="p-3">
                      Remove
                    </Button>
                  </div>
                )
              )}
          </div>
        </div>
        <div className="flex-col items-center py-2 pb-4">
          <div className="font-bold">General Access</div>
          <div className="flex flex-row items-center justify-between py-1.5">
            <div className="flex flex-row items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  <Lock className="p-1" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Select
                  defaultValue={shareOption}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="mb-1 flex flex-row items-center px-4 text-left font-semibold">
                    <SelectValue
                      placeholder={
                        shareOption[0].toUpperCase() + shareOption.slice(1)
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="invited">Invited</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <span className="text-sm text-gray-500">
                  {shareOptions[shareOption as keyof typeof shareOptions].des}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => copyToClipboard(url)}
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Link</span>
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
