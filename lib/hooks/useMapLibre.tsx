import { useRef, useEffect, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { useSetAtom } from 'jotai'
import { mapLibreAtom } from '../jotai'

interface UseMapLibreProps {
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
  const setMapLibre = useSetAtom(mapLibreAtom) // Set MapLibre Map Object to Ref

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
        onMapLoad(map.current) // Pass the map instance to the callback
      }
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

  return {
    mapContainer,
    map,
  }
}
