import { CustomFeatureCollection, IMap } from '@/core/_entities/types/map.types'
import { atom } from 'jotai'

// Init as None
export const selectedEditOptionAtom = atom('')

export const currLayerAtom = atom('')

// Init from API GET request
// Define the initial state or default values if needed

const EMPTY_GEO: CustomFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
  _shared: new Map<string, string | number>(),
}

const EMPTY_MAP_DATA = {
  _id: '0',
  title: '',
  owner: { username: '', email: '' },
  mapType: '',
  isPublished: 'private',
  geojson: EMPTY_GEO,
  thumbnail: undefined,
  likes: [],
  messages: [],
  sharedUsers: [],
  dateCreated: new Date(),
  forkedFrom: [],
}

// Atom for holding the map data, initially set to EMPTY_MAP_DATA
export const mapAtom = atom(EMPTY_MAP_DATA)

export const setMapFieldAtom = atom(
  null,
  (get, set, { field, value }: { field: keyof IMap; value: any }) => {
    const currentMap = get(mapAtom)
    set(mapAtom, {
      ...currentMap,
      [field]: value,
    })
  }
)
