import { Schema, model, models, Types } from 'mongoose'
import { IMessageDocument } from '@/core/_entities/types/messages.types'

const MessageSchema = new Schema<IMessageDocument>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
  emojis: [
    {
      character: { type: String, required: true },
      owner: { type: Types.ObjectId, required: true },
    },
  ],
  dateCreated: { type: Date, default: Date.now },
})
delete models.Message
export default model<IMessageDocument>('Message', MessageSchema)

// const Message: Model<IMessageDocument> =
//   mongoose.models.Message ||
//   mongoose.model<IMessageDocument>('Message', MessageSchema)
// export default Message
