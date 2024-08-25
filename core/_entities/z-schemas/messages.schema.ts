import { Types } from 'mongoose'
import { z } from 'zod'

export const EmojiSchema = z.object({
  character: z.string(),
  owner: z.instanceof(Types.ObjectId).or(z.string()), // Since ObjectId is essentially a string
})

export const MessageSchema = z.object({
  author: z.union([
    z.instanceof(Types.ObjectId), // For ObjectId type
    z.string(), // To handle possible string representations
    z.any(), // This would ideally be a zod schema of IUserDocument if you have it
  ]),
  text: z.string(),
  emojis: z.array(EmojiSchema).optional(),
  dateCreated: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),
})

// Define Zod schema for IMessageDocument by extending IMessage
export const MessageDocumentSchema = MessageSchema.extend({
  _id: z.string().nonempty(),
})
