import { revalidatePath } from 'next/cache'
import { IMapDocument, MapFields } from '@/core/_entities/types/map.types'
import { updateMapFieldsById } from '@/core/data-access/map/update-map.persistence'
import { APIResponse } from '@/core/_entities/types/api.types'
import { createErrorResponse } from '@/lib/utils'

export async function updateMapFieldsUseCase(
  id: string,
  updateFields: MapFields
): Promise<APIResponse> {
  // Check if valid id is passed
  if (!id) {
    return createErrorResponse(
      400,
      'Invalid Map ID',
      'Map ID can not be null, undefined, or empty string'
    )
  }
  if (!updateFields) {
    return createErrorResponse(
      400,
      'Invalid Update Map Field(s)',
      'Map Field(s) can not be null, undefined, or empty key-value pair(s)'
    )
  }

  // Update Map object in DB
  const dbRes = await updateMapFieldsById(id, updateFields)

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  // map should be IMapDocument
  const updatedMap = dbRes.payload as IMapDocument

  // Revalidate the specific path after the map is updated
  revalidatePath(`/map/${id}`)

  // Get Keys of param
  const keys = Object.keys(updateFields)

  return {
    status: 200,
    message: `Map ${keys.length === 1 ? keys[0] : keys} updated successfully`,
    payload: updatedMap,
  }
}
