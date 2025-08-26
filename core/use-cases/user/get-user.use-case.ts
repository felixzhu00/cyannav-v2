import { IUserDocument, UserFields } from '@/core/_entities/types/user.types'
import { getUsersByFields } from '@/core/data-access/user/get-user.persistence'
import { createErrorResponse } from '@/lib/utils'

export async function getAUserIdByFieldsUseCase(userFields: UserFields) {
  // Check if valid id is passed
  if (!userFields) {
    return createErrorResponse(
      400,
      'userFields can not be null, undefined, or empty string',
      'Invalid user fields'
    )
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

    return createErrorResponse(
      404,
      `Unable to find user with ${messOp}`,
      `Unable to find user with ${messOp}`
    )
  }
  if (users.length > 1) {
    return createErrorResponse(
      404,
      'Multiple users with field(s) are found',
      'Multiple users with field(s) are found'
    )
  }

  // Return the userId we are looking for
  return {
    status: 200,
    message: 'Sucessfully Retrieved User',
    payload: users[0]._id,
  }
}
