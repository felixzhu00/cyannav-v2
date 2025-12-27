import { Document, InferSchemaType } from 'mongoose'

import { userSchema } from '@/db/user.model'

export type IUser = Omit<
  InferSchemaType<typeof userSchema>,
  'profilePicture'
> & {
  profilePicture: Buffer | null;
};

export interface IUserDocument extends IUser, Document {}

// Populate User with only username
export interface PopulatedAuthor extends Pick<IUser, 'username'> {}

export interface UserFields extends Partial<IUserDocument> {}
