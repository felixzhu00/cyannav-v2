import mongoose, { Document, Schema, Model, Types } from 'mongoose'

export interface IUser {
  username: string
  email: string
  password: string
  salt: string
  profilePicture?: Buffer
  favorite?: Types.ObjectId[] // Array of Map references
  dateCreated?: Date
  plan?: 'free' | 'pro'
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  profilePicture: { type: Buffer },
  favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Map' }],
  dateCreated: { type: Date, default: Date.now },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
})

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema)

export default User
