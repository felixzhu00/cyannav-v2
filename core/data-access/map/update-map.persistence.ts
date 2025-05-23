import { APIResponse } from '@/core/_entities/types/api.types'
import { MapFieldKey, MapFields } from '@/core/_entities/types/map.types'
import { IUserDocument } from '@/core/_entities/types/user.types'
import dbConnect from '@/db/dbConnect'
import Map from '@/db/map.model'
import { createErrorResponse, handleDBError } from '@/lib/utils'
import { Types } from 'mongoose'

export async function updateMapFieldsById(
  id: string,
  updateFields: MapFields
): Promise<APIResponse> {
  try {
    await dbConnect() // Ensure database connection

    // Check if the ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return createErrorResponse(
        400,
        'Invalid map ID format',
        'ID Should be of type mongoose ObjectId'
      )
    }

    // Ensure updateFields is not empty or undefined
    if (!updateFields || Object.keys(updateFields).length === 0) {
      const fields = updateFields
        ? Object.keys(updateFields).join(', ')
        : 'none'
      return createErrorResponse(
        400,
        'Update fields cannot be null, undefined, or empty',
        `Invalid update fields: ${fields}`
      )
    }

    // // Update the map in the database
    // const updatedMap = await Map.findByIdAndUpdate(
    //   id,
    //   updateFields, // Update fields based on the payload
    //   { new: true } // Return the updated document
    // )

    const shouldUpdateDate = Object.keys(updateFields).includes('geojson')

    console.log(shouldUpdateDate)
    const updatedMap = await Map.findByIdAndUpdate(
      id,
      {
        ...updateFields,
        ...(shouldUpdateDate && { dateUpdated: new Date() }), // only adds if geojson is present
      },
      { new: true }
    )

    // Check if a Map is found in DB
    if (!updatedMap) {
      return createErrorResponse(
        404,
        'Map not found',
        'No map with the specified ID in the database'
      )
    }

    return {
      status: 200,
      message: 'Successfully updated Map fields by ID ',
      payload: updatedMap,
    }
  } catch (error) {
    return handleDBError(error)
  }
}

export async function updateMapSharedUsers(
  mapId: string,
  userId: string,
  action: 'add' | 'remove'
) {
  try {
    // Check if the mapId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(mapId)) {
      return createErrorResponse(
        400,
        'Invalid map ID format',
        'Map ID should be of type mongoose ObjectId'
      )
    }
    if (!Types.ObjectId.isValid(mapId)) {
      return createErrorResponse(
        400,
        'Invalid user ID format',
        'User ID should be of type mongoose ObjectId'
      )
    }

    // Convert userId to an ObjectId for MongoDB
    const objectId = new Types.ObjectId(userId)

    // Retrieve the current state of sharedUsers
    const map = await Map.findById(mapId).select('sharedUsers owner')

    // Check if a Map is found in DB
    if (!map) {
      return createErrorResponse(
        400,
        'Map not found',
        'There is no map with ID in database'
      )
    }

    // Safely handle and type-cast sharedUsers
    const sharedUsers =
      (map.sharedUsers as (Types.ObjectId | IUserDocument['_id'])[]) || []

    // Check if each item is an ObjectId
    const sharedUsersWithoutOwner = sharedUsers.filter(
      (user) => user instanceof Types.ObjectId
    )

    // Append owner to shared user list
    const sharedUsersWithOwner = [
      ...sharedUsersWithoutOwner,
      map.owner as Types.ObjectId,
    ]

    // Init var for query
    let updateOperation
    let message: string = `Successfully ${action ? 'added' : 'removed'} user`

    if (action === 'add') {
      // Determine if user already in shared user list
      const sharedUsersListWhenAdding = sharedUsersWithOwner.some(
        (user) => user.toString() === userId
      )
      if (sharedUsersListWhenAdding) {
        // If userId is already in sharedUsers, no action needed
        message = 'User already have access to map'
      } else {
        updateOperation = { $addToSet: { sharedUsers: objectId } } // Add user without duplication
      }
    } else if (action === 'remove') {
      // Determine if user already not in shared user list
      const sharedUsersListWhenRemoving = sharedUsersWithoutOwner.some(
        (user) => user.toString() === userId
      )
      if (!sharedUsersListWhenRemoving) {
        // If userId is not in sharedUsers, no action needed
        message = 'User already does not have access to map'
      } else {
        updateOperation = { $pull: { sharedUsers: objectId } } // Remove user if present
      }
    } else {
      throw new Error('Invalid action specified. Use "add" or "remove".')
    }

    if (updateOperation) {
      const payload = await Map.findByIdAndUpdate(
        mapId,
        updateOperation,
        { new: true } // Return the updated document
      ).populate('sharedUsers', 'username email')

      if (!payload) {
        return createErrorResponse(
          404,
          'Map update failed',
          'Failed to update the map in the database'
        )
      }

      return { status: 200, message, payload }
    }

    return createErrorResponse(
      400,
      message,
      'Redundant map action in deleting/adding'
    )
  } catch (error) {
    return handleDBError(error)
  }
}

export async function toggleMapArrayFieldsById(
  mapid: string,
  itemId: Types.ObjectId,
  updateKey: MapFieldKey,
  operation: boolean // True: append, False: pop
): Promise<APIResponse> {
  try {
    await dbConnect() // Ensure database connection

    // Check if the ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(mapid) || !Types.ObjectId.isValid(itemId)) {
      return createErrorResponse(
        400,
        'Invalid ID format',
        'ID Should be of type mongoose ObjectId'
      )
    }

    // Toggle the map in the database
    let updatedMap

    if (operation) {
      updatedMap = await Map.findByIdAndUpdate(
        mapid,
        {
          $addToSet: { [updateKey]: itemId },
        },
        { new: true }
      )
    } else {
      updatedMap = await Map.findByIdAndUpdate(
        mapid,
        {
          $pull: { [updateKey]: itemId },
        },
        { new: true }
      )
    }

    // Check if a Map is found in DB
    if (!updatedMap) {
      return createErrorResponse(
        404,
        'Map not found',
        'No map with the specified ID in the database'
      )
    }

    return {
      status: 200,
      message: 'Successfully updated Map fields by ID ',
      payload: updatedMap,
    }
  } catch (error) {
    return handleDBError(error)
  }
}
