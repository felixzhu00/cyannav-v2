import mongoose from 'mongoose'

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
