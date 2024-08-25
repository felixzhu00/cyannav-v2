import {
  Avatar,
  AvatarFallback,
  // AvatarImage
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EllipsisVertical, Reply, Smile } from 'lucide-react'

type CommentProps = {
  message: string
  user: string
  time: Date
}

export default function Comment({ message, user, time }: CommentProps) {
  return (
    <div className="">
      <div className="flex items-start justify-between p-4 pb-1">
        <div className="flex flex-row items-center gap-2">
          <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="mr-2 text-xl font-bold">{user}</span>
            <span className="text-sm text-gray-500">
              {new Date(time).toLocaleString('en-US', {
                hour12: true,
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
        <div className="space-x-4 self-center text-center">
          <Button variant="ghost" className="h-5 w-5 p-0">
            <Smile />
          </Button>
          <Button variant="ghost" className="h-5 w-5 p-0">
            <Reply />
          </Button>
          <Button variant="ghost" className="h-5 w-5 p-0">
            <EllipsisVertical />
          </Button>
        </div>
      </div>

      <div className="rounded-lg p-2 pl-5 text-xl">{message}</div>
    </div>
  )
}
