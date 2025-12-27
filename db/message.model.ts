import { Schema, model, models, Types } from 'mongoose'

export const messageSchema = new Schema({
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

export default model('Message', messageSchema)
