import { APIResponse } from '@/core/_entities/types/api.types'
import { IMapDocument, MapFields } from '@/core/_entities/types/map.types'
import dbConnect from '@/db/dbConnect'
import Map from '@/db/map.model'
import User from '@/db/user.model'
import { createErrorResponse, handleDBError } from '@/lib/utils'
import { FilterQuery, Types } from 'mongoose'

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

export async function getMapsByFields(
  mapFields: MapFields,
  option: 'union' | 'intersection' = 'union', // Default to 'union'
  fieldType: 'meta' | 'full' = 'meta'
): Promise<APIResponse> {
  try {
    await dbConnect()

    // Ensure updateFields is not empty or undefined
    if (!mapFields || Object.keys(mapFields).length === 0) {
      const fields = mapFields ? Object.keys(mapFields).join(', ') : 'none'
      return createErrorResponse(
        400,
        'Map fields cannot be null, undefined, or empty',
        `Invalid update fields: ${fields}`
      )
    }

    // Prepare the query object based on the 'option' parameter
    let query: FilterQuery<typeof Map>

    if (option === 'union') {
      // Use `$or` operator for a union of fields
      query = {
        $or: Object.entries(mapFields).map(([key, value]) => ({
          [key]: value,
        })),
      }
    } else {
      // Use the fields directly for an intersection of fields
      query = mapFields as FilterQuery<typeof Map>
    }

    let maps

    if (fieldType == 'meta') {
      // Return only meta data json
      maps = await Map.find(query)
        .select(
          'title owner isPublished isTemplate mapType thumbnail dateCreated geojson likes dislikes sharedUsers'
        )
        .populate('owner', 'username')
        .lean()
    } else {
      // For now this is full(used for map)
      maps = await Map.find(query)
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
    }

    // Check if Users are found in DB
    if (!maps) {
      return createErrorResponse(
        400,
        'No map with the specified fields in the database',
        'Map(s) not found'
      )
    }

    return {
      status: 200,
      message: 'Successfully retrieve map(s)',
      payload: maps,
    }
  } catch (error) {
    return handleDBError(error)
  }
}

export async function getStarredMapByUserId(id: string): Promise<APIResponse> {
  try {
    await dbConnect()

    // Check if the ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return createErrorResponse(
        400,
        'Invalid uder ID format',
        'ID Should be of type mongoose ObjectId'
      )
    }

    // Find user with id and only query for the starredMaps field
    const user = await User.findOne({ _id: id }, { favorite: 1 })

    // Check if a User is found in DB
    if (!user) {
      return createErrorResponse(
        400,
        'User not found',
        'There is no user with ID in database'
      )
    }

    const favoriteMaps = user.favorite

    // Query the ids and return a populated version of all maps
    const populateFavoriteMaps = await Map.find({
      _id: { $in: favoriteMaps },
    })

    // Check if a User is found in DB
    if (!populateFavoriteMaps) {
      return createErrorResponse(
        400,
        'Unsuccessful in retrieve starred maps',
        'DB error trying to get starred maps'
      )
    }
    return {
      status: 200,
      message: 'Successfully retrieve maps from Database',
      payload: populateFavoriteMaps,
    }
  } catch (error) {
    return handleDBError(error)
  }
}
