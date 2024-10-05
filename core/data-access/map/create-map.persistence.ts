import { APIResponse } from '@/core/_entities/types/api.types'
import { IMap } from '@/core/_entities/types/map.types'
import Map from '@/db/map.model'
import { createErrorResponse, handleDBError } from '@/lib/utils'

export async function createMap(params: IMap): Promise<APIResponse> {
  try {
    // Ensure 'params' is not null or undefined before proceeding
    if (!params) {
      return createErrorResponse(
        400,
        'Params cannot be null or undefined',
        'Map Data does not conform to Map Schema'
      )
    }

    const map = new Map(params)
    await map.save()

    return {
      status: 200,
      payload: map,
      message: 'Successfully Added Map to DB',
    } // Return the saved map object
  } catch (error: any) {
    return handleDBError(error)
  }
}
