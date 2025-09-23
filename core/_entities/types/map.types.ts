import { Document, InferSchemaType, Types } from 'mongoose'
import { FeatureCollection, Feature } from 'geojson'
import { MessageFields } from './messages.types'
import { mapSchema } from '@/db/map.model'

export type IMap = InferSchemaType<typeof mapSchema>

export interface IMapDocument extends IMap, Document {}

// Custom Feature Collection
export interface CustomFeatureCollection extends FeatureCollection {
  features: CustomFeature[]
  _shared: { [key: string]: any }
}

export interface CustomFeature extends Feature {
  id: string
}

export interface MapFields extends Partial<IMapDocument> {}
export type MapFieldKey = keyof MapFields

export interface MapAtom {
  _id: string
  title: string
  owner: {
    username: string
    email: string
  }
  mapType: string
  isPublished: 'private' | 'public' | 'invited'
  geojson: CustomFeatureCollection
  thumbnail?: string
  likes: string[]
  messages: MessageFields[]
  sharedUsers: {
    username: string
    email: string
  }[]
  dateCreated: Date
  forkedFrom: string[]
}
