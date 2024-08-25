import { z } from 'zod'
import { MessageDocumentSchema } from './messages.schema'
import { FeatureCollection } from 'geojson'

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
  messages: z.array(MessageDocumentSchema).optional(), // Assuming `ObjectId` as a string
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
  messages: z.array(MessageDocumentSchema).optional(), // Assuming `ObjectId` as a string
  sharedUsers: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  forkedFrom: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  dateCreated: z.date().default(() => new Date()),
})
export type MapSchemaDecodedType = z.infer<typeof MapSchemaDecoded>
