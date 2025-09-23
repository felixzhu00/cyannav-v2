import { IUserDocument } from '@/core/_entities/types/user.types'
import { InferSchemaType, Schema, model, models } from 'mongoose'

// Next-Auth fields - username, email, image, emailVerified
// createUser fields - profilePicture
const userSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  salt: { type: String },
  profilePicture: { type: Buffer, default: null },
  favorite: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Map' }],
    default: [],
  },
  dateCreated: { type: Date, default: Date.now },
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
  emailVerified: { type: Date, default: null },
  image: { type: String },
  providers: { type: [String], default: [] },
})

delete models.User
//Export User Schema
export default model<IUserDocument>('User', userSchema)

// Export Type of User Schema
export type IMessage = InferSchemaType<typeof userSchema>
