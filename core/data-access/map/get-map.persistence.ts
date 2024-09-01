import { APIResponse } from '@/core/_entities/types/api.types'
import { IMapDocument } from '@/core/_entities/types/map.types'
import dbConnect from '@/db/dbConnect'
import Map from '@/db/map.model'
import { createErrorResponse, handleDBError } from '@/lib/utils'
import { Types } from 'mongoose'

export async function getMapById(id: string): Promise<APIResponse> {
  try {
    await dbConnect()

    // Check if the ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return createErrorResponse(
        400,
        'Invalid map ID format',
        'ID Should be of type mongoose ObjectId'
      )
    }

    const map: IMapDocument | null = await Map.findById(id)
      .populate('owner', 'username email')
      .populate({
        path: 'messages', // Populates the 'messages' field
        populate: {
          path: 'author', // Populates the 'author' field within each message
          select: 'username', // Only get the 'username' field from the User schema
        },
      })
      .populate('sharedUsers', 'username email')
      .lean()

    // Check if a Map is found in DB
    if (!map) {
      return createErrorResponse(
        400,
        'Map not found',
        'There is no map with ID in database'
      )
    }

    return {
      status: 200,
      message: 'Successfully retrieve map from Database',
      payload: map,
    }
  } catch (error) {
    return handleDBError(error)
  }
}
