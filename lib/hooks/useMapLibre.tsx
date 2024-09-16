import { useRef, useEffect, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { useSetAtom } from 'jotai'
import { mapDrawAtom, mapLibreAtom, mapSourceAtom } from '../jotai'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'

import {
  SimpleSelectModeBezierOverride,
  DirectModeBezierOverride,
  DrawBezierCurve,
  customStyles,
} from 'mapbox-gl-draw-bezier-curve-mode'

import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'

import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import PaintMode from 'mapbox-gl-draw-paint-mode'

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
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const source = useRef({})
  const setMapLibre = useSetAtom(mapLibreAtom) // Set MapLibre Map Object to Ref
  const setMapDraw = useSetAtom(mapDrawAtom) // Set draw to Ref
  const setMapSource = useSetAtom(mapSourceAtom) // Set draw to Ref

  // Initialize Mapbox Draw
  const draw = useRef<MapboxDraw | null>(null)

  const initializeMap = useCallback(() => {
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      zoom: initialZoom,
      attributionControl: false,
      doubleClickZoom: false,
    })

    map.current.on('load', () => {
      // Geodesic
      let { modes } = MapboxDraw
      modes = MapboxDrawGeodesic.enable(modes)
      // Initialize Mapbox Draw
      draw.current = new MapboxDraw({
        displayControlsDefault: false, // Hide default controls, we'll use custom toolbar
        controls: {
          polygon: false,
          point: false,
          line_string: false,
        },
        // styles: customStyles,

        modes: {
          ...modes, // Use the merged modes here
          simple_select: SimpleSelectModeBezierOverride,
          direct_select: DirectModeBezierOverride,
          draw_bezier_curve: DrawBezierCurve,
          draw_rectangle: DrawRectangle,
          draw_paint_mode: PaintMode,
        },
      })

      if (draw.current) {
        map.current?.addControl(draw.current)
      }
      setMapDraw(draw.current)
      setMapLibre(map.current)
      setMapSource(source.current)
      if (onMapLoad && map.current) {
        onMapLoad(map.current, draw.current, source.current) // Pass the map instance to the callback
      }
    })

    // map.current.on('draw.create', (e) => {
    //   console.log(e)
    // })
  }, [styleUrl, initialZoom, onMapLoad, setMapLibre])

  useEffect(() => {
    if (!map.current) {
      initializeMap()
    }

    return () => {
      setMapDraw(null)
      draw.current = null

      map.current?.remove()
      setMapLibre(null)
      map.current = null
    }
  }, [initializeMap, setMapLibre])

  return {
    mapContainer,
    map,
    draw,
    source,
  }
}

const styles = [
  // ACTIVE (being drawn)
  // line stroke
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#D20C0C',
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
  // polygon fill
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#D20C0C',
      'fill-outline-color': '#D20C0C',
      'fill-opacity': 0.1,
    },
  },
  // polygon mid points
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': '#fbb03b',
    },
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#D20C0C',
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
  // vertex point halos
  {
    id: 'gl-draw-polygon-and-line-vertex-halo-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#FFF',
    },
  },
  // vertex points
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 3,
      'circle-color': '#D20C0C',
    },
  },
]
