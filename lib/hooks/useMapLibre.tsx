import { useRef, useEffect, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { useSetAtom } from 'jotai'
import { mapDrawAtom, mapLibreAtom } from '../jotai'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'

// Define your custom mode for drawing a spline
// const SplineDrawMode = {
//   onSetup: function () {
//     return {
//       coordinates: [],
//     }
//   },

//   onClick: function (state, e) {
//     state.coordinates.push([e.lngLat.lng, e.lngLat.lat])

//     if (state.coordinates.length > 1) {
//       const feature = this.newFeature({
//         type: 'Feature',
//         properties: {},
//         geometry: {
//           type: 'LineString',
//           coordinates: state.coordinates,
//         },
//       })
//       this.addFeature(feature)
//       if (state.coordinates.length == 2) {
//         this.changeMode('simple_select')
//       }
//     }
//   },

//   onKeyUp: function (state, e) {
//     if (e.keyCode === 27) this.changeMode('simple_select')
//   },

//   toDisplayFeatures: function (state, geojson, display) {
//     display(geojson)
//   },
// }

interface UseMapLibreProps {
  styleUrl: string
  mapGeo: CustomFeatureCollection
  initialZoom?: number
  onMapLoad?: (
    map: maplibregl.Map,
    draw: MapboxDraw,
    source: { [key: string]: string[] }
  ) => void
}

export const useMapLibre = ({
  styleUrl,
  mapGeo,
  initialZoom = 0.5,
  onMapLoad,
}: UseMapLibreProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const source = useRef({})
  const setMapLibre = useSetAtom(mapLibreAtom) // Set MapLibre Map Object to Ref
  const setMapDraw = useSetAtom(mapDrawAtom) // Set draw to Ref

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
      // Initialize Mapbox Draw
      draw.current = new MapboxDraw({
        displayControlsDefault: false, // Hide default controls, we'll use custom toolbar
        controls: {
          polygon: false,
          point: false,
          line_string: false,
        },
        // modes: Object.assign(
        //   {
        //     spline_draw: SplineDrawMode,
        //   },
        //   MapboxDraw.modes
        // ), // Add custom mode here
      })

      if (draw.current) {
        map.current?.addControl(draw.current)
      }
      setMapDraw(draw.current)
      setMapLibre(map.current)
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
