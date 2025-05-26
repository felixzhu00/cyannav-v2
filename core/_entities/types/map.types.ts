import { Document, Types } from 'mongoose'
import { FeatureCollection, Feature } from 'geojson'
import { IUserDocument } from './user.types'
import { IMessageDocument, MessageFields } from './messages.types'

// DB MAP Structure
export interface IMap {
  title: string
  owner: IUserDocument | IUserDocument['_id'] | Types.ObjectId
  mapType: string
  isPublished: 'public' | 'private' | 'invited'
  isTemplate?: boolean
  thumbnail?: Buffer
  geojson?: Buffer
  likes?: IUserDocument[] | IUserDocument['_id'][] | Types.ObjectId[]
  dislikes?: IUserDocument[] | IUserDocument['_id'][] | Types.ObjectId[]
  messages?: IMessageDocument[] | IMessageDocument['_id'][] | Types.ObjectId[]
  sharedUsers?: IUserDocument[] | IUserDocument['_id'][] | Types.ObjectId[]
  forkedFrom?: IMapDocument | IMapDocument['_id'] | Types.ObjectId
  dateCreated?: Date
  dateUpdated?: Date
  dateThumbnailUpdated?: Date
}
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
