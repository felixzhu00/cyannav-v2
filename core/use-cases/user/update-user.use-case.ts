import { updateUserFieldsById } from '@/core/data-access/user/update-user.persistence'
import { createErrorResponse } from '@/lib/utils'

export default async function UpdateUserPlanUseCase(
  id: string,
  newUsername: string
) {
  // Check if username is valid
  if (!newUsername)
    return createErrorResponse(
      400,
      'Username is required',
      'The user did not provide a username'
    )

  // Check if ID is valid
  if (!id)
    return createErrorResponse(
      400,
      'ID is required',
      'ID param missing or invalid'
    )

  const dbRes = await updateUserFieldsById(id, {
    plan: 'pro',
  })

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  return {
    status: 200,
    message: 'New username has been saved',
    payload: true,
  }
}
