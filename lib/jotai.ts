import { MapSchemaDecodedType } from '@/core/_entities/z-schemas/map.schema'
import { atom } from 'jotai'


// Init as None
export const selectedEditOptionAtom = atom('')

export const currLayerAtom = atom('')

// Init from API GET request
// Define the initial state or default values if needed
const EMPTY_MAP_DATA: MapSchemaDecodedType = {
  title: '',
  owner: '',
  mapType: '',
  isPublished: false,
  geojson: undefined,
  thumbnail: undefined,
  likes: [],
  messages: [],
  sharedUsers: [],
  dateCreated: new Date(),
  forkedFrom: [],
}

// Atom for holding the map data, initially set to EMPTY_MAP_DATA
export const mapAtom = atom(EMPTY_MAP_DATA)
