import {
  getMapById,
  getMapsByFields,
  getStarredMapByUserId,
} from '@/core/data-access/map/get-map.persistence'
import { revalidatePath } from 'next/cache'
import { APIResponse } from '@/core/_entities/types/api.types'
import { IMapDocument, MapFields } from '@/core/_entities/types/map.types'
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

export async function getMapsByMapFieldsUseCase(
  mapFields: MapFields,
  option: 'union' | 'intersection' = 'union' // Default to 'union'
): Promise<APIResponse> {
  // Check if valid id is passed
  if (!mapFields) {
    return createErrorResponse(
      400,
      'Invalid Update Map Field(s)',
      'Map Field(s) can not be null, undefined, or empty key-value pair(s)'
    )
  }

  // Get Map object from DB
  const dbRes = await getMapsByFields(mapFields, option)

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  // map should be IMapDocument
  const maps = dbRes.payload as IMapDocument[]

  const transformedMap = maps.map((mapElement) => {
    return transformMap(mapElement)
  })

  // // Revalidate dashboard path
  // revalidatePath('/dashboard')

  // Return processed Map
  return {
    status: 200,
    message: 'Sucessfully Retrieved Maps Metadata',
    payload: transformedMap,
  }
}

export async function getFavoriteMapsByUserIdUseCase(
  id: string
): Promise<APIResponse> {
  // Check if valid id is passed
  if (!id) {
    return createErrorResponse(
      400,
      'Invalid Map ID',
      'Map ID can not be null, undefined, or empty string'
    )
  }

  // Get Map object from DB
  const dbRes = await getStarredMapByUserId(id)

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  // map should be IMapDocument
  const maps = dbRes.payload as IMapDocument[]

  // // Revalidate dashboard path
  // revalidatePath('/dashboard')

  // Return processed Map
  return {
    status: 200,
    message: 'Sucessfully Retrieved Maps Metadata',
    payload: maps,
  }
}
