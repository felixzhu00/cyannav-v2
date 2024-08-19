'use client'

import { FeatureCollection } from 'geojson'
import React, { useRef, useEffect, useMemo, useCallback } from 'react'
import maplibregl from 'maplibre-gl'

// TODO: use html and css to add a legend
export default function Choropleth({
  geojson,
}: {
  geojson: FeatureCollection
}) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  // Memoize min and max pop_est calculation
  const [minPopEst, maxPopEst] = useMemo(() => {
    const popEstValues = geojson.features.map(
      (feature) => feature.properties?.pop_est
    )
    return [Math.min(...popEstValues), Math.max(...popEstValues)]
  }, [geojson])

  const addMapLayers = useCallback(() => {
    if (!map.current) return

    // Get the style layers and find the first symbol layer's ID
    const layers = map.current?.getStyle().layers
    let firstSymbolId: string | undefined

    if (layers) {
      const firstSymbolLayer = layers.find((layer) => layer.type === 'symbol')
      firstSymbolId = firstSymbolLayer?.id
    }

    map.current.addSource('geojson', {
      type: 'geojson',
      data: geojson,
    })

    map.current.addLayer(
      {
        id: 'geojson-layer',
        type: 'fill',
        source: 'geojson',
        layout: {},
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'pop_est'],
            minPopEst,
            '#FFEDA0', // light orange
            maxPopEst,
            '#E31A1C', // dark orange
          ],
          'fill-opacity': 0.75,
        },
      },
      firstSymbolId
    )

    map.current.addLayer({
      id: 'outline-layer',
      type: 'line',
      source: 'geojson',
      layout: {},
      paint: {
        'line-color': '#FFFFFF', // white color for the outline
        'line-width': 2, // thickness of the outline
      },
    })
  }, [minPopEst, maxPopEst])

  useEffect(() => {
    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        zoom: 0.5,
        attributionControl: false,
      })

      map.current?.on('load', () => {
        addMapLayers()
      })
    }

    return () => {
      map.current?.remove()
    }
  }, [addMapLayers])

  return (
    <div className="map-wrap h-full w-full">
      <div ref={mapContainer} className="map h-full" />
    </div>
  )
}
