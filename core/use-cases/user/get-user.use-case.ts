import { IUserDocument, UserFields } from '@/core/_entities/types/user.types'
import { getUsersByFields } from '@/core/data-access/user/get-user.persistence'

export async function getAUserIdByFields(userFields: UserFields) {
  // Check if valid id is passed
  if (!userFields) {
    return {
      status: 400,
      error: {
        context: 'getAUserIdByFields',
        issue: 'userFields can not be null, undefined, or empty string',
      },
      message: 'Invalid user fields',
    }
  }

  const dbRes = await getUsersByFields(userFields, 'union')

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  // map should be IMapDocument
  const users = dbRes.payload as IUserDocument[]

  // This Check if you get no or multiple users
  if (users.length === 0) {
    const fieldKeys = Object.keys(userFields)
    const fieldList = fieldKeys.join(', ')
    const messOp = fieldKeys.length > 1 ? `field(s):${fieldList}` : fieldList

    return {
      status: 404,
      error: {
        context: 'getAUserIdByFields',
        issue: `Unable to find user with ${messOp}`,
      },
      message: `Unable to find user with ${messOp}`,
    }
  }
  if (users.length > 1) {
    return {
      status: 404,
      error: {
        context: 'getAUserIdByFields',
        issue: 'Multiple users with field(s) are found',
      },
      message: 'Multiple users with field(s) are found',
    }
  }

  // Return the userId we are looking for

  return {
    status: 200,
    message: 'Sucessfully Retrieved User',
    payload: users[0]._id,
  }
}
