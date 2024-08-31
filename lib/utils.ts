import geobuf from 'geobuf'
import Pbf from 'pbf'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  FeatureCollection,
  Geometry,
  GeometryCollection,
  GeoJSON,
} from 'geojson'
import {
  CustomFeature,
  CustomFeatureCollection,
} from '@/core/_entities/types/map.types'
import { nanoid } from 'nanoid'

// eslint-disable-next-line import/prefer-default-export
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeGeo(geojsonData: CustomFeatureCollection) {
  const buffer = geobuf.encode(geojsonData, new Pbf())
  const finalBuffer = Buffer.from(buffer)
  return finalBuffer
}

export function decodeGeo(geojsonBuffer: { type: string; data: number[] }) {
  // Convert JSON representation to Buffer
  const buffer = Buffer.from(new Uint8Array(geojsonBuffer.data))

  // Decode the Buffer using geobuf
  const geo = geobuf.decode(new Pbf(buffer))

  return geo as FeatureCollection
}

// Use during import new map
export function convertToCustomFeatureCollection(
  geojson: GeoJSON
): CustomFeatureCollection {
  if (geojson.type === 'FeatureCollection') {
    const postGeo = geojson.features.map((feature) => ({
      ...feature,
      id: nanoid(),
      _self: new Map<string, string | number>(),
    }))

    const finalGeo = {
      type: 'FeatureCollection',
      features: postGeo,
      _shared: new Map<string, string | number>(),
    }

    return finalGeo as CustomFeatureCollection
  }

  if (geojson.type === 'Feature') {
    const finalGeo = {
      ...geojson,
      id: nanoid(),
      _self: new Map<string, string | number>(),
    }

    return {
      type: 'FeatureCollection',
      features: [finalGeo as CustomFeature],
      _shared: new Map<string, string | number>(),
    }
  }

  if (geojson.type === 'GeometryCollection') {
    // Wrap GeometryCollection in a Feature
    return {
      type: 'FeatureCollection',
      features: [
        {
          id: nanoid(),
          type: 'Feature',
          geometry: geojson as GeometryCollection,
          properties: {},
          _self: new Map<string, string | number>(),
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
        id: nanoid(),
        type: 'Feature',
        geometry: geojson as Geometry,
        properties: {},
        _self: new Map<string, string | number>(),
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

export function editFeatureSelf(
  currentGeo: CustomFeatureCollection,
  featureId: string,
  key: string,
  value: any,
  action: 'addOrUpdate' | 'remove',
  property?: boolean
) {
  // Find the feature by its ID
  const featureIndex = currentGeo.features.findIndex(
    (feature) => feature.id === featureId
  )

  // Feature not found in geojson
  if (featureIndex === -1) {
    return currentGeo
  }

  // Copy the current feature
  const currentFeature = { ...currentGeo.features[featureIndex] }
  let currentSelf = currentFeature._self

  if (property) {
    currentSelf = currentFeature.properties || {}
  }

  if (action === 'addOrUpdate') {
    if (value !== undefined) {
      // Add or update the key-value pair
      currentSelf[key] = value
      console.log(key, value, 'asddasd',currentSelf)
    }
  } else if (action === 'remove') {
    // Remove the key from _self
    delete currentSelf[key]
  }

  if (property) {
    currentFeature.properties = currentSelf
  } else {
    // Update the feature with the modified _self
    currentFeature._self = currentSelf
  }

  // Replace the modified feature in the geojson features array
  const updatedFeatures = [...currentGeo.features]
  updatedFeatures[featureIndex] = currentFeature

  const newGeo = {
    ...currentGeo,
    features: updatedFeatures,
  }
  console.log(newGeo)


  return newGeo
}

export function editAllFeatureSelf(
  currentGeo: CustomFeatureCollection,
  key: string,
  value: any,
  action: 'addOrUpdate' | 'remove',
  property?: boolean
) {
  // Iterate over each feature in geojson.features and update _self
  const updatedFeatures = currentGeo.features.map((feature) => {
    let currentSelf = feature._self

    if (property) {
      currentSelf = feature.properties || {}
    }

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

  return newGeo
}
