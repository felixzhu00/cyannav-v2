import { APIResponse } from '@/core/_entities/types/api.types'
import dbConnect from '@/db/dbConnect'
import Map from '@/db/map.model'
import { createErrorResponse, handleDBError } from '@/lib/utils'
import { Types } from 'mongoose'

export async function deleteMapById(mapId: string): Promise<APIResponse> {
  try {
    await dbConnect()

    if (!Types.ObjectId.isValid(mapId)) {
      return createErrorResponse(
        400,
        'Invalid map ID',
        'Provided ID is not a valid ObjectId'
      )
    }

    const deletedMap = await Map.findByIdAndDelete(mapId)

    if (!deletedMap) {
      return createErrorResponse(
        404,
        'Map not found',
        `No map exists with ID: ${mapId}`
      )
    }

    return {
      status: 200,
      payload: deletedMap,
      message: 'Successfully deleted map',
    }
  } catch (error: any) {
    return handleDBError(error)
  }
}
