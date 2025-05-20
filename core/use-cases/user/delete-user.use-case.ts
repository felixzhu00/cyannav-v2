import deleteUserById from '@/core/data-access/user/delete-user.persistence'
import { createErrorResponse } from '@/lib/utils'

export default async function deleteUserUseCase(userId: string) {
  
  // Check if User ID is valid
  if (!userId)
    return createErrorResponse(
      400,
      'User ID is required',
      'Map ID can not be null, undefined, or empty string'
    )

  const dbRes = await deleteUserById(userId)

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  return {
    status: 200,
    message: 'User has been deleted',
    payload: true,
  }

  
}
