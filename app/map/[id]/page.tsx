import MapEditPage from '@/components/map-editor/map-edit-page'
import {
  CustomFeature,
  CustomFeatureCollection,
} from '@/core/_entities/types/map.types'
import {
  MapSchemaDecoded,
  MapSchemaEncoded,
} from '@/core/_entities/z-schemas/map.schema'
import { decodeGeo } from '@/lib/utils'

export default async function MapPage({ params }: { params: { id: string } }) {
  const { id } = params

  if (!id || Array.isArray(id)) {
    return <p>Invalid ID</p>
  }

  try {
    // Fetch the data from the API route
    const response = await fetch(`http:/localhost:3000/api/map/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json()
      return <p>Error: {errorData.message}</p>
    }

    const map = await response.json()
    // Zod Check
    // const validateDBMap = MapSchemaEncoded.safeParse(map)

    // if (!validateDBMap.success) {
    //   throw new Error('Unexpected Map Encode Format')
    // }

    // // Decode map.geojson
    // const decodedGeo = decodeGeo(
    //   validateDBMap.data.geojson
    // ) as CustomFeatureCollection

    // // Insert _self and _shared if not in geojson
    // const updatedFeatures = decodedGeo.features.map(
    //   (feature: CustomFeature) => ({
    //     ...feature,
    //     _self: feature._self || new Map<string, string | number>(),
    //   })
    // )
    // const JsonFiledMap = {
    //   ...validateDBMap.data,
    //   geojson: {
    //     ...decodedGeo,
    //     features: updatedFeatures,
    //     _shared: decodedGeo._shared || new Map<string, string | number>(),
    //   },
    // }

    // Decode map.geojson
    const decodedGeo = decodeGeo(map.geojson) as CustomFeatureCollection

    // Insert _self and _shared if not in geojson
    const updatedFeatures = decodedGeo.features.map(
      (feature: CustomFeature) => ({
        ...feature,
        _self: feature._self || new Map<string, string | number>(),
      })
    )

    const JsonFiledMap = {
      ...map,
      geojson: {
        ...decodedGeo,
        features: updatedFeatures,
        _shared: decodedGeo._shared || new Map<string, string | number>(),
      },
    }

    // // Zod Check
    // const validateDecodedMap = MapSchemaDecoded.safeParse(JsonFiledMap)

    // if (!validateDecodedMap.success) {
    //   throw new Error('Unexpected Map Decoded Format')
    // }

    // if ('errors' in map) {
    //   return <p>Error: {map.message}</p>
    // }

    // Render the MapEditPage with the fetched map data
    return <MapEditPage initialMap={JsonFiledMap} />
  } catch (error) {
    return <p>Error fetching map</p>
  }
}
