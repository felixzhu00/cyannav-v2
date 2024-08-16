import {
  Avatar,
  AvatarFallback,
  // AvatarImage
} from '@/components/ui/avatar'

type CommentProps = {
  message: string
  user: string
  time: Date
}

export default function Comment({ message, user, time }: CommentProps) {
  return (
    <div className="flex items-start space-x-4 p-4">
      <Avatar>
        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <div>
          <span className="mr-2 font-semibold">{user}</span>
          <span className="text-sm text-gray-500">
            {new Date(time).toLocaleString()}
          </span>
        </div>
        <div className="rounded-lg p-2 text-sm">{message}</div>
      </div>
    </div>
  )
}
