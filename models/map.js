import mongoose from 'mongoose'

const { Schema } = mongoose

const MapSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mapType: {
    type: String,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  thumbnail: {
    type: Buffer,
  },
  geojson: {
    type: Buffer,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  dislike: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  sharedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  forkedFrom: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Map',
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
})

// Check if the model already exists (to prevent recompilation during hot reloads)
const Map = mongoose.models.Map || mongoose.model('Map', MapSchema)

export default Map

// let mongoose = require("mongoose")

// const { Schema } = mongoose

// const MapSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   mapType: {
//     type: String,
//     required: true,
//   },
//   isPublished: {
//     type: Boolean,
//     default: false,
//   },
//   thumbnail: {
//     type: Buffer,
//   },
//   geojson: {
//     type: Buffer,
//   },
//   likes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//   ],
//   comments: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Comment',
//     },
//   ],
//   sharedUsers: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//   ],
//   forkedFrom: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Map',
//     },
//   ],
//   dateCreated: {
//     type: Date,
//     default: Date.now,
//   },
// })

// // Check if the model already exists (to prevent recompilation during hot reloads)
// module.exports =  mongoose.models.Map || mongoose.model('Map', MapSchema)
