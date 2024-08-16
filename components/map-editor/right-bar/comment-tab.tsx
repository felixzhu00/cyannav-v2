import { sampleComments } from '@/lib/const'
import CommentInput from './comment-input'
import Comment from './comment'

export default function CommentTab() {
  return (
    <div className="flex-col justify-between">
      <div>
        {sampleComments.map((comment) => (
          <Comment
            key={comment.id}
            // id={comment.id}
            message={comment.message}
            user={comment.user}
            time={comment.time}
          />
        ))}
      </div>
      <CommentInput />
    </div>
  )
}
