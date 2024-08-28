import { IMap } from '@/core/_entities/types/map.types'
import { MapSchemaDecodedType } from '@/core/_entities/z-schemas/map.schema'
import { atom } from 'jotai'


// Init as None
export const selectedEditOptionAtom = atom('')

export const currLayerAtom = atom('')

// Init from API GET request
// Define the initial state or default values if needed
const EMPTY_MAP_DATA= {
  _id: "0",
  title: '',
  owner: {username:"" , email:""},
  mapType: '',
  isPublished: "public",
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

export const setMapFieldAtom = atom(
  null,
  (get, set, { field, value }: { field: keyof IMap; value: any }) => {
    const currentMap = get(mapAtom);
    set(mapAtom, {
      ...currentMap,
      [field]: value,
    });
  }
);
