import CommentInput from './comment-input'
import Comment from './comment'
import IMessagesDocument from '@/models/message'

export default function CommentTab({messages}: {messages: (typeof IMessagesDocument | undefined)[]}) {
  return (
    <div className="flex-col justify-between">
      <div>
        {messages?.map((message) => (
          <Comment
            key={message?.id}
            // id={comment.id}
            message={message.message}
            user={message.author}
            time={message.time}
          />
        ))}
      </div>
      <CommentInput />
    </div>
  )
}
