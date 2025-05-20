import crypto from 'crypto'
import { IUser, UserFields } from '@/core/_entities/types/user.types'
import { createUser } from '@/core/data-access/user/create-user.persistence'
import { APIResponse } from '@/core/_entities/types/api.types'
import { createErrorResponse } from '@/lib/utils'
import { getUsersByFields } from '@/core/data-access/user/get-user.persistence'

export default async function createUserUseCase(
  userData: UserFields
): Promise<APIResponse> {
  const {
    username,
    email,
    password,
    plan = 'free',
    profilePicture = '',
    favorite = [],
    dateCreated = new Date(),
    emailVerified = new Date(),
    providers = [],
  } = userData

  // Checking required fields
  const missingFields = []
  if (!username) missingFields.push('username')
  if (!email) missingFields.push('email')
  if (!password) missingFields.push('password')

  if (missingFields.length > 0) {
    return createErrorResponse(
      400,
      `Missing required user field(s): ${missingFields.join(', ')}`,
      `Missing required user field(s): ${missingFields.join(', ')}`
    )
  }

  // Check if email and crediential as provider exist in the db already
  const userWithEmail = await getUsersByFields({ email: email as string })

  // Check DB request errored
  if ('error' in userWithEmail) {
    return userWithEmail
  }
  const users = userWithEmail.payload as IUser[]

  // Check users is a singular user(since email is a unique field)
  if (users.length != 1) {
    return createErrorResponse(
      400,
      `Something wrong happened`,
      `There is dupicate user entry`
    )
  }

  if (users[0].providers.includes('crediential')) {
    return createErrorResponse(
      400,
      `Email already registered`,
      `Email found and credential is a provider`
    )
  }

  // Create a hashed password to be store in DB
  const salt = crypto.randomBytes(16).toString('hex')
  const hashedPassword = crypto
    .pbkdf2Sync(password as string, salt, 100, 64, 'sha256')
    .toString('hex')

  const dbRes = await createUser({
    username: username as string,
    email: email as string,
    password: hashedPassword,
    salt,
    plan,
    profilePicture,
    favorite,
    dateCreated,
    emailVerified,
    providers,
  })

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  // Return processed Map
  return {
    status: 200,
    message: 'Sucessfully Registered User',
  }
}
