import { Document, Types } from 'mongoose'
import { IMapDocument } from './map.types'

// DB User Structure
export interface IUser {
  username: string
  email: string
  password?: string
  salt?: string
  profilePicture: Buffer | string
  favorite?: IMapDocument[] | IMapDocument['_id'][] | Types.ObjectId[] // Array of Map references
  dateCreated?: Date
  plan?: 'free' | 'pro'
  emailVerified: Date
  image?: String
  providers: string[] // e.g. ['github', 'credentials']
}
export interface IUserDocument extends IUser, Document {}

// Populate User with only username
export interface PopulatedAuthor extends Pick<IUser, 'username'> {}

export interface UserFields extends Partial<IUserDocument> {}
