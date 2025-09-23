import { Schema, model, models, Types, InferSchemaType } from 'mongoose'
import { IMessageDocument } from '@/core/_entities/types/messages.types'

const messageSchema = new Schema<IMessageDocument>({
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

//Export Message Schema
export default model<IMessageDocument>('Message', messageSchema)

// Export Type of Message Schema
export type IMessage = InferSchemaType<typeof messageSchema>
