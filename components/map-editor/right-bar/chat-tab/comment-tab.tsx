import CommentInput from './comment-input'
import Comment from './comment'
import { useAtomValue } from 'jotai'
import { mapAtom } from '@/lib/jotai'

export default function CommentTab() {
  const map = useAtomValue(mapAtom)

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
        {messageList.length !== 0 &&
          messageList.map((message, index) => (
            <Comment
              key={message._id + index.toString()}
              message={message.text}
              user={message.author}
              time={message.dateCreated || new Date()}
            />
          ))}
      </div>
      <CommentInput />
    </div>
  )
}
