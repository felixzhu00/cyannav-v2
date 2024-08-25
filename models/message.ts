import mongoose, { Document, Schema, Model, Types } from 'mongoose'
// eslint-disable-next-line import/no-cycle
import { IUserDocument } from '@/models/user'

interface IPopulatedAuthor {
  _id: Types.ObjectId; // MongoDB ObjectId type
  username: string;    // The username of the author
}

export interface IEmoji {
  character: string
  owner: Types.ObjectId
}

export interface IMessage {
  author: IUserDocument | IUserDocument['_id'] | Types.ObjectId | IPopulatedAuthor // Reference to User
  text: string
  emojis?: IEmoji[]
  replyTo?: Types.ObjectId // Array of Message references
  dateCreated?: Date
}

export interface IMessageDocument extends IMessage, Document {}

const MessageSchema = new Schema<IMessageDocument>({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  emojis: [
    {
      character: { type: String, required: true },
      owner: { type: Types.ObjectId, required: true },
    },
  ],
  dateCreated: { type: Date, default: Date.now },
})
delete mongoose.models['Message']
export default mongoose.model<IMessageDocument>('Message', MessageSchema)

// const Message: Model<IMessageDocument> =
//   mongoose.models.Message ||
//   mongoose.model<IMessageDocument>('Message', MessageSchema)

// export default Message
