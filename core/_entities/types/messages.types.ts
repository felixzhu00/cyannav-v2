import { Document, Types } from 'mongoose'
import { IUserDocument } from './user.types'

// DB Emoji Structure
export interface IEmoji {
  character: string
  owner: Types.ObjectId
}

// DB Message Structure
export interface IMessage {
  author: IUserDocument | IUserDocument['_id'] | Types.ObjectId
  text: string
  emojis?: IEmoji[]
  replyTo?: Types.ObjectId // Array of Message references
  dateCreated?: Date
}
export interface IMessageDocument extends IMessage, Document {}
