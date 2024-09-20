/* eslint-disable no-param-reassign */
import {
  CustomFeature,
  CustomFeatureCollection,
} from '@/core/_entities/types/map.types'
import { renderCollection, unrenderFeatureLayer } from './map-render-layers'
import { drawToLayerType, infill } from './map-var-const'
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import { populateDefault } from '@/lib/maplibre-actions/map-utils'

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
  mapRef.on('click', `${layerId}`, (e) => {
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

    // Add to Draw
    handleAddToDraw(e, mapRef, drawRef, featureId)
  })
}

// Handles adding feature to atom upon creation
export const handleCreate = (
  event: any,
  mapRef: maplibregl.Map,
  drawRef: any,
  setCurrLayer: (update: (prevLayerId: string) => string) => void,
  updateMapByNewFeature: (feature: CustomFeature) => void
) => {
  const currentCollection = drawRef.getAll()
  const createdFeature = currentCollection.features[0]
  const currentMode = drawRef.getMode()

  // Initialize default value for Polygon, Rectangle, Circle, Point, Line, Spine
  const newFeaturePopulated = {
    ...createdFeature,
    properties: {
      ...createdFeature.properties,
      id: createdFeature.id,
      // Ensure render is initialized as an empty object if it doesn't exist
      render: {
        ...(createdFeature.properties?.render || {}),
        name: {
          payload: `New Feature`,
          variableType: 'string',
        },
        visible: {
          payload: true,
          variableType: 'boolean',
        },
        lock: {
          payload: false,
          variableType: 'boolean',
        },
        draw: {
          payload: currentMode,
          variableType: 'string',
        },
      },
    },
  }

  // If a Point
  if (currentMode === 'draw_point') {
    newFeaturePopulated.properties.render.radius = {
      payload: 10,
      variableType: 'number',
    }
  }

  // If a Circle is created
  if (createdFeature.properties.circleRadius) {
    const geojson = event.features[0] // created Circle
    const center = MapboxDrawGeodesic.getCircleCenter(geojson)
    const radius = MapboxDrawGeodesic.getCircleRadius(geojson)

    // Convert radius from kilometers to meters
    const radiusInMeters = radius * 1000

    const radiusInDegreesLng =
      ((radiusInMeters / 6378137) * (180 / Math.PI)) /
      Math.cos((center[1] * Math.PI) / 180)

    // Create a new point for the circumference
    const circumferencePoint: [number, number] = [
      center[0] + radiusInDegreesLng, // Longitude shift
      center[1], // Latitude remains the same
    ]

    // Project both the center and circumference point into pixel coordinates
    const centerPixel = mapRef.project(center)
    const circumferencePixel = mapRef.project(circumferencePoint)

    // Calculate the distance in pixels
    const radiusInPixels = Math.sqrt(
      (circumferencePixel.x - centerPixel.x) ** 2 +
        (circumferencePixel.y - centerPixel.y) ** 2
    )

    // Update geometry
    newFeaturePopulated.geometry = {
      type: 'Point',
      coordinates: center,
    }

    // Update radius
    newFeaturePopulated.properties.render.radius = {
      payload: radiusInPixels,
      variableType: 'number',
    }
  }

  const newFeatureAfterDefault = populateDefault(
    newFeaturePopulated
  ) as CustomFeature

  const newCollection: CustomFeatureCollection = {
    type: 'FeatureCollection',
    features: [newFeatureAfterDefault],
    _shared: { mode: 'none' },
  }

  // Remove collection
  drawRef.deleteAll()

  // Add Feature back to maplibre
  renderCollection(mapRef, drawRef, setCurrLayer, newCollection)
  // Update atom collection
  updateMapByNewFeature(newFeatureAfterDefault)

  // This code allow continues drawing
  setTimeout(() => {
    drawRef.changeMode(currentMode)
  }, 0)
}

// Listen for when the feature goes inactive and remove it from draw
export const handleSelectionChange = (
  event: any | undefined,
  mapRef: maplibregl.Map,
  drawRef: any,
  setCurrLayer: (update: (prevLayerId: string) => string) => void,
  updateMapByNewFeature?: (feature: CustomFeature) => void
) => {
  const selectedFeatures = event?.features || []
  if (selectedFeatures.length === 0) {
    // Get the Feature Collection that is going to be deleted
    const deletedCollection = drawRef.getAll()
    if (deletedCollection.features.length === 0) return

    // Remove feature from draw
    drawRef.deleteAll()

    const deletedFeatureId = deletedCollection.features[0].id

    setCurrLayer((prevLayerId) => {
      if (!mapRef) return ''
      if (prevLayerId === deletedFeatureId) {
        return '' // Deselect if already selected
      }
      return deletedFeatureId // Select new feature
    })

    // Add Feature back to maplibre
    renderCollection(mapRef, drawRef, setCurrLayer, deletedCollection)

    // Update backend of the change feature
    if (updateMapByNewFeature)
      updateMapByNewFeature(deletedCollection.features[0])
    // const newGeo = updateFeature()
  }
}

// Helper function
export const handleAddToDraw = (
  e: any | undefined,
  mapRef: maplibregl.Map,
  drawRef: any,
  featureId: string
) => {
  if (drawRef.getMode() === 'simple_select') {
    const source = mapRef.getSource(featureId) as maplibregl.GeoJSONSource

    if (source) {
      const sourceData = source._data as CustomFeatureCollection // Get the source data

      // If Lock then you should not be able to move it
      if (sourceData.features[0].properties?.render.lock.payload) return

      unrenderFeatureLayer(mapRef, featureId)

      drawRef.add(sourceData)

      // Add feature to draw object
      e?.preventDefault()

      // Programmically change edit this new draw object
      drawRef.changeMode('simple_select', {
        featureIds: [sourceData.features[0].id],
      })
    }
  }
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
