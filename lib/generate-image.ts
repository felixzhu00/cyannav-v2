import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import { renderCollectionImage } from './maplibre-actions/map-render-layers'
import maplibregl from 'maplibre-gl'
import * as turf from '@turf/turf'

export const initializeOffScreenMapDiv = async (
  geojson: GeoJSON.FeatureCollection,
  options: {
    width?: string
    height?: string
    padding?: number
    fitBound?: boolean
  } = {}
): Promise<Blob> => {
  //Default option settings
  const {
    width = '1920px',
    height = '1080px',
    padding = 300,
    fitBound = true,
  } = options

  return new Promise((resolve) => {
    // Create a container off-screen
    const container = document.createElement('div')
    container.style.width = width
    container.style.height = height
    container.style.position = 'absolute'
    container.style.top = '-9999px'
    document.body.appendChild(container)

    // Init MapLibre
    const map = new maplibregl.Map({
      container,
      style: 'https://demotiles.maplibre.org/style.json', // or your custom style
      center: [0, 0],
      zoom: 1,
      interactive: false,
      renderWorldCopies: fitBound, // Disable horizontal wrapping if fitBound is false
    })

    map.on('load', () => {
      // Render the GeoJson like Edit
      renderCollectionImage(map, geojson as CustomFeatureCollection)

      // Fit to bounds(false: do not bound geojson feature)
      if (fitBound) {
        const bbox = turf.bbox(geojson) // Use @turf/bbox
        map.fitBounds(bbox as [number, number, number, number], {
          padding: padding,
          duration: 0,
        })
      }

      // Wait until tiles/rendering is complete
      map.once('idle', () => {
        map.resize() // Ensure proper render

        // Capture canvas
        const dataURL = map.getCanvas().toDataURL('image/png')

        // Convert to Blob
        fetch(dataURL)
          .then((res) => res.blob())
          .then((blob) => {
            map.remove() // Clean up
            container.remove() // Remove container
            resolve(blob)
          })
      })
    })
  })
}

export const handleThumbnailDownload = async (
  name: string,
  myGeoJson: GeoJSON.FeatureCollection,
  options: {
    width?: string
    height?: string
    padding?: number
    fitBound?: boolean
  } = {}
) => {
  //Default option settings
  const mergedOptions = {
    width: '1920px',
    height: '1080px',
    padding: 300,
    fitBound: true,
    ...options,
  }

  // Make the map
  const blob = await initializeOffScreenMapDiv(myGeoJson, mergedOptions)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.png`
  a.click()
  URL.revokeObjectURL(url)
}
