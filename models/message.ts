import mongoose, { Document, Schema, Model, Types } from 'mongoose'

export interface IEmoji {
  character: string
  owner: Types.ObjectId
}

export interface IMessage {
  author: Types.ObjectId // Reference to User
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

const Message: Model<IMessageDocument> =
  mongoose.models.Message ||
  mongoose.model<IMessageDocument>('Message', MessageSchema)

export default Message
