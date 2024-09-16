/* eslint-disable no-param-reassign */
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import maplibregl from 'maplibre-gl'
import { findMinMax } from './utils'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import {
  addCircleFillLayer,
  addImageLayer,
  addInfillLayer,
  addTextLayer,
  addUnfillLayer,
} from './render/manage-layers'

// Adds source, fill, outline layer to maplibre mapRef for ONE feature
function addFeatureSourceAndLayer(
  mapRef: maplibregl.Map | null,
  sourceRef: { [key: string]: string[] },
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return

  const featureType = feature.properties?.meta.draw.payload || ''

  const infill = ['feature', 'draw_rectangle', 'draw_polygon']

  const unfill = ['draw_line_string', 'draw_bezier_curve']

  if (infill.includes(featureType)) {
    addInfillLayer(mapRef, feature)
  }
  if (unfill.includes(featureType)) {
    addUnfillLayer(mapRef, feature)
  }
  if (featureType === 'draw_circle') {
    addCircleFillLayer(mapRef, feature)
  }
  if (featureType === 'marker') {
    addImageLayer(mapRef, feature)
  }
  if (featureType === 'text') {
    addTextLayer(mapRef, feature)
  }

  // ID of source and layer
  const featureId = feature.id as string

  // Add source to sourceMap
  sourceRef[featureId] = [`${featureId}-fill`, `${featureId}-outline`]
}

// Removes source, fill, outline layer to maplibre mapRef for ONE feature
function removeSourceAndLayers(
  mapRef: maplibregl.Map,
  sourceRef: { [key: string]: string[] },
  sourceId: string
) {
  // Check if the source exists
  if (!mapRef.getSource(sourceId)) return

  // Get all the layers in the map
  const { layers } = mapRef.getStyle()

  // Loop through layers and remove the ones that reference the source
  if (layers) {
    layers.forEach((layer) => {
      if ('source' in layer && layer.source === sourceId) {
        mapRef.removeLayer(layer.id)
      }
    })
  }

  // Remove the source
  mapRef.removeSource(sourceId)

  // Pop source from sourceMap
  delete sourceRef[sourceId]
}

export function applyHover(mapRef: maplibregl.Map | null, sourceId: string) {
  if (!mapRef) return

  // Map Hover Logic
  let hoveredFeatureId = ''

  // Mouse inside Layer
  mapRef.on('mousemove', `${sourceId}-fill`, (e) => {
    const features = mapRef?.queryRenderedFeatures(e.point, {
      layers: [`${sourceId}-fill`],
    })

    if (!features || features.length === 0) {
      return
    }
    if (!mapRef) {
      return
    }

    const featureId = features[0].properties._id

    if (hoveredFeatureId !== featureId) {
      // Reset the hover state of the previously hovered feature
      if (hoveredFeatureId) {
        mapRef.setFeatureState(
          { source: sourceId, id: hoveredFeatureId },
          { hover: false }
        )
      }

      // Set the hover state for the new feature
      mapRef.setFeatureState(
        { source: sourceId, id: featureId },
        { hover: true }
      )

      // Update the hovered feature ID
      hoveredFeatureId = featureId

      // Change the cursor style
      mapRef.getCanvas().style.cursor = 'pointer'
    }
  })

  // Mouse outside Layer
  mapRef.on('mouseleave', `${sourceId}-fill`, () => {
    if (!mapRef) return
    if (hoveredFeatureId) {
      mapRef.setFeatureState(
        { source: sourceId, id: hoveredFeatureId },
        { hover: false }
      )
    }

    // Reset hoveredFeatureId
    hoveredFeatureId = ''

    // Reset the cursor style
    mapRef.getCanvas().style.cursor = ''
  })
}

export function applyClick(
  mapRef: maplibregl.Map | null,
  drawRef: any,
  sourceRef: { [key: string]: string[] },
  setCurrLayer: (update: (prevLayerId: string) => string) => void,
  sourceId: string
) {
  if (!mapRef) return

  // Add the click event listener
  mapRef.on('click', `${sourceId}-fill`, async (e) => {
    if (!mapRef) return
    const features = mapRef.queryRenderedFeatures(e.point, {
      layers: [`${sourceId}-fill`],
    })

    if (!features || !features.length) return

    const featureId = features[0].id as string

    setCurrLayer((prevLayerId) => {
      if (!mapRef) return ''
      if (prevLayerId === featureId) {
        return '' // Deselect if already selected
      }
      return featureId // Select new feature
    })

    if (drawRef.getMode() === 'simple_select') {
      const source = mapRef.getSource(sourceId) as maplibregl.GeoJSONSource
      if (source) {
        const sourceData = await source.getData() // Get the source data
        removeSourceAndLayers(mapRef, sourceRef, sourceId)
        // Add feature to draw object
        drawRef.add(sourceData)
        e.preventDefault()

        // Programmically change edit this new draw object
        drawRef.changeMode('simple_select', { featureIds: [sourceId] })
      }
    }
  })
  console.log('aasdaaaaas')
}

export function renderMap(
  mapRef: maplibregl.Map | null,
  sourceRef: { [key: string]: string[] },
  drawRef: any,
  setCurrLayer: (update: (prevLayerId: string) => string) => void,
  mapGeo: CustomFeatureCollection
) {
  // Iterate over features and add individual sources and layers
  mapGeo.features.forEach((feature) => {
    try {
      addFeatureSourceAndLayer(mapRef, sourceRef, feature)
      // applyClick(mapRef, drawRef, sourceRef, setCurrLayer, feature.id as string)
    } catch (error) {
      console.error('Error adding feature or applying click:', error)
    }
  })
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

// export function toggleFeatureVisibility(
//   mapRef: maplibregl.Map | null,
//   featureId: string,
//   visible: boolean
// ) {
//   // Check if map is valid
//   if (!mapRef) return

//   // Update the feature state for the specified feature
//   mapRef.setFeatureState({ source: 'geojson-data', id: featureId }, { visible })

//   // Optionally, update the fill and outline styles based on feature state
//   // Add or update Fill layer with visibility control
//   mapRef.setPaintProperty('geojson-layer', 'fill-color', [
//     'case',
//     ['boolean', ['feature-state', 'visible'], false],
//     '#000000', // Color for visible features
//     'rgba(0,0,0,0)', // Transparent color for hidden features
//   ])

//   // Add or update Outline layer with visibility control
//   mapRef.setPaintProperty('outline-layer', 'line-width', [
//     'case',
//     ['boolean', ['feature-state', 'visible'], false],
//     2, // Width for visible features
//     0, // Width for hidden features (no outline)
//   ])
// }
