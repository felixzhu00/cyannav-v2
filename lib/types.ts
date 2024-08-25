import { z } from 'zod'
import { Feature, FeatureCollection } from 'geojson'
import { IMessageDocument } from '@/models/message'
import mongoose, { Document, Schema, Model, Types } from 'mongoose'

// Infer TypeScript type from Zod schema
export type MapSchemaDecodedType = z.infer<typeof MapSchemaDecoded>

export interface CustomFeature extends Feature {
  _self?: Map<string, string | number>
}

export interface CustomFeatureCollection extends FeatureCollection {
  features: CustomFeature[]
  _shared?: Map<string, string | number>
}

// Define Zod schema for IEmoji
const IEmojiSchema = z.object({
  character: z.string(),
  owner: z.instanceof(Types.ObjectId).or(z.string()), // Since ObjectId is essentially a string
})

// Define Zod schema for IMessage
const IMessageSchema = z.object({
  author: z.union([
    z.instanceof(Types.ObjectId), // For ObjectId type
    z.string(), // To handle possible string representations
    z.any(), // This would ideally be a zod schema of IUserDocument if you have it
  ]),
  text: z.string(),
  emojis: z.array(IEmojiSchema).optional(),
  dateCreated: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),
})

// Define Zod schema for IMessageDocument by extending IMessage
const IMessageDocumentSchema = IMessageSchema.extend({
  _id: z.string().nonempty(),
})

export const MapSchemaEncoded = z.object({
  title: z.string().nonempty(),
  owner: z.string().nonempty(), // Assuming `ObjectId` as a string for Zod validation
  mapType: z.string().nonempty(),
  isPublished: z.boolean().default(false),
  thumbnail: z.instanceof(Buffer).optional(),
  geojson: z
    .object({
      type: z.literal('Buffer'),
      data: z.array(z.number()).nonempty(), // Byte array
    })
    .optional(),
  likes: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  dislike: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  messages: z.array(IMessageDocumentSchema).optional(), // Assuming `ObjectId` as a string
  sharedUsers: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  forkedFrom: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  dateCreated: z.string().transform((val) => new Date(val)), // Use string and transform to Date
})

export const MapSchemaDecoded = z.object({
  title: z.string().nonempty(),
  owner: z.string().nonempty(), // Assuming `ObjectId` as a string for Zod validation
  mapType: z.string().nonempty(),
  isPublished: z.boolean().default(false),
  thumbnail: z.instanceof(Buffer).optional(),
  geojson: z
    .custom<FeatureCollection>(
      (val) =>
        typeof val === 'object' &&
        val !== null &&
        'type' in val &&
        val.type === 'FeatureCollection' &&
        'features' in val &&
        Array.isArray(val.features),
      'Invalid geojson format'
    )
    .optional(),
  likes: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  dislike: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  messages: z.array(IMessageDocumentSchema).optional(), // Assuming `ObjectId` as a string
  sharedUsers: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  forkedFrom: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  dateCreated: z.date().default(() => new Date()),
})
