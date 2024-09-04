/* eslint-disable no-param-reassign */
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import { MutableRefObject } from 'react'

export function renderFill(
  map: MutableRefObject<maplibregl.Map | null>,
  mapGeo: CustomFeatureCollection
) {
  if (!map.current) return

  // Add empty GeoJSON source for drawn features
  map.current.addSource('geojson-data', {
    type: 'geojson',
    data: mapGeo,
    promoteId: '_id',
  })

  // Add a Fill layer of geoJSON with visibility control
  map.current.addLayer({
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
  map.current.addLayer({
    id: 'outline-layer',
    type: 'line',
    source: 'geojson-data',
    layout: {},
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'visible'], true],
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
      map.current?.isSourceLoaded('geojson-data')
    ) {
      const features = map.current.querySourceFeatures('geojson-data')

      features.forEach((feature) => {
        const id = feature.id as string // Ensure id is string
        const visible = feature.properties.visible === true // Assuming 'visible' is a boolean property
        map.current?.setFeatureState(
          { source: 'geojson-data', id },
          { visible }
        )
      })
      // Remove the event listener after it has run
      map.current?.off('sourcedata', onSourceData)
    }
  }

  // Attach the sourcedata event listener
  map.current.on('sourcedata', onSourceData)
}

export function applyHover(map: MutableRefObject<maplibregl.Map | null>) {
  if (!map || !map.current) return

  // Map Hover Logic
  let hoveredFeatureId = ''

  map.current.on('mousemove', 'geojson-layer', (e) => {
    const features = map.current?.queryRenderedFeatures(e.point, {
      layers: ['geojson-layer'],
    })

    if (!features || features.length === 0) {
      return
    }
    if (!map.current) {
      return
    }

    const featureId = features[0].properties._id

    if (hoveredFeatureId !== featureId) {
      // Reset the hover state of the previously hovered feature
      if (hoveredFeatureId) {
        map.current.setFeatureState(
          { source: 'geojson-data', id: hoveredFeatureId },
          { hover: false }
        )
      }

      // Set the hover state for the new feature
      map.current.setFeatureState(
        { source: 'geojson-data', id: featureId },
        { hover: true }
      )

      // Update the hovered feature ID
      hoveredFeatureId = featureId

      // Change the cursor style
      map.current.getCanvas().style.cursor = 'pointer'
    }
  })

  map.current.on('mouseleave', 'geojson-layer', () => {
    if (!map.current) return
    if (hoveredFeatureId) {
      map.current.setFeatureState(
        { source: 'geojson-data', id: hoveredFeatureId },
        { hover: false }
      )
    }

    // Reset hoveredFeatureId
    hoveredFeatureId = ''

    // Reset the cursor style
    map.current.getCanvas().style.cursor = ''
  })
}

export function applyClick(
  map: MutableRefObject<maplibregl.Map | null>,
  setCurrLayer: (update: (prevLayerId: string) => string) => void
) {
  if (!map || !map.current) return

  // Add the click event listener
  map.current.on('click', 'geojson-layer', (e) => {
    if (!map.current) return
    const features = map.current.queryRenderedFeatures(e.point, {
      layers: ['geojson-layer'],
    })

    if (!features || !features.length) return

    const featureId = features[0].properties._id

    setCurrLayer((prevLayerId) => {
      if (!map.current) return ''
      if (prevLayerId === featureId) {
        map.current.setFeatureState(
          { source: 'geojson-data', id: featureId },
          { selected: false }
        )
        return '' // Deselect if already selected
      }
      if (prevLayerId) {
        map.current.setFeatureState(
          { source: 'geojson-data', id: prevLayerId },
          { selected: false }
        )
      }

      map.current.setFeatureState(
        { source: 'geojson-data', id: featureId },
        { selected: true }
      )
      return featureId // Select new feature
    })
  })
}

export function toggleFeatureVisibility(
  map: MutableRefObject<maplibregl.Map | null>,
  featureId: string,
  visible: boolean
) {
  // Check if map is valid
  if (!map || !map.current) return

  // Update the feature state for the specified feature
  map.current.setFeatureState(
    { source: 'geojson-data', id: featureId },
    { visible }
  )

  // Optionally, update the fill and outline styles based on feature state
  // Add or update Fill layer with visibility control
  map.current.setPaintProperty('geojson-layer', 'fill-color', [
    'case',
    ['boolean', ['feature-state', 'visible'], false],
    '#000000', // Color for visible features
    'rgba(0,0,0,0)', // Transparent color for hidden features
  ])

  // Add or update Outline layer with visibility control
  map.current.setPaintProperty('outline-layer', 'line-width', [
    'case',
    ['boolean', ['feature-state', 'visible'], false],
    2, // Width for visible features
    0, // Width for hidden features (no outline)
  ])
}
