import CommentInput from './comment-input'
import Comment from './comment'
import { useAtom } from 'jotai'
import { mapAtom } from '@/atoms/jotai'

export default function CommentTab() {
  const [map] = useAtom(mapAtom)

  const messageList = map.messages

  if (!messageList)
    return (
      <div className="mr-5 text-center text-sm text-gray-500">
        Be The First To Send a Message ➤
      </div>
    )

  return (
    <div className="flex-col justify-between">
      <div>
        {messageList?.map((message) => (
          <Comment
            key={message?._id}
            message={message.text}
            user={message.author}
            time={message.dateCreated}
          />
        ))}
      </div>
      <CommentInput />
    </div>
  )
}
