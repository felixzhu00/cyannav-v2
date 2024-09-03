import { IUserDocument } from '@/core/_entities/types/user.types'
import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  salt: { type: String, required: true },
  profilePicture: { type: [Buffer, String] },
  favorite: [{ type: Schema.Types.ObjectId, ref: 'Map' }],
  dateCreated: { type: Date, default: Date.now },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
})

// Use the existing model if it exists, otherwise create a new one
delete models.User
// const User = models.User || model<IUserDocument>('User', UserSchema)
export default model<IUserDocument>('User', UserSchema)

// export default User
