import geobuf from 'geobuf'
import Pbf from 'pbf'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  FeatureCollection,
  Geometry,
  GeometryCollection,
  GeoJSON,
  Feature,
  GeoJsonProperties,
} from 'geojson'
import {
  CustomFeature,
  CustomFeatureCollection,
  IMapDocument,
} from '@/core/_entities/types/map.types'
import { nanoid } from 'nanoid'
import { APIResponse } from '@/core/_entities/types/api.types'
import { IUserDocument } from '@/core/_entities/types/user.types'
import { IMessageDocument } from '@/core/_entities/types/messages.types'
import { Types } from 'mongoose'
import { toast } from '@/components/ui/use-toast'
import { populateDefault } from './maplibre-actions/map-utils'
import { initializeOffScreenMapDiv } from './generate-image'
import shp from 'shpjs'
import { kml as kmlToGeoJSON } from '@tmcw/togeojson'

// eslint-disable-next-line import/prefer-default-export
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const strToLowerAndDash = (str: string) => {
  str.toLowerCase().replace(/\s+/g, '-')
}

export function encodeGeo(geojsonData: CustomFeatureCollection) {
  const buffer = geobuf.encode(geojsonData, new Pbf())
  const finalBuffer = Buffer.from(buffer)
  return finalBuffer
}

export function decodeGeo(geojsonBuffer: Buffer) {
  // Convert the buffer into a Uint8Array directly
  const uint8Array = new Uint8Array(geojsonBuffer);

  // Decode geobuf
  const geo = geobuf.decode(new Pbf(uint8Array)) as CustomFeatureCollection;

  // Populate defaults
  const defaultFeatureList = geo.features.map((feature) =>
    populateDefault(feature)
  );

  return {
    ...geo,
    features: defaultFeatureList,
  };
}


// Use during import new map
export function convertToCustomFeatureCollection(
  geojson: GeoJSON
): CustomFeatureCollection {
  if (geojson.type === 'FeatureCollection') {
    const postGeo = geojson.features.map((feature, index) => {
      const tempId = nanoid(32) // Declare tempId inside the map function
      return {
        ...feature,
        id: tempId, // Set the feature's id to the generated tempId
        properties: {
          id: tempId, // Also include the tempId in the properties
          render: {
            name: {
              payload: feature.properties?.name || `Feature${index}`,
              variableType: 'string',
            },
            visible: {
              payload: true,
              variableType: 'boolean',
            },
            lock: {
              payload: false,
              variableType: 'boolean',
            },
            draw: {
              payload: 'feature',
              variableType: 'string',
            },
            trash: {
              payload: false,
              variableType: 'boolean',
            },
          },
          old: {
            ...feature.properties,
          },
        },
      }
    })

    const finalGeo = {
      type: 'FeatureCollection',
      features: postGeo,
      _shared: { mode: 'none' },
    }

    return finalGeo as CustomFeatureCollection
  }

  if (geojson.type === 'Feature') {
    const finalGeo = {
      ...geojson,
      properties: {
        ...geojson.properties,
        _id: nanoid(),
        _self: {
          name: geojson.properties?.name || `Feature`,
          _visible: true,
          _lock: false,
        },
      },
    }

    return {
      type: 'FeatureCollection',
      features: [finalGeo] as CustomFeature[], // Could be different type
      _shared: new Map<string, string | number>(),
    }
  }

  if (geojson.type === 'GeometryCollection') {
    // Wrap GeometryCollection in a Feature
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: geojson as GeometryCollection,
          properties: {
            _id: nanoid(),
            _self: {
              name: `Feature`,
              _visible: true,
              _lock: false,
            },
          },
          id: '',
        },
      ],
      _shared: new Map<string, string | number>(),
    }
  }

  // Assume it's a Geometry type
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: geojson as Geometry,
        properties: {
          _id: nanoid(),
          _self: {
            name: `Feature`,
            visible: true,
            lock: false,
          },
        },
        id: '',
      },
    ],
    _shared: new Map<string, string | number>(),
  }
}

export function editGeoShared(
  currentGeo: CustomFeatureCollection,
  key: string,
  value: any,
  action: 'addOrUpdate' | 'remove'
) {
  // Create a new Map instance based on the current _shared Map
  const newShared = currentGeo._shared

  if (action === 'addOrUpdate') {
    if (value !== undefined) {
      // Add or update the key with the new value
      newShared[key] = value
    }
  } else if (action === 'remove') {
    // Remove the key from the Map
    delete newShared[key]
  }

  const newGeo = {
    ...currentGeo,
    _shared: newShared,
  }

  return newGeo
}
export function editGeoSharedNested(
  currentGeo: CustomFeatureCollection,
  key: string,
  value: any,
  action: 'addOrUpdate' | 'remove'
) {
  const mapMode = currentGeo._shared.mode
  // Create a new Map instance based on the current _shared Map
  const newMapMode = currentGeo._shared[mapMode] || {}

  if (action === 'addOrUpdate') {
    if (value !== undefined) {
      // Add or update the key with the new value
      newMapMode[key] = value
    }
  } else if (action === 'remove') {
    // Remove the key from the Map
    delete newMapMode[key]
  }

  const newGeo = {
    ...currentGeo,
    _shared: {
      ...currentGeo._shared,
      [mapMode]: newMapMode,
    },
  }

  return newGeo
}

export function editFeatureSelf(
  currentGeo: CustomFeatureCollection,
  featureId: string,
  key: string,
  value: any,
  action: 'addOrUpdate' | 'remove'
) {
  // Find the feature by its ID
  const featureIndex = currentGeo.features.findIndex(
    (feature) => feature?.properties?.id === featureId
  )
  // Feature not found in geojson
  if (featureIndex === -1) {
    return currentGeo
  }

  // Copy the current feature
  const currentFeature = { ...currentGeo.features[featureIndex] }

  // See if properties exisit on currentGeo (Should exisit if properly imported)
  if (!currentFeature.properties?.render) return currentGeo

  const currentSelf = currentFeature.properties.render

  if (action === 'addOrUpdate') {
    if (value !== undefined) {
      // Add or update the key-value pair
      currentSelf[key] = value
    }
  } else if (action === 'remove') {
    // Remove the key from
    delete currentSelf[key]
  }

  // Update the feature with the modified
  currentFeature.properties.render = currentSelf

  // Replace the modified feature in the geojson features array
  const updatedFeatures = [...currentGeo.features]
  updatedFeatures[featureIndex] = currentFeature

  const newGeo = {
    ...currentGeo,
    features: updatedFeatures,
  }

  return newGeo
}

export function editAllFeatureSelf(
  currentGeo: CustomFeatureCollection,
  key: string,
  value: any,
  action: 'addOrUpdate' | 'remove'
) {
  // Iterate over each feature in geojson.features and update _self
  const updatedFeatures = currentGeo.features.map((feature) => {
    if (!feature.properties) return currentGeo
    const currentSelf = feature.properties

    if (action === 'addOrUpdate') {
      if (value !== undefined) {
        // Add or update the key-value pair
        currentSelf[key] = value
      }
    } else if (action === 'remove') {
      // Remove the key from _self
      delete currentSelf[key]
    }

    // Return the updated feature with modified _self
    return {
      ...feature,
      _self: currentSelf,
    }
  })

  const newGeo = {
    ...currentGeo,
    features: updatedFeatures,
  }

  return newGeo as CustomFeatureCollection
}

export function updateFeature(
  oldGeo: CustomFeatureCollection,
  newFeature: CustomFeature
): CustomFeatureCollection {
  // Filter out the feature with the matching ID from the oldGeo features
  const filteredFeatures = oldGeo.features.filter(
    (feature) => feature.id !== newFeature.id
  )

  let updatedFeatures

  if (filteredFeatures.length !== oldGeo.features.length) {
    // Append the newFeature to the filtered list
    updatedFeatures = [...filteredFeatures, newFeature]
  } else {
    // If feature does does not exist before
    const newFeaturePopulated = {
      ...newFeature,
      properties: {
        ...newFeature.properties,
        render: {
          ...newFeature.properties?.render,
          // Replace exisitng name if new
          name: {
            payload: `Feature${filteredFeatures.length}`,
            variableType: 'string',
          },
        },
      },
    }
    // Append the newFeature to the filtered list
    updatedFeatures = [...filteredFeatures, newFeaturePopulated]
  }

  // Return the new GeoJSON object with the updated features
  const newGeo = {
    ...oldGeo,
    features: updatedFeatures,
  }

  return newGeo
}

export function handleDBError(error: any): APIResponse {
  let status = 500
  let issue = 'Unexpected error occurred'
  let message = 'An unexpected error occurred while processing your request.'

  if (error instanceof mongoose.Error.ValidationError) {
    status = 400
    issue = `Validation error: ${error.message}`
    message = 'Validation failed.'
  } else if (error instanceof mongoose.Error.CastError) {
    status = 400
    issue = `Invalid format: ${error.message}`
    message = 'Invalid input format.'
  } else if (error instanceof mongoose.Error.ConnectionError) {
    status = 500
    issue = `Database connection error: ${error.message}`
    message = 'Database connection issue.'
  } else if (error instanceof mongoose.Error) {
    // Generic Mongoose error
    issue = `Mongoose error: ${error.message}`
    message = 'A database error occurred.'
  } else {
    // Handle any non-Mongoose errors
    issue = `General error: ${error.message}`
    message = 'An error occurred while processing your request.'
  }

  return {
    status,
    error: issue,
    message,
  }
}

function isUserDocument(user: any): user is IUserDocument {
  return user && typeof user === "object" && "username" in user;
}

export function transformMap(map: IMapDocument) {
  return {
    ...map,
    owner: (() => {
      const owner = map.owner as unknown as IUserDocument | Types.ObjectId;

      if (isUserDocument(owner)) {
        return {
          _id: owner._id?.toString() || '',
          username: owner.username || '',
          email: owner.email || '',
        };
      }

      // Unpopulated fallback
      return {
        _id: owner.toString(),
        username: '',
        email: '',
      };
    })(),

    geojson: map.geojson ? Buffer.from(map.geojson.buffer) : undefined,
    thumbnail: map.thumbnail ? Buffer.from(map.thumbnail.buffer) : undefined,

    messages: map.messages?.map((msg) => {
      const m = msg as unknown as IMessageDocument; // safe cast after `unknown`

      const author = m.author as unknown as IUserDocument | Types.ObjectId;

      return {
        ...m,
        author: isUserDocument(author) ? author.username : author.toString(),
      };
    }),

    sharedUsers: map.sharedUsers?.map((u) => {
      const user = u as unknown as IUserDocument | Types.ObjectId;

      if (isUserDocument(user)) {
        return {
          username: user.username || '',
          email: user.email || '',
        };
      }
      return {
        username: '',
        email: '',
      };
    }) || [],

    forkedFrom: map.forkedFrom?.toString(),
    likes: map.likes?.map((id) => id.toString()),
  };
}

export function createErrorResponse(
  status: number,
  message: string,
  error: string
): APIResponse {
  return {
    status,
    error,
    message,
  }
}

export async function editMapGeo(
  mapGeo: CustomFeatureCollection,
  mapId: string,
  currLayerId: string,
  key: string,
  value: { [key: string]: any } | string,
  updateOption: 'addOrUpdate' | 'remove',
  editFunction: string
) {
  if (!mapGeo || !mapId || !currLayerId) return null

  let newGeo = mapGeo

  if (editFunction === 'editGeoShared') {
    newGeo = editGeoShared(mapGeo, key, value, updateOption)
  }
  if (editFunction === 'editGeoSharedNested') {
    newGeo = editGeoSharedNested(mapGeo, key, value, updateOption)
  }

  if (editFunction === 'editFeatureSelf') {
    newGeo = editFeatureSelf(mapGeo, currLayerId, key, value, updateOption)
  }
  if (editFunction === 'editAllFeatureSelf') {
    newGeo = editAllFeatureSelf(mapGeo, key, value, updateOption)
  }
  return updateGeoJSONAPI(newGeo, mapId)
}

export async function updateGeoJSONAPI(
  newGeo: CustomFeatureCollection,
  mapId: string
) {
  try {
    // Generate blob with geojson
    const blob = await initializeOffScreenMapDiv(newGeo)

    // Encode geoJSON
    const encodedGeoJSON = encodeGeo(newGeo)

    // Use Form data to send over data to server
    const formData = new FormData()
    formData.append('thumbnail', blob)
    formData.append('geojson', JSON.stringify(encodedGeoJSON))

    // Call Put API
    const response = await fetch(`/api/map/${mapId}`, {
      method: 'PUT',
      body: formData,
    })

    const result = await response.json()

    toast({
      description: result.message,
    })
    return result
  } catch (error) {
    toast({
      description: 'An error occurred while updating the geojson',
    })
    return error
  }
}

// export async function updateGeoJSONAPI(
//   newGeo: CustomFeatureCollection,
//   mapId: string
// ) {
//   try {
//     // Encode geoJSON
//     const encodedGeoJSON = encodeGeo(newGeo)

//     // Call Put API
//     const response = await fetch(`/api/map/${mapId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ geojson: encodedGeoJSON }),
//     })

//     const result = await response.json()

//     toast({
//       description: result.message,
//     })
//     return result
//   } catch (error) {
//     toast({
//       description: 'An error occurred while updating the geojson',
//     })
//     return error
//   }
// }

// Function to find min and max of a property
export function findMinMax(
  propertyName: string,
  geojson: CustomFeatureCollection
): {
  min: number | undefined
  max: number | undefined
} {
  // Extract the property values and filter out non-numeric values
  const { features } = geojson

  return features.reduce<{
    min: number | undefined
    max: number | undefined
  }>(
    (acc, feature) => {
      if (feature.properties) {
        // Check if properties is not null
        const value = feature.properties[propertyName]
        if (typeof value === 'number') {
          if (acc.min === undefined || value < acc.min) acc.min = value
          if (acc.max === undefined || value > acc.max) acc.max = value
        }
      }
      return acc
    },
    { min: undefined, max: undefined }
  )
}

export const isValidHex = (str: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(str)

export const propNameToString = (str: string) =>
  str
    .split('-') // Split the string by dashes
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each part
    .join(' ') // Join them back with spaces}

//create a instace

export const parseKML = (fileData: string) => {
  const kmlDom = new DOMParser().parseFromString(fileData, 'text/xml')
  const geojson = kmlToGeoJSON(kmlDom)
  return geojson
}

export const parseShapefile = async (file: string | File | ArrayBuffer) => {
  let arrayBuffer: ArrayBuffer

  if (typeof file === 'string') {
    // Convert string to ArrayBuffer using TextEncoder
    const uint8array = new TextEncoder().encode(file)
    arrayBuffer = uint8array.slice().buffer
  } else if (file instanceof File) {
    arrayBuffer = await file.arrayBuffer()
  } else {
    arrayBuffer = file
  }

  const geojson = await shp(arrayBuffer)
  return geojson
}

// export const handleUseTemplate = async (geojson: Buffer, title: string) => {
//   try {
//     // API call to create a new map for user under my maps
//     const res = await fetch(`/api/map`, {
//       method: 'POST',
//       body: JSON.stringify({ geojson, title }),
//       cache: 'no-store',
//     })

//     console.log(res)

//     // if fail toast and go back to templates
//     if (!res.ok) {
//       toast({
//         description: 'Fail to create Map',
//       })
//     }

//     const data = await res.json()

//     // If sucsess direct user to new map/[id]
//     router.push(`/map/${data.payload}`)
//   } catch (error) {
//     console.error(error)
//   }
// }
export const handleUseTemplate = async (
  geojson: Buffer,
  title: string,
  thumbnail: Buffer
) => {
  try {
    const formData = new FormData()

    // Convert Buffers to Blob
    const thumbnailBlob = new Blob([new Uint8Array(thumbnail)], {
      type: 'image/png',
    })

    formData.append('geojson', JSON.stringify(geojson))
    formData.append('title', title)
    formData.append('thumbnail', thumbnailBlob)

    const res = await fetch('/api/map', {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    })

    // if fail toast and go back to templates
    if (!res.ok) {
      toast({
        description: 'Fail to create Map',
      })
    }

    const data = await res.json()

    // If sucsess direct user to new map/[id]
    return `/map/${data.payload}`
  } catch (error) {
    console.error(error)
  }
}
