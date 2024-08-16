import mongoose from 'mongoose'

const { Schema } = mongoose

// Assuming the Map model is defined elsewhere
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: Buffer,
  },
  favorite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Map',
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
})

// Check if the model already exists (to prevent recompilation during hot reloads)
const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User


// let mongoose = require('mongoose')

// const { Schema } = mongoose

// // Assuming the Map model is defined elsewhere
// const UserSchema = new Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   salt: {
//     type: String,
//     required: true,
//   },
//   profilePicture: {
//     type: Buffer,
//   },
//   favorite: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Map',
//     },
//   ],
//   dateCreated: {
//     type: Date,
//     default: Date.now,
//   },
//   plan: { type: String, enum: ['free', 'pro'], default: 'free' },
// })

// // Check if the model already exists (to prevent recompilation during hot reloads)
// module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
