import { getMapById } from '@/core/data-access/map/get-map.persistence'
import { revalidatePath } from 'next/cache'
import { APIResponse } from '@/core/_entities/types/api.types'
import { IMapDocument } from '@/core/_entities/types/map.types'
import { createErrorResponse, transformMap } from '@/lib/utils'

export async function getMapUseCase(id: string): Promise<APIResponse> {
  // Check if valid id is passed
  if (!id) {
    return createErrorResponse(
      400,
      'Invalid Map ID',
      'Map ID can not be null, undefined, or empty string'
    )
  }

  // Get Map object from DB
  const dbRes = await getMapById(id)

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  // map should be IMapDocument
  const map = dbRes.payload as IMapDocument

  // Change map to desired shape
  const transformedMap = transformMap(map)

  // Revalidate Map ID path
  revalidatePath(`/map/${id}`)

  // Return processed Map
  return {
    status: 200,
    message: 'Sucessfully Retrieved Map',
    payload: transformedMap,
  }
}
