/* eslint-disable no-param-reassign */
import {
  CustomFeature,
  CustomFeatureCollection,
} from '@/core/_entities/types/map.types'
import { unrenderFeatureLayer } from './map-render-layers'
import { drawToLayerType, infill } from './map-var-const'

export function applyClick(
  mapRef: maplibregl.Map | null,
  drawRef: any,
  setCurrLayer: (update: (prevLayerId: string) => string) => void,
  feature: CustomFeature
) {
  if (!mapRef) return

  // Extract feature properties
  const featureId = feature.id
  const featureType = feature.properties?.render.draw
    .payload as keyof typeof drawToLayerType

  let layerId = featureId

  // Assign on click for different layers dependning on featureType
  if (!infill.includes(featureType)) {
    layerId = `${featureId}-${drawToLayerType[featureType]}`
  } else {
    layerId = `${featureId}-fill`
  }

  // Add the click event listener
  mapRef.on('click', `${layerId}`, async (e) => {
    if (!mapRef) return
    const features = mapRef.queryRenderedFeatures(e.point, {
      layers: [`${layerId}`],
    })

    if (!features || !features.length) return

    setCurrLayer((prevLayerId) => {
      if (!mapRef) return ''
      if (prevLayerId === featureId) {
        return '' // Deselect if already selected
      }
      return featureId // Select new feature
    })

    if (drawRef.getMode() === 'simple_select') {
      const source = mapRef.getSource(featureId) as maplibregl.GeoJSONSource

      if (source) {
        const sourceData = (await source.getData()) as CustomFeatureCollection // Get the source data

        // If Lock then you should not be able to move it
        if (sourceData.features[0].properties?.render.lock.payload) return

        unrenderFeatureLayer(mapRef, featureId)

        drawRef.add(sourceData)

        // Add feature to draw object
        e.preventDefault()

        // Programmically change edit this new draw object
        drawRef.changeMode('simple_select', { featureIds: [featureId] })
      }
    }
  })
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
