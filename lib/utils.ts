import geobuf from 'geobuf'
import Pbf from 'pbf'
import { type ClassValue, clsx } from 'clsx'
import { FeatureCollection } from 'geojson'
import { twMerge } from 'tailwind-merge'

const emptyFeatureCollection: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

// eslint-disable-next-line import/prefer-default-export
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeGeo(geojsonData: FeatureCollection | undefined) {
  if (!geojsonData) return emptyFeatureCollection

  const buffer = geobuf.encode(geojsonData, new Pbf())
  const finalBuffer = Buffer.from(buffer)
  return finalBuffer
}

export function decodeGeo(
  geojsonBuffer: { type: string; data: number[] } | undefined
) {
  if (!geojsonBuffer) return emptyFeatureCollection

  // Convert JSON representation to Buffer
  const buffer = Buffer.from(new Uint8Array(geojsonBuffer.data))

  // Decode the Buffer using geobuf
  const geo = geobuf.decode(new Pbf(buffer))
  return geo as FeatureCollection
}