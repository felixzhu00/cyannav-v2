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
