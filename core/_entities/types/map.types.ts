import { Document, Types } from 'mongoose'
import { FeatureCollection, Feature } from 'geojson'
import { IUserDocument } from './user.types'
import { IMessageDocument } from './messages.types'

// DB MAP Structure
export interface IMap {
  title: string
  owner: IUserDocument | IUserDocument['_id'] | Types.ObjectId
  mapType: string
  isPublished: "public" | "private" | "invited" 
  thumbnail?: Buffer
  geojson?: Buffer
  likes?: IUserDocument[] | IUserDocument['_id'][] | Types.ObjectId[]
  messages?: IMessageDocument[] | IMessageDocument['_id'][] | Types.ObjectId[]
  sharedUsers?: IUserDocument[] | IUserDocument['_id'][] | Types.ObjectId[]
  forkedFrom?: IMapDocument | IMapDocument['_id'] | Types.ObjectId
  dateCreated?: Date
}
export interface IMapDocument extends IMap, Document {}

// Custom Feature Collection
export interface CustomFeature extends Feature {
  _self?: Map<string, string | number>
}

export interface CustomFeatureCollection extends FeatureCollection {
  features: CustomFeature[]
  _shared?: Map<string, string | number>
}
