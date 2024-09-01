import { updateMapSharedUsers } from '@/core/data-access/map/update-map.persistence'
import { IMapDocument } from '@/core/_entities/types/map.types'
import { createErrorResponse } from '@/lib/utils'

export async function addUserToMapUseCase(
  id: string,
  userId: string,
  operation: 'add' | 'remove'
) {
  // Ensure the ID is valid
  if (!id) {
    return createErrorResponse(
      400,
      'Invalid Map ID',
      'Map Id can not be null, undefined, or empty string'
    )
  }
  if (!userId) {
    return createErrorResponse(
      400,
      'Invalid User ID',
      'User Id can not be null, undefined, or empty string'
    )
  }

  // Call the service to add user to map
  const dbRes = await updateMapSharedUsers(id, userId, operation)

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  // map should be IMapDocument
  const updatedMap = dbRes.payload as IMapDocument

  return {
    status: 200,
    message:
      operation === 'add'
        ? 'Successfully Added User'
        : 'Successfully Removed User',
    payload: updatedMap,
  }
}
