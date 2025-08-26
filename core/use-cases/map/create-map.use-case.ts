import { APIResponse } from '@/core/_entities/types/api.types'
import { IMapDocument, MapFields } from '@/core/_entities/types/map.types'
import { createMap } from '@/core/data-access/map/create-map.persistence'
import { createErrorResponse } from '@/lib/utils'

export async function createMapUseCase(
  mapFields: MapFields
): Promise<APIResponse> {
  // check if IMap.owner, IMap.mapType IMap.geojson, IMap.title(these are required)

  const { owner, mapType, geojson, title } = mapFields

  if (!owner || !mapType || !geojson || !title) {
    return createErrorResponse(
      400,
      'Require field(s) not given',
      'mapFields can not be null, undefined, or empty string'
    )
  }

  // Get Map object from DB
  const dbRes = await createMap(mapFields)

  // Check DB request errored
  if ('error' in dbRes) {
    return dbRes
  }

  // the new Map that is created
  const map = dbRes.payload as IMapDocument

  // Return processed Map
  return {
    status: 200,
    message: 'Sucessfully created Map',
    payload: map,
  }
}
