import mongoose, { Document, Schema, model, Model, Types } from 'mongoose'
// eslint-disable-next-line import/no-cycle
import { IUserDocument } from '@/models/user'
import { IMessageDocument } from '@/models/message'

export interface IMap {
  title: string
  owner: IUserDocument | IUserDocument['_id'] | Types.ObjectId
  mapType: string
  isPublished: boolean
  thumbnail?: Buffer
  geojson?: Buffer
  likes?: IUserDocument[] | IUserDocument['_id'][] | Types.ObjectId[]
  messages?: IMessageDocument[] | IMessageDocument['_id'][] | Types.ObjectId[]
  sharedUsers?: IUserDocument[] | IUserDocument['_id'][] | Types.ObjectId[]
  forkedFrom?: IMapDocument | IMapDocument['_id'] | Types.ObjectId
  dateCreated?: Date
}

export interface IMapDocument extends IMap, Document {}

const MapSchema = new Schema<IMapDocument>({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mapType: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  thumbnail: { type: Buffer },
  geojson: { type: Buffer },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  sharedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  forkedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Map' },
  dateCreated: { type: Date, default: Date.now },
})

// delete mongoose.models['Map']

// export default mongoose.model<IMapDocument>('Map', MapSchema)

const Map: Model<IMapDocument> =
  mongoose.models.Map || model<IMapDocument>('Map', MapSchema)

export default Map
