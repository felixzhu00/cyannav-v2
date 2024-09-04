// NOTE this is for dev use only do not run on production
// File does not work with any imported ts file

/* eslint-disable no-console */
import crypto from 'crypto'
import geobuf from 'geobuf'
import { nanoid } from 'nanoid'
import Pbf from 'pbf'

import geojsonData from './public/america.geo.json' assert { type: 'json' }

import mongoose from 'mongoose'
const { Schema } = mongoose

const MessageSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: { type: String, required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  emojis: [
    {
      character: { type: String, required: true },
      owner: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
  ],
  dateCreated: { type: Date, default: Date.now },
})

// Check if the model already exists (to prevent recompilation during hot reloads)
const Message =
  mongoose.models.Message || mongoose.model('Message', MessageSchema)

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
  isPublished: { type: String, default: 'private' },
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

  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
  sharedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Map',
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
})

// Check if the model already exists (to prevent recompilation during hot reloads)
const MMap = mongoose.models.Map || mongoose.model('Map', MapSchema)

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

const mongoDB = 'mongodb://localhost:27017/cyan' // replace with db of your choice

// Use during import new map
export function convertToCustomFeatureCollection(geojson) {
  if (geojson.type === 'FeatureCollection') {
    const postGeo = geojson.features.map((feature, index) => ({
      ...feature,
      properties: {
        ...feature.properties,
        _id: nanoid(),
        _self: {
          name: feature.properties.name || `Feature${index}`,
          _visible: true,
          _lock: false,
        },
      },
    }))

    const finalGeo = {
      type: 'FeatureCollection',
      features: postGeo,
      _shared: new Map(),
    }

    return finalGeo
  }

  if (geojson.type === 'Feature') {
    const finalGeo = {
      ...geojson,
      properties: {
        ...geojson.properties,
        _id: nanoid(),

        _self: {
          name: geojson.properties.name,
          _visible: true,
          _lock: false,
        },
      },
    }

    return {
      type: 'FeatureCollection',
      features: [finalGeo],
      _shared: new Map(),
    }
  }

  if (geojson.type === 'GeometryCollection') {
    // Wrap GeometryCollection in a Feature
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: geojson,
          properties: {
            ...geojson.properties,
            _id: nanoid(),

            _self: {
              name: geojson.properties.name,
              _visible: true,
              _lock: false,
            },
          },
        },
      ],
      _shared: new Map(),
    }
  }

  // Assume it's a Geometry type
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: geojson,
        properties: {
          ...geojson.properties,
          _id: nanoid(),
          _self: {
            name: 'Geometry',
            _visible: true,
            _lock: false,
          },
        },
      },
    ],
    _shared: new Map(),
  }
}

async function createUser(
  username,
  email,
  password,
  plan,
  profilePicture,
  favorite,
  dateCreated
) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 100, 64, 'sha256')
    .toString('hex')

  const userDetail = {
    username,
    email,
    password: hashedPassword,
    salt,
    plan,
    profilePicture,
    favorite,
    dateCreated,
  }

  const user = new User(userDetail)
  return user.save()
}

async function createMap(
  title,
  owner,
  mapType,
  isPublished,
  geojson,
  thumbnail,
  likes,
  messages,
  sharedUsers,
  forkedFrom,
  dateCreated
) {
  const mapDetail = {
    title,
    owner,
    mapType,
    isPublished,
    geojson,
    thumbnail,
    likes,
    messages,
    sharedUsers,
    forkedFrom,
    dateCreated,
  }

  const map = new MMap(mapDetail)
  return map.save()
}

async function createMessage(author, text, emojis, replyTo, dateCreated) {
  const messageDetail = {
    author,
    text,
    emojis,
    replyTo,
    dateCreated,
  }

  const message = new Message(messageDetail)
  return message.save()
}

async function createBotUsers(amount) {
  const password = 'password!Asd' // TODO store this env in the future
  const baseDate = new Date('2022-01-01')

  const users = []

  for (let i = 0; i < amount; i += 1) {
    const username = `cyanBot${i}`
    const email = `${username}@cyannav.com`
    const dateCreated = new Date(baseDate)
    dateCreated.setDate(baseDate.getDate() + i)
    const plan = Math.random() > 0.7 ? 'free' : 'pro'

    users.push(
      createUser(
        username,
        email,
        password,
        plan,
        undefined,
        undefined,
        dateCreated
      )
    )
  }

  // Wait for all user creation promises to resolve
  const createdUsers = await Promise.all(users)

  console.log(`${amount} bot users created successfully!`)
  return createdUsers
}

async function createBotMessages(usersList, amount) {
  if (amount <= 0) {
    throw new Error(
      'Amount must be a positive number and less than or equal to the number of users.'
    )
  }

  const baseDate = new Date('2022-01-01')
  const Messages = []

  for (let i = 0; i < amount; i += 1) {
    const author = usersList[i % usersList.length].id // Ensure the author is selected from the list of users
    const text = `I love cupcakes ${i}`

    const dateCreated = new Date(baseDate)
    dateCreated.setDate(baseDate.getDate() + i) // Increment date for each Message

    Messages.push(
      createMessage(author, text, undefined, undefined, dateCreated)
    )
  }

  // Wait for all Message creation promises to resolve
  const createdMessages = await Promise.all(Messages)

  console.log(`${amount} bot Messages created successfully!`)

  // Return the list of created Messages
  return createdMessages
}

async function createBotMap(amount, userList, messageList) {
  if (amount <= 0) {
    throw new Error(
      'Amount must be a positive number and less than or equal to the number of geojson entries.'
    )
  }

  const baseDate = new Date('2022-01-01')
  const mapTypes = [
    'heat',
    'distributiveflow',
    'point',
    '3drectangle',
    'choropleth',
  ]

  // Helper function to get random users
  const getRandomUsers = (count, users, excludeUser) => {
    const filteredUsers = excludeUser
      ? users.filter((user) => user.toString() !== excludeUser.toString())
      : users
    const shuffled = filteredUsers
      .slice()
      .sort(() => 0.5 - Math.random())
      .map((user) => user.id)
    return shuffled.slice(0, count)
  }

  const maps = []

  for (let i = 0; i < amount; i += 1) {
    // Randomly pick a geojson
    // const geojson = geojsonList[Math.floor(Math.random() * geojsonList.length)];

    // Generate title
    // const geojsonData = await GeoJSON.findById(geojson).exec(); // Assume GeoJSON is a Mongoose model for geojsonList

    const geojsonCustom = convertToCustomFeatureCollection(geojsonData)

    const title = `${geojsonCustom.features[0].properties.name} ${i}`

    // Randomly select owner
    const owner = userList[Math.floor(Math.random() * userList.length)].id

    // Randomly select map type
    const mapType = mapTypes[Math.floor(Math.random() * mapTypes.length)]

    // Generate like and dislike arrays
    const numVotes = Math.floor(Math.random() * (userList.length / 2))
    const voteList = getRandomUsers(numVotes, userList, owner)

    // Generate shareUsers
    const shareUsers = getRandomUsers(
      Math.min(5, userList.length),
      userList,
      owner
    )

    // Generate dateCreated
    const dateCreated = new Date(baseDate)
    dateCreated.setDate(baseDate.getDate() + i)

    // Use geobuf to encode data to buffer type
    const buffer = geobuf.encode(geojsonCustom, new Pbf())
    const finalBuffer = Buffer.from(buffer)

    const chatroomMessages = messageList.map((mess) => mess.id)
    // console.log(typeof buffer)

    // Create the map
    maps.push(
      createMap(
        title,
        owner,
        mapType,
        'public', // isPublished
        finalBuffer, // Assuming geojson is a Buffer or compatible type
        undefined, // Optional thumbnail
        voteList, // Likes
        chatroomMessages, // Messages
        shareUsers, // Share users
        undefined,
        dateCreated // Date created
      )
    )
  }

  // Wait for all map creation promises to resolve
  const createdMaps = await Promise.all(maps)

  console.log(`${amount} bot maps created successfully!`)

  // Return the list of created maps
  return createdMaps
}

async function main() {
  await mongoose.connect(mongoDB)
  console.log('Connected to MongoDB')

  // Clear existing data
  await User.deleteMany({})
  await MMap.deleteMany({})
  await Message.deleteMany({})
  console.log('Cleared existing data')

  const users = await createBotUsers(10)
  const Messages = await createBotMessages(users, 20)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const maps = await createBotMap(20, users, Messages)

  // Clean up
  mongoose.connection.close()
  console.log('Database populated successfully')
}

main().catch((err) => {
  console.error('Error populating database:', err)
  mongoose.connection.close()
})
