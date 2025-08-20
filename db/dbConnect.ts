import mongoose from 'mongoose'
import User from '@/db/user.model'
import Message from '@/db/message.model'
import Map from '@/db/map.model'
import Subscription from '@/db/subscription.model'

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var mongoose: any // This must be a `var` and not a `let / const`
}

// TODO
// const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_URI = 'mongodb://localhost:27017/cyan'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  // eslint-disable-next-line no-multi-assign
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  // handle NextJS model loading
  const user = User.findById(1)
  const messages = Message.findById(1)
  const map = Map.findById(1)
  const subscription = Subscription.findById(1)

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((dbmongoose) => dbmongoose)
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
