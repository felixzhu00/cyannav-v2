import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import maplibregl from 'maplibre-gl'
import { findMinMax } from '../utils'
import { drawToLayerType, infill, layerMap, unfill } from './map-var-const'

import {
  populateCircle,
  populateIcon,
  populateInfill,
  populateText,
  populateUnfill,
} from '@/lib/maplibre-actions/map-populate-default'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'

// Controller for choosing which populate function
export function populateDefault(
  featureToPopulated: Feature<Geometry, GeoJsonProperties>
) {
  // Get the type of shape (geoFeaturem, Rect, Circle, Line, etc)
  const featureType = featureToPopulated.properties?.render.draw.payload || ''

  let newFeatureAfterDefault = featureToPopulated

  // Init shape with appropriate default properties
  if (infill.includes(featureType)) {
    newFeatureAfterDefault = populateInfill(featureToPopulated)
  }
  if (unfill.includes(featureType)) {
    newFeatureAfterDefault = populateUnfill(featureToPopulated)
  }
  if (featureType === 'draw_circle' || featureType === 'draw_point') {
    newFeatureAfterDefault = populateCircle(featureToPopulated)
  }
  if (featureType === 'marker') {
    newFeatureAfterDefault = populateIcon(featureToPopulated)
  }
  if (featureType === 'text') {
    newFeatureAfterDefault = populateText(featureToPopulated)
  }

  return newFeatureAfterDefault
}

export function editLayerStyle(
  mapRef: maplibregl.Map | null,
  key: string,
  value: number | string | boolean,
  featureId: string,
  featureType: string
) {
  if (featureType === 'marker' || featureType === 'text') {
    if (!mapRef) return
    const layerId = `${featureId}-${key.split('-')[0]}` // append correct layer type to featureId

    if (
      key in layerMap[featureType] &&
      layerMap[featureType][key] === 'layout'
    ) {
      mapRef.setLayoutProperty(layerId, key, value)
    } else {
      mapRef.setPaintProperty(layerId, key, value)
    }
  } else {
    if (!mapRef) return

    const layerId = `${featureId}-${key.split('-')[0]}` // append correct layer type to featureId
    console.log(layerId, key, value)
    mapRef.setPaintProperty(layerId, key, value)
  }
}

export function editLayerStyleGlobal(
  mapRef: maplibregl.Map | null,
  value: { [key: string]: any }, // index 0,1,2 is usual not for data
  featureId: string,
  byFeature?: string
) {
  // Check if map is valid
  if (!mapRef) return

  // Check if value properly exist
  if (!value.layer || !value.property || !value.payload || !value.index) return

  if (value.index === -1) {
    if (mapRef.getLayer(value.layer)) {
      // Change the fill color of a fill layer
      mapRef.setPaintProperty(value.layer, value.property, value.payload)
    }
  } else {
    const currentPaintProperties = mapRef.getPaintProperty(
      value.layer,
      value.property
    )

    // Update just the color values
    if (currentPaintProperties && Array.isArray(currentPaintProperties)) {
      // Make a copy of the array to avoid direct mutation
      const updatedPaintProperties = [...currentPaintProperties]

      // Update the specific index with the new value
      updatedPaintProperties[value.index] = value.payload

      // Make sure Max and Min is up to date
      if (byFeature) {
        const source = mapRef.getSource(featureId)
        if (source && source instanceof maplibregl.GeoJSONSource) {
          const data = source._data as CustomFeatureCollection // Type assertion
          const minMax = findMinMax(byFeature, data)

          if (minMax.min && minMax.max) {
            updatedPaintProperties[3] = minMax.min
            updatedPaintProperties[5] = minMax.max
          }
        }
      }

      // Set the new paint property with updated values
      mapRef.setPaintProperty(
        value.layer,
        value.property,
        updatedPaintProperties
      )
    } else {
      // paintProperty is single digit and not array
      // Load default paintProperty with value : { [key: string]: any }
    }
  }
}

export function toggleFeatureVisibility(
  mapRef: maplibregl.Map | null,
  featureId: string,
  visible: boolean,
  featureType: keyof typeof drawToLayerType
) {
  // Check if map is valid
  if (!mapRef) return

  const visibility = visible ? 'visible' : 'none'

  // console.log("asdas",featureId, "asd",featureType, drawToLayerType,infill.includes(featureType),visibility)

  if (!infill.includes(featureType)) {
    const layerId = `${featureId}-${drawToLayerType[featureType]}`
    mapRef.setLayoutProperty(layerId, 'visibility', visibility)
  } else {
    mapRef.setLayoutProperty(`${featureId}-fill`, 'visibility', visibility)
    mapRef.setLayoutProperty(`${featureId}-line`, 'visibility', visibility)
  }
}
