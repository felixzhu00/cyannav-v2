import Map, { IMapDocument } from '../models/map'
import { IUserDocument } from '../models/user'

import dbConnect from '../lib/dbConnect'
import { decodeGeo } from '@/lib/utils'
import { z } from 'zod'
import { Types } from 'mongoose'
import { FeatureCollection } from 'geojson'

export const MapSchemaEncoded = z.object({
  title: z.string().nonempty(),
  owner: z.string().nonempty(), // Assuming `ObjectId` as a string for Zod validation
  mapType: z.string().nonempty(),
  isPublished: z.boolean().default(false),
  thumbnail: z.instanceof(Buffer).optional(),
  geojson: z.instanceof(Buffer).optional(),
  likes: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  dislike: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  comments: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  sharedUsers: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  forkedFrom: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  dateCreated: z.date().default(() => new Date()),
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
  comments: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  sharedUsers: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  forkedFrom: z.array(z.string()).optional(), // Assuming `ObjectId` as a string
  dateCreated: z.date().default(() => new Date()),
})

export default async function getMapById(id: string) {
  await dbConnect()
  const map:IMapDocument | null = await Map.findById(id).populate('owner', 'username').lean()
  

  if (!map) {
    return {
      errors: { id: ['Map not found'] },
      message: 'Map not found',
    }
  }

  const transformedMap = {
    ...map,
    owner: (map.owner as IUserDocument)?.username?.toString(),
    geojson: map.geojson ? Buffer.from(map.geojson.buffer) : undefined,
    thumbnail: map.thumbnail ? Buffer.from(map.thumbnail) : undefined,
    messages: map.messages?.map((messagesId) =>
      (messagesId as Types.ObjectId).toString()
    ),
    sharedUsers: map.sharedUsers?.map((userId) =>
      (userId as Types.ObjectId).toString()
    ),
    forkedFrom: map.forkedFrom?.toString(),
    likes: map.likes?.map((likeId) => (likeId as Types.ObjectId).toString()),
  }

  const validateDBMap = MapSchemaEncoded.safeParse(transformedMap)

  if (!validateDBMap.success) {
    return {
      errors: validateDBMap.error.flatten().fieldErrors,
      message: 'Unexcepted Map Encode Format',
    }
  }

  const JsonFiledMap = {
    ...validateDBMap.data,
    geojson: decodeGeo(validateDBMap.data.geojson),
  }

  const validateDecodedMap = MapSchemaDecoded.safeParse(JsonFiledMap)
  if (!validateDecodedMap.success) {
    return {
      errors: validateDecodedMap.error.flatten().fieldErrors,
      message: 'Unexcepted Map Decoded Format',
    }
  }

  return { ...validateDecodedMap.data }
}
