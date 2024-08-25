import { IUserDocument } from '@/core/_entities/types/user.types'
import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  salt: { type: String, required: true },
  profilePicture: { type: Buffer },
  favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Map' }],
  dateCreated: { type: Date, default: Date.now },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
})

delete models.User
export default model<IUserDocument>('User', UserSchema)

// const User: Model<IUserDocument> =
//   mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema)
// export default User
