'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import * as turf from '@turf/turf'
import 'maplibre-gl/dist/maplibre-gl.css'
import { decodeGeo } from '@/lib/utils'
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import { renderCollectionImage } from '@/lib/maplibre-actions/map-render-layers'

type MapPreviewPageProps = {
  geojson: { type: string; data: number[] }
}

export default function MapPreviewPage({ geojson }: MapPreviewPageProps) {
  const mapRef = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    const decodedGeoJSON = decodeGeo(geojson) as CustomFeatureCollection

    const map = new maplibregl.Map({
      container: 'map-container',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 1,
      interactive: true,
      renderWorldCopies: false,
    })

    mapRef.current = map

    map.on('load', () => {
      // Render features
      renderCollectionImage(map, decodedGeoJSON)

      // Fit to geojson bounds
      const bbox = turf.bbox(decodedGeoJSON)
      map.fitBounds(bbox as [number, number, number, number], {
        padding: 300,
        duration: 0,
      })
    })

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      })
    )

    return () => {
      map.remove()
    }
  }, [geojson])

  return (
    <div
      className="relative h-full w-full flex-grow border-x-2 border-ring"
      id="map-container"
    >
      hello
    </div>
  )
}
