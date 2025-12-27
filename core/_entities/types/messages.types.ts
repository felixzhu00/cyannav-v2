import { Document, InferSchemaType, Types } from 'mongoose'
import { messageSchema } from '@/db/message.model'

// DB Emoji Structure
export interface IEmoji {
  character: string
  owner: Types.ObjectId
}

export type IMessage = InferSchemaType<typeof messageSchema>

export interface IMessageDocument extends IMessage, Document {}

export interface MessageFields {
  _id: string
  author: string
  text: string
  emojis?: IEmoji[]
  replyTo?: Types.ObjectId // Array of Message references
  dateCreated?: Date
}
