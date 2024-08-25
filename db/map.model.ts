import { Schema, model, models } from 'mongoose'
import { IMapDocument } from '@/core/_entities/types/map.types'

const MapSchema = new Schema<IMapDocument>({
  title: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mapType: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  thumbnail: { type: Buffer },
  geojson: { type: Buffer },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  sharedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  forkedFrom: { type: Schema.Types.ObjectId, ref: 'Map' },
  dateCreated: { type: Date, default: Date.now },
})

delete models.Map
export default model<IMapDocument>('Map', MapSchema)

// const Map: Model<IMapDocument> =
//   .models.Map || model<IMapDocument>('Map', MapSchema)
// export default Map
