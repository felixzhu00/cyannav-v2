import {
  CustomFeatureCollection,
  IMap,
  MapAtom,
} from '@/core/_entities/types/map.types'
import { atom } from 'jotai'
import maplibregl from 'maplibre-gl'

// Constants for Default Jotai Atom Value
const EMPTY_GEO: CustomFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
  _shared: new Map<string, string | number>(),
}

const EMPTY_MAP_DATA: MapAtom = {
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

export const selectedEditOptionAtom = atom('')
export const currLayerAtom = atom('')
export const mapLibreAtom = atom<maplibregl.Map | null>(null)
export const mapAtom = atom(EMPTY_MAP_DATA)

// mapAtom setter for any field change
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

// currLayer setter && maplibre select layer
export const setCurrLayerSelectAtom = atom(
  null,
  (get, set, featureId: string) => {
    // change "click" styling in map render
    const mapRef = get(mapLibreAtom)

    if (!mapRef) return
    // Reset previous selection
    const sources = mapRef.getSource('geojson-data')
    if (!sources) return

    mapRef.querySourceFeatures('geojson-data').forEach((feature) => {
      const id = feature.properties._id as string // Ensure id is string
      mapRef.setFeatureState(
        { source: 'geojson-data', id },
        { selected: id === featureId }
      )
    })

    // set jotai atom
    set(currLayerAtom, featureId)
  }
)

export const setToggleFeatureStateAtom = atom(
  null,
  (get, set, featureId: string, stateKey: string) => {
    const mapRef = get(mapLibreAtom)
    if (!mapRef) return
    const sources = mapRef.getSource('geojson-data')
    if (!sources) return

    const feature = mapRef
      .querySourceFeatures('geojson-data')
      .find((f) => f.properties._id === featureId)

    if (feature) {
      // Set the feature state
      const currentState = mapRef.getFeatureState({
        source: 'geojson-data',
        id: featureId,
      })
      // Toggle state
      const newState = !currentState[stateKey]
      // Set the new state
      mapRef.setFeatureState(
        { source: 'geojson-data', id: featureId },
        { [stateKey]: newState }
      )
    }
  }
)
