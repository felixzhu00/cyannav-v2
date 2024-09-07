/* eslint-disable no-param-reassign */
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import maplibregl from 'maplibre-gl'
import { findMinMax } from './utils'

export function renderFill(
  mapRef: maplibregl.Map | null,
  mapGeo: CustomFeatureCollection
) {
  if (!mapRef) return

  // Add empty GeoJSON source for drawn features
  mapRef.addSource('geojson-data', {
    type: 'geojson',
    data: mapGeo,
    promoteId: '_id',
  })

  // Add a Fill layer of geoJSON with visibility control
  mapRef.addLayer({
    id: 'geojson-layer',
    type: 'fill',
    source: 'geojson-data',
    layout: {},
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'visible'], false],
        '#000000', // Color for visible features
        'rgba(0,0,0,0)', // Transparent color for hidden features
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'visible'], false],
        0.4, // Opacity for visible features
        0, // Fully transparent for hidden features
      ],
    },
  })

  // Add an Outline layer of geoJSON with visibility control
  mapRef.addLayer({
    id: 'outline-layer',
    type: 'line',
    source: 'geojson-data',
    layout: {},
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'visible'], false],
        [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#404040', // Color for selected features
          ['boolean', ['feature-state', 'hover'], false],
          '#4f8dff', // Color for hovered features
          '#FFFFFF', // Default color
        ],
        'rgba(0,0,0,0)', // Transparent color for hidden features
      ],
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'visible'], false],
        [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          2, // Width for selected features
          ['boolean', ['feature-state', 'hover'], false],
          2, // Width for hovered features
          1, // Default width
        ],
        0, // Width for hidden features
      ],
    },
  })

  // Function runs when source data is loaded
  function onSourceData(e: maplibregl.MapSourceDataEvent) {
    // Check if source data is geojson-data
    if (
      e.sourceId === 'geojson-data' &&
      mapRef?.isSourceLoaded('geojson-data')
    ) {
      const features = mapRef.querySourceFeatures('geojson-data')

      features.forEach((feature) => {
        const id = feature.id as string // Ensure id is string
        const selfObject = JSON.parse(feature.properties._self)
        const visible = selfObject._visible === true // Assuming 'visible' is a boolean property

        mapRef?.setFeatureState({ source: 'geojson-data', id }, { visible })
      })
      // Remove the event listener after it has run
      mapRef?.off('sourcedata', onSourceData)
    }
  }

  // Attach the sourcedata event listener
  mapRef.on('sourcedata', onSourceData)
}

export function applyHover(mapRef: maplibregl.Map | null) {
  if (!mapRef) return

  // Map Hover Logic
  let hoveredFeatureId = ''

  mapRef.on('mousemove', 'geojson-layer', (e) => {
    const features = mapRef?.queryRenderedFeatures(e.point, {
      layers: ['geojson-layer'],
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
          { source: 'geojson-data', id: hoveredFeatureId },
          { hover: false }
        )
      }

      // Set the hover state for the new feature
      mapRef.setFeatureState(
        { source: 'geojson-data', id: featureId },
        { hover: true }
      )

      // Update the hovered feature ID
      hoveredFeatureId = featureId

      // Change the cursor style
      mapRef.getCanvas().style.cursor = 'pointer'
    }
  })

  mapRef.on('mouseleave', 'geojson-layer', () => {
    if (!mapRef) return
    if (hoveredFeatureId) {
      mapRef.setFeatureState(
        { source: 'geojson-data', id: hoveredFeatureId },
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
  setCurrLayer: (update: (prevLayerId: string) => string) => void
) {
  if (!mapRef) return

  // Add the click event listener
  mapRef.on('click', 'geojson-layer', (e) => {
    if (!mapRef) return
    const features = mapRef.queryRenderedFeatures(e.point, {
      layers: ['geojson-layer'],
    })

    if (!features || !features.length) return

    const featureId = features[0].properties._id

    setCurrLayer((prevLayerId) => {
      if (!mapRef) return ''
      if (prevLayerId === featureId) {
        mapRef.setFeatureState(
          { source: 'geojson-data', id: featureId },
          { selected: false }
        )
        return '' // Deselect if already selected
      }
      if (prevLayerId) {
        mapRef.setFeatureState(
          { source: 'geojson-data', id: prevLayerId },
          { selected: false }
        )
      }

      mapRef.setFeatureState(
        { source: 'geojson-data', id: featureId },
        { selected: true }
      )
      return featureId // Select new feature
    })
  })
}

export function toggleFeatureVisibility(
  mapRef: maplibregl.Map | null,
  featureId: string,
  visible: boolean
) {
  // Check if map is valid
  if (!mapRef) return

  // Update the feature state for the specified feature
  mapRef.setFeatureState({ source: 'geojson-data', id: featureId }, { visible })

  // Optionally, update the fill and outline styles based on feature state
  // Add or update Fill layer with visibility control
  mapRef.setPaintProperty('geojson-layer', 'fill-color', [
    'case',
    ['boolean', ['feature-state', 'visible'], false],
    '#000000', // Color for visible features
    'rgba(0,0,0,0)', // Transparent color for hidden features
  ])

  // Add or update Outline layer with visibility control
  mapRef.setPaintProperty('outline-layer', 'line-width', [
    'case',
    ['boolean', ['feature-state', 'visible'], false],
    2, // Width for visible features
    0, // Width for hidden features (no outline)
  ])
}

export function editLayerStyleGlobal(
  mapRef: maplibregl.Map | null,
  value: { [key: string]: any }, // index 0,1,2 is usual not for data
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
        const source = mapRef.getSource('geojson-data')
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
    }
  }
}
