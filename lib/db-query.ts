import mongoose from 'mongoose'
import crypto from 'crypto'

import User from '@/models/user'
import Map from '@/models/map'
import Comment from '@/models/comment'

export async function createUser(
  username: string,
  email: string,
  password: string,
  plan?: 'free' | 'pro',
  profilePicture?: Buffer, // Optional parameter
  favorite?: mongoose.Types.ObjectId[], // Optional parameter
  dateCreated?: Date // Optional parameter
) {
  const userDetail: any = {
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
  if (hashedPassword) userDetail.hashedPassword = hashedPassword

  const user = new User(userDetail)
  return user.save()
}

export async function createMap(
  title: string,
  owner: mongoose.Types.ObjectId, // Assuming owner is a reference to a User
  mapType: string,
  isPublished: boolean,
  geojson: Buffer,
  thumbnail?: Buffer,
  like?: mongoose.Types.ObjectId[], // Optional
  dislike?: mongoose.Types.ObjectId[], // Optional
  comments?: mongoose.Types.ObjectId[], // Optional, assuming comments are references
  sharedUsers?: mongoose.Types.ObjectId[], // Optional
  forkedFrom?: mongoose.Types.ObjectId[], // Optional
  dateCreated?: Date // Optional
) {
  const mapDetail: any = {
    title,
    owner,
    mapType,
    isPublished,
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

export async function createComment(
  author: mongoose.Types.ObjectId, // Reference to a User
  text: string,
  childComment?: mongoose.Types.ObjectId[], // Optional, array of references to Comment
  downVote?: mongoose.Types.ObjectId[], // Optional, array of references to User
  upVote?: mongoose.Types.ObjectId[], // Optional, array of references to User
  dateCreated?: Date // Optional
) {
  const commentDetail: any = {
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
