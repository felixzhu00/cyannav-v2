import { Schema, model, models } from 'mongoose'

// Next-Auth fields - username, email, image, emailVerified
// createUser fields - profilePicture
export const userSchema = new Schema({
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

export default model('User', userSchema)
