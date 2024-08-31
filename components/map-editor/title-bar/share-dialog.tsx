import { Copy, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { useToast } from '@/components/ui/use-toast'

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
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
  const { toast } = useToast()

  const [shareOption, setShareOption] = useState(isPublished)
  const [userInput, setUserInput] = useState('')

  const handleSelectChange = async (value: string) => {
    try {
      const response = await fetch(`/api/map/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: value }),
      })

      const result = await response.json()

      toast({
        description: result.message || result.error,
      })

      if (response.ok) {
        setShareOption(result.map.isPublished) // Update the title state
        setMapField({ field: 'isPublished', value: result.map.isPublished }) // Update the global title state
      }
    } catch (error) {
      toast({
        description: 'An error occurred while updating the publish status',
      })
    }
  }

  const handleUserAction = async (user: string, option: 'add' | 'remove') => {
    try {
      const response = await fetch(`/api/map/${_id}/shared-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, option }),
      })

      const result = await response.json()

      toast({
        description: result.message || result.error,
      })

      if (response.ok) {
        if (option === 'add') {
          setUserInput('') // Reset Input
        }
        // If length changes (deleted or added)
        if (sharedUsers.length !== result.data.sharedUsers.length) {
          setMapField({ field: 'sharedUsers', value: result.data.sharedUsers }) // Update the global sharedUser
        }
      }
    } catch (error) {
      toast({
        description: 'An error occurred while updating user',
      })
    }
  }

  const url = `http://localhost:3000/api/map/${_id}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Share</Button>
      </DialogTrigger>
      <DialogContent className="gap-0 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share &quot;{title}&quot;</DialogTitle>
          <DialogDescription className="sr-only">
            Manage share options here
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-center gap-4 py-2 pt-4">
          <Input
            type="email"
            placeholder="Enter email to add user"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              handleUserAction(userInput, 'add')
            }}
          >
            Add
          </Button>
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

            {shareOption !== 'private' &&
              sharedUsers &&
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
                    <Button
                      variant="secondary"
                      className="p-3"
                      onClick={() => {
                        handleUserAction(user.email, 'remove')
                      }}
                    >
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
