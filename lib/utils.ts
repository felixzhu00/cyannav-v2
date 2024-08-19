import geobuf from 'geobuf'
import Pbf from 'pbf'
import { type ClassValue, clsx } from 'clsx'
import { FeatureCollection } from 'geojson'
import { twMerge } from 'tailwind-merge'

// eslint-disable-next-line import/prefer-default-export
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeGeo(geojsonData: FeatureCollection | undefined) {
  if (!geojsonData) return new Uint8Array()

  const buffer = geobuf.encode(geojsonData, new Pbf())
  const finalBuffer = Buffer.from(buffer)
  return finalBuffer
}

export function decodeGeo(geojsonBuffer: Buffer | undefined) {
  if (!geojsonBuffer) return new Uint8Array()

  const geo = geobuf.decode(new Pbf(geojsonBuffer))
  return geo
}
