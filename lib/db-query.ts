// OUTDATED: create uses-cases for the model in heres

import mongoose from 'mongoose'
import crypto from 'crypto'

import User from '@/models/user'
import Comment from '@/models/message'

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

  console.log(hashedPassword)
  if (plan) userDetail.plan = plan
  if (profilePicture) userDetail.profilePicture = profilePicture
  if (favorite) userDetail.favorite = favorite
  if (dateCreated) userDetail.dateCreated = dateCreated
  if (salt) userDetail.salt = salt
  if (hashedPassword) userDetail.password = hashedPassword

  const user = new User(userDetail)
  console.log(user)
  return user.save()
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
