// NOTE this is for dev use only do not run on production
// File does not work with any imported ts file
import crypto from 'crypto'
import geobuf from 'geobuf'
import Pbf from 'pbf'

import geojsonData from './public/america.geo.json' assert { type: 'json' }
import mongoose from 'mongoose'
import User from './schema/user.js'
import Map from './schema/map.js'
import Comment from './schema/comment.js'

const mongoDB = 'mongodb://localhost:27017/cyan' //replace with db of your choice

async function main() {
  await mongoose.connect(mongoDB)
  console.log('Connected to MongoDB')

  // Clear existing data
  await User.deleteMany({})
  await Map.deleteMany({})
  await Comment.deleteMany({})
  console.log('Cleared existing data')

  const users = await createBotUsers(10)
  const comments = await createBotComments(users, 20)
  const maps = await createBotMap(20, users, comments)

  // Clean up
  mongoose.connection.close()
  console.log('Database populated successfully')
}

main().catch((err) => {
  console.error('Error populating database:', err)
  mongoose.connection.close()
})

async function createUser(
  username,
  email,
  password,
  plan,
  profilePicture, // Optional parameter
  favorite, // Optional parameter
  dateCreated // Optional parameter
) {
  const userDetail = {
    username,
    email,
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 100, 64, 'sha256') // TODO remeber to concatnate env secret to password
    .toString('hex')

  if (plan) userDetail.plan = plan
  if (profilePicture) userDetail.profilePicture = profilePicture
  if (favorite) userDetail.favorite = favorite
  if (dateCreated) userDetail.dateCreated = dateCreated
  if (salt) userDetail.salt = salt
  if (hashedPassword) userDetail.password = hashedPassword

  const user = new User(userDetail)
  return user.save()
}

async function createMap(
  title,
  owner, // Assuming owner is a reference to a User
  mapType,
  isPublished,
  geojson,
  thumbnail,
  like, // Optional
  dislike, // Optional
  comments, // Optional, assuming comments are references
  sharedUsers, // Optional
  forkedFrom, // Optional
  dateCreated // Optional
) {
  const mapDetail = {
    title,
    owner,
    mapType,
    isPublished,
    thumbnail,
    geojson,
  }

  if (thumbnail) mapDetail.thumbnail = thumbnail
  if (like) mapDetail.like = like
  if (dislike) mapDetail.dislike = dislike
  if (comments) mapDetail.comments = comments
  if (sharedUsers) mapDetail.sharedUsers = sharedUsers
  if (forkedFrom) mapDetail.forkedFrom = forkedFrom
  if (dateCreated) mapDetail.dateCreated = dateCreated

  const map = new Map(mapDetail)
  return map.save()
}

async function createComment(
  author, // Reference to a User
  text,
  childComment, // Optional, array of references to Comment
  downVote, // Optional, array of references to User
  upVote, // Optional, array of references to User
  dateCreated // Optional
) {
  const commentDetail = {
    author,
    text,
  }

  if (childComment) commentDetail.childComment = childComment
  if (downVote) commentDetail.downVote = downVote
  if (upVote) commentDetail.upVote = upVote
  if (dateCreated) commentDetail.dateCreated = dateCreated

  const comment = new Comment(commentDetail)
  return comment.save()
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

async function createBotComments(usersList, amount) {
  if (amount <= 0) {
    throw new Error(
      'Amount must be a positive number and less than or equal to the number of users.'
    )
  }

  const baseDate = new Date('2022-01-01')
  const comments = []

  const getRandomUsers = (count, users) => {
    const shuffled = users.slice().sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  for (let i = 0; i < amount; i += 1) {
    const author = usersList[i % usersList.length] // Ensure the author is selected from the list of users
    const text = `I love cupcakes ${i}`
    // const text = createHmac('sha256', 'abcdefg')
    //   .update(`I love cupcakes ${i}`)
    //   .digest('hex');

    const numVotes = Math.floor(Math.random() * (usersList.length / 2)) // Random number of votes

    // Randomly choose a subset of users to be downvotes and upvotes
    const voteList = getRandomUsers(
      numVotes,
      usersList.filter((user) => user.toString() !== author.toString())
    )

    const downVotes = []
    const upVotes = []

    // Assign users to downvotes or upvotes randomly
    while (voteList.length > 0) {
      if (Math.random() > 0.7) {
        upVotes.push(voteList.pop())
      } else {
        downVotes.push(voteList.pop())
      }
    }

    const dateCreated = new Date(baseDate)
    dateCreated.setDate(baseDate.getDate() + i) // Increment date for each comment

    comments.push(
      createComment(author, text, undefined, downVotes, upVotes, dateCreated)
    )
  }

  // Wait for all comment creation promises to resolve
  const createdComments = await Promise.all(comments)

  console.log(`${amount} bot comments created successfully!`)

  // Return the list of created comments
  return createdComments
}

async function createBotMap(amount, userList, commentList) {
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
    const shuffled = filteredUsers.slice().sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const maps = []

  for (let i = 0; i < amount; i += 1) {
    // Randomly pick a geojson
    // const geojson = geojsonList[Math.floor(Math.random() * geojsonList.length)];

    // Generate title
    // const geojsonData = await GeoJSON.findById(geojson).exec(); // Assume GeoJSON is a Mongoose model for geojsonList

    const title = geojsonData.features[0].properties.name + ` ${i}`

    // Randomly select owner
    const owner = userList[Math.floor(Math.random() * userList.length)]

    // Randomly select map type
    const mapType = mapTypes[Math.floor(Math.random() * mapTypes.length)]

    // Generate like and dislike arrays
    const numVotes = Math.floor(Math.random() * (userList.length / 2))
    const voteList = getRandomUsers(numVotes, userList, owner)

    const downVotes = []
    const upVotes = []

    while (voteList.length > 0) {
      if (Math.random() > 0.7) {
        upVotes.push(voteList.pop())
      } else {
        downVotes.push(voteList.pop())
      }
    }

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
    const buffer = geobuf.encode(geojsonData, new Pbf())
    const finalBuffer = Buffer.from(buffer);

    // console.log(typeof buffer)

    // Create the map
    maps.push(
      createMap(
        title,
        owner,
        mapType,
        true, // isPublished
        finalBuffer, // Assuming geojson is a Buffer or compatible type
        undefined, // Optional thumbnail
        upVotes, // Likes
        downVotes, // Dislikes
        commentList, // Comments
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
