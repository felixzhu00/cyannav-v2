import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import maplibregl from 'maplibre-gl'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import {
  initializeCircleFillLayer,
  initializeIconLayer,
  initializeInfillLayer,
  initializeTextLayer,
  initializeUnfillLayer,
} from './map-init-layers'
import { applyClick } from './map-apply-handler'
import { infill, unfill } from './map-var-const'

// Adds source, fill, outline layer to maplibre mapRef for ONE shape
export function renderFeatureLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return

  // Get the type of shape (geoFeaturem, Rect, Circle, Line, etc)
  const featureType = feature.properties?.render.draw.payload || ''

  // Init shape with appropriate init functions
  if (infill.includes(featureType)) {
    initializeInfillLayer(mapRef, feature)
  }
  if (unfill.includes(featureType)) {
    initializeUnfillLayer(mapRef, feature)
  }
  if (featureType === 'draw_circle' || featureType === 'draw_point') {
    initializeCircleFillLayer(mapRef, feature)
  }
  if (featureType === 'marker') {
    initializeIconLayer(mapRef, feature)
  }
  if (featureType === 'text') {
    initializeTextLayer(mapRef, feature)
  }
}

// Removes source, fill, outline layer to maplibre mapRef for ONE shape
export function unrenderFeatureLayer(
  mapRef: maplibregl.Map,
  sourceId: string,
  handlerRef: { [key: string]: (event: any) => void }
) {
  // Check if the source exists
  if (!mapRef.getSource(sourceId)) return

  // Get all the layers in the map
  const { layers } = mapRef.getStyle()

  // Loop through layers and remove the ones that reference the source
  if (layers) {
    layers.forEach((layer) => {
      if (
        'source' in layer &&
        (layer.source === sourceId || layer.source === `${sourceId}-bbox`)
      ) {
        if (handlerRef[layer.id])
          mapRef.off('click', `${layer.id}`, handlerRef[layer.id])
        mapRef.removeLayer(layer.id)
      }
    })
  }

  // Remove the source
  mapRef.removeSource(sourceId)
  // Remove Bounding Box source
  mapRef.removeSource(`${sourceId}-bbox`)
}

// Main function that renders a GeoJSON collectionD
export function renderCollection(
  mapRef: maplibregl.Map | null,
  drawRef: any,
  handlerRef: { [key: string]: (event: any) => void },
  setCurrLayer: (update: (prevLayerId: string) => string) => void,
  mapGeo: CustomFeatureCollection
) {
  // Iterate over mapGeo features and add individual sources and layers
  mapGeo.features.forEach((feature) => {
    try {
      renderFeatureLayer(mapRef, feature)
      applyClick(mapRef, drawRef, setCurrLayer, feature, handlerRef)
    } catch (error) {
      console.error(error)
    }
  })
}
