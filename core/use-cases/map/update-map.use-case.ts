import { revalidatePath } from 'next/cache'
import {
  IMapDocument,
  MapFieldKey,
  MapFields,
} from '@/core/_entities/types/map.types'
import {
  toggleMapArrayFieldsById,
  updateMapFieldsById,
} from '@/core/data-access/map/update-map.persistence'
import { APIResponse } from '@/core/_entities/types/api.types'
import { createErrorResponse } from '@/lib/utils'
import { Types } from 'mongoose'
import { getMapsByFields } from '@/core/data-access/map/get-map.persistence'

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

export async function toggleMapArrayFieldsByIdUseCase(
  mapId: string, //MapId
  itemId: Types.ObjectId, // e.g. UserID
  updateKey: MapFieldKey // e.g. Like[]
): Promise<APIResponse> {
  // Check if valid id is passed
  if (!mapId) {
    return createErrorResponse(
      400,
      'Invalid Map ID',
      'Map ID can not be null, undefined, or empty string'
    )
  }
  if (!itemId) {
    return createErrorResponse(
      400,
      'Invalid Toggle Item ID',
      'Toggle Item ID can not be null, undefined, or empty string'
    )
  }

  if (!updateKey) {
    return createErrorResponse(
      400,
      'Invalid Update Key',
      'Update Key can not be null, undefined, or empty string'
    )
  }

  // Look in may for current status of toggle
  const mapRes = await getMapsByFields({ _id: mapId })

  if ('error' in mapRes) {
    return mapRes
  }

  // Check if current key list contain the item
  const mapResList = mapRes.payload // This could be a list of Maps but we assume single item

  if (!mapResList)
    return createErrorResponse(
      400,
      'Payload empty',
      'Data access layer return an empty payload'
    )

  // Create toggle to value base on current map status
  const toggleTo = (mapResList as IMapDocument[])[0][updateKey].includes(itemId)

  // Toggle the item in the key list in the map
  const dbRes = await toggleMapArrayFieldsById(
    mapId,
    itemId,
    updateKey,
    toggleTo
  )

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  return {
    status: 200,
    message: `Sucessfully Toggled`,
    payload: dbRes,
  }
}


