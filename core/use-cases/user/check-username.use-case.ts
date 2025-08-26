import { getUsersByFields } from '@/core/data-access/user/get-user.persistence'
import { createErrorResponse } from '@/lib/utils'

export default async function checkUsernameUseCase(newUsername: string) {
  if (!newUsername)
    return createErrorResponse(
      400,
      'Username is required',
      'Username can not be null, undefined, or empty string'
    )

  const dbRes = await getUsersByFields({ username: newUsername })

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  return { status: 200, message: 'Username is available.', payload: true }
}
