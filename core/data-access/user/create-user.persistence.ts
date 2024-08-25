import crypto from 'crypto'
import User from '@/db/user.model'
import { IUser } from '@/core/_entities/types/user.types'

export async function createUser(params: IUser) {
  // Destructure Param
  const {
    username,
    email,
    password,
    plan,
    profilePicture,
    favorite,
    dateCreated,
  } = params

  // Hash Password
  const salt = crypto.randomBytes(16).toString('hex')
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 100, 64, 'sha256') // TODO remeber to concatnate env secret to password
    .toString('hex')

  // Create User Map
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

  // Insert User Into DB
  const user = new User(userDetail)
  return user.save()
}
