import { useRef, useEffect, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { useSetAtom } from 'jotai'
import { mapDrawAtom, mapLibreAtom, mapSourceAtom } from '../jotai'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import {
  SimpleSelectModeBezierOverride,
  DirectModeBezierOverride,
  DrawBezierCurve,
  customStyles,
} from 'mapbox-gl-draw-bezier-curve-mode'
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import PaintMode from 'mapbox-gl-draw-paint-mode'
import { NoOpMode } from '../maplibre-actions/map-var-const'

interface UseMapLibreProps {
  styleUrl: string
  initialZoom?: number
  onMapLoad?: (
    map: maplibregl.Map,
    draw: MapboxDraw,
    source: { [key: string]: string[] }
  ) => void
}

export const useMapLibre = ({
  styleUrl,
  initialZoom = 0.5,
  onMapLoad,
}: UseMapLibreProps) => {
  // Jotai Setter
  const setMapLibre = useSetAtom(mapLibreAtom) // Set MapLibre Map Object to Ref
  const setMapDraw = useSetAtom(mapDrawAtom) // Set draw to Ref
  const setMapSource = useSetAtom(mapSourceAtom) // Set source to Ref

  // Hook Ref to be exported
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const source = useRef({})
  const draw = useRef<MapboxDraw | null>(null)

  // Init maplibre canvas
  const initializeMap = useCallback(() => {
    if (!mapContainer.current) return

    // Create maplibre map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      zoom: initialZoom,
      attributionControl: false,
      doubleClickZoom: false,
      preserveDrawingBuffer: true,
    })

    // Proceed when maplibre loaded
    map.current.on('load', () => {
      // Load geodesic draw mode plugin
      let { modes } = MapboxDraw
      modes = MapboxDrawGeodesic.enable(modes)

      // Init mapbox-gl-draw plugin with options
      draw.current = new MapboxDraw({
        displayControlsDefault: false, // Hide default controls, we'll use custom toolbar
        controls: {
          polygon: false,
          point: false,
          line_string: false,
        },
        styles: customStyles,
        modes: {
          ...modes, // Use the merged modes here
          simple_select: SimpleSelectModeBezierOverride,
          direct_select: DirectModeBezierOverride,
          draw_bezier_curve: DrawBezierCurve,
          draw_rectangle: DrawRectangle,
          draw_paint_mode: PaintMode,
          no_op: NoOpMode,
        },
      })

      // Add draw plugin to maplibre
      if (draw.current) {
        map.current?.addControl(draw.current)
      }

      // Update jotai reference
      setMapDraw(draw.current)
      setMapLibre(map.current)
      setMapSource(source.current)

      // Do remainder onload procedure
      if (onMapLoad && map.current) {
        onMapLoad(map.current, draw.current, source.current) // Pass the map
      }
    })
  }, [styleUrl, initialZoom, onMapLoad, setMapLibre, setMapDraw, setMapSource])

  // Component onmount and unmount logic
  useEffect(() => {
    if (!map.current) {
      initializeMap()
    }

    // Clean up function
    return () => {
      // Remove Draw Plugin
      setMapDraw(null)
      draw.current = null

      // Remove MapLibre
      map.current?.remove()
      setMapLibre(null)
      map.current = null
    }
  }, [initializeMap, setMapLibre, setMapDraw])

  return {
    mapContainer,
    map,
    draw,
    source,
  }
}
