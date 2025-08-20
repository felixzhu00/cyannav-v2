import { IUserDocument } from '@/core/_entities/types/user.types'
import { Schema, model, models } from 'mongoose'

// Next-Auth fields - username, email, image, emailVerified
// createUser fields - profilePicture
const UserSchema = new Schema<IUserDocument>({
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

// Use the existing model if it exists, otherwise create a new one
delete models.User
// const User = models.User || model<IUserDocument>('User', UserSchema)
export default model<IUserDocument>('User', UserSchema)

// export default User
