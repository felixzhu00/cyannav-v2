import mongoose, { Document, Schema, model, Model, Types } from 'mongoose'

export interface IMap {
  title: string
  owner: Types.ObjectId
  mapType: string
  isPublished: boolean
  thumbnail?: Buffer
  geojson?: Buffer
  likes?: Types.ObjectId[]
  dislike?: Types.ObjectId[]
  comments?: Types.ObjectId[]
  sharedUsers?: Types.ObjectId[]
  forkedFrom?: Types.ObjectId[]
  dateCreated: Date
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
  dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  sharedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  forkedFrom: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Map' }],
  dateCreated: { type: Date, default: Date.now },
})

const Map: Model<IMapDocument> =
  mongoose.models.Map || model<IMapDocument>('Map', MapSchema)
  
export default Map
