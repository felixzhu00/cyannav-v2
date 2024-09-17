/* eslint-disable no-param-reassign */
import { unrenderFeatureLayer } from './map-render-layers'

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

        // Check if draw type is text or marker

        // const sourceType = sourceData.features[0].properties.meta.draw.payload
        // if (sourceType !== 'text' && sourceType !== 'marker') {
        // }

        unrenderFeatureLayer(mapRef, sourceRef, sourceId)

        drawRef.add(sourceData)

        // Add feature to draw object
        e.preventDefault()

        // Programmically change edit this new draw object
        drawRef.changeMode('simple_select', { featureIds: [sourceId] })
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
