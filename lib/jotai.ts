import {
  CustomFeature,
  CustomFeatureCollection,
  IMap,
  MapAtom,
} from '@/core/_entities/types/map.types'
import { atom } from 'jotai'
import maplibregl from 'maplibre-gl'
import { updateFeature, updateGeoJSONAPI } from './utils'
import { toggleFeatureVisibility } from './maplibre-actions/map-utils'

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
export const mapDrawAtom = atom<any | null>(null)
export const mapSourceAtom = atom<any | null>(null)
export const attachedHandlersAtom = atom<any | null>({})

export const currSelectedModeAtom = atom({
  menuColIndex: 0, // Row of "menu" matrix
  menuItemIndex: 0, // Col of "menu" matrix
})

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

// mapAtom setter for selecting and deselecting layers
export const setSelectedLayerStyleAtom = atom(
  null,
  (get, set, featureId: string) => {
    const mapRef = get(mapLibreAtom) // Assuming mapAtom holds the reference to the map
    const prevLayerId = get(currLayerAtom) // Adjust as needed to get the current layer ID

    if (!mapRef) return // Exit if map reference is not available
    if (prevLayerId === featureId) {
      // Deselect if already selected
      mapRef.setFeatureState(
        { source: `${featureId}-bbox`, id: `${featureId}-bbox-polygon` },
        { selected: false }
      )
      set(currLayerAtom, '') // Clear the current layer ID
      return // Exit the function
    }

    // Deselect the previous layer
    if (prevLayerId) {
      mapRef.setFeatureState(
        { source: `${prevLayerId}-bbox`, id: `${prevLayerId}-bbox-polygon` },
        { selected: false }
      )
    }

    if (featureId) {
      // Select the new feature
      mapRef.setFeatureState(
        { source: `${featureId}-bbox`, id: `${featureId}-bbox-polygon` },
        { selected: true }
      )

      // Move the selected layer to the front
      mapRef.moveLayer(`${featureId}-bbox-layer`)
    }
    // Update the current layer ID
    set(currLayerAtom, featureId)
  }
)

// mapAtom setter for any field change
export const updateMapByNewFeatureAtom = atom(
  null,
  async (get, set, feature: CustomFeature) => {
    const currentMap = get(mapAtom)

    const newGeo = updateFeature(currentMap.geojson, feature)

    const newMap = {
      ...currentMap,
      geojson: newGeo,
    }

    set(mapAtom, newMap)

    await updateGeoJSONAPI(newGeo, currentMap._id)
  }
)

export const setToggleFeatureStateAtom = atom(
  null,
  (
    get,
    set,
    featureId: string,
    stateKey: string,
    stateValue: boolean,
    featureType: any
  ) => {
    const mapRef = get(mapLibreAtom)
    if (!mapRef) return

    // Set the new feature state
    if (stateKey === 'visible') {
      toggleFeatureVisibility(mapRef, featureId, stateValue, featureType)
    }
  }
)
