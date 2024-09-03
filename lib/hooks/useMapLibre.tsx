'use client'

import { useRef, useEffect, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { useAtomValue, useSetAtom } from 'jotai'
import { currLayerAtom, mapAtom, mapLibreAtom } from '../jotai'

interface UseMapLibreProps {
  containerId: string
  styleUrl: string
  initialZoom?: number
  onMapLoad?: (map: maplibregl.Map) => void
}

export const useMapLibre = ({
  styleUrl,
  initialZoom = 0.5,
  onMapLoad,
}: UseMapLibreProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  // const [drawingMode, setDrawingMode] = useAtom(drawingModeAtom);
  // const [drawnFeatures, setDrawnFeatures] = useAtom(drawnFeaturesAtom);
  const setMapLibre = useSetAtom(mapLibreAtom) // Set MapLibre Map Object to Ref
  const mapData = useAtomValue(mapAtom) // Get GeoJSON data
  const mapGeo = mapData.geojson

  const setCurrLayer = useSetAtom(currLayerAtom)
  // const [previousFeatureId, setPreviousFeatureId] = useState(null)

  const initializeMap = useCallback(() => {
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      zoom: initialZoom,
      attributionControl: false,
    })

    map.current.on('load', () => {
      setMapLibre(map.current)
      if (onMapLoad && map.current) {
        onMapLoad(map.current)
      }

      if (!map.current) return

      // Add empty GeoJSON source for drawn features
      map.current.addSource('geojson-data', {
        type: 'geojson',
        data: mapGeo,
        promoteId: '_id',
      })

      // Add a Fill layer of geoJSON
      map.current.addLayer({
        id: 'geojson-layer',
        type: 'fill',
        source: 'geojson-data',
        layout: {},
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0.4,
        },
      })

      // Add a Outline layer of geoJSON
      map.current.addLayer({
        id: 'outline-layer',
        type: 'line',
        source: 'geojson-data',
        layout: {},
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#404040', // Red for selected
            ['boolean', ['feature-state', 'hover'], false],
            '#4f8dff', // Blue for hover
            '#FFFFFF', // Default color
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            2, // Width for selected
            ['boolean', ['feature-state', 'hover'], false],
            2, // Width for hover (you can adjust this value)
            1, // Default width
          ],
        },
      })
    })

    // Map Click logic
    let selectedFeatureId = ''
    map.current.on('click', 'geojson-layer', (e) => {
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

      // Check if the clicked feature is different from the currently selected one
      if (selectedFeatureId !== featureId) {
        // Update the selected feature state
        map.current.setFeatureState(
          { source: 'geojson-data', id: featureId },
          { selected: true }
        )

        // Reset the previous selection
        if (selectedFeatureId) {
          map.current.setFeatureState(
            { source: 'geojson-data', id: selectedFeatureId },
            { selected: false }
          )
        }
        selectedFeatureId = featureId
        // Update state with the selected feature ID
        setCurrLayer(featureId)
      } else {
        // Update the selected feature state
        map.current.setFeatureState(
          { source: 'geojson-data', id: featureId },
          { selected: false }
        )
        selectedFeatureId = ''
        setCurrLayer('')
      }
    })
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
      if (!map.current) {
        return
      }
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
  }, [styleUrl, initialZoom, onMapLoad, setMapLibre])

  useEffect(() => {
    if (!map.current) {
      initializeMap()
    }

    return () => {
      map.current?.remove()
      setMapLibre(null)
      map.current = null
    }
  }, [initializeMap, setMapLibre])

  useEffect(() => {
    if (!map.current) return

    // Only update the GeoJSON data, not the entire map
    const source = map.current.getSource(
      'geojson-data'
    ) as maplibregl.GeoJSONSource
    if (source) {
      source.setData(mapGeo)
    }
  }, [mapGeo])

  return {
    mapContainer,
    map,
  }
}
