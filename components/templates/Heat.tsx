// import { FeatureCollection, Point } from 'geojson'
// import React, { useRef, useEffect, useCallback } from 'react'
// import maplibregl from 'maplibre-gl'
// import {centroid} from '@turf/turf'
// import geojsonData from '../../public/america.geo.json'

// const geojson = geojsonData as FeatureCollection

// // Generate heatmap data from GeoJSON
// const generateHeatmapData = (geojsonParam: FeatureCollection) => {
//   const points = geojsonParam.features.map((feature) => {
//     const centroids = centroid(feature)
//     return {
//       type: 'Feature',
//       geometry: centroids.geometry as Point,
//       properties: {
//         pop_est: feature.properties?.pop_est || 0,
//       },
//     }
//   })

//   return {
//     type: 'FeatureCollection',
//     features: points,
//   }
// }

// const heatmapGeojson = generateHeatmapData(geojson) as FeatureCollection

// export default function Heat() {
//   const mapContainer = useRef<HTMLDivElement>(null)
//   const map = useRef<maplibregl.Map | null>(null)

//   const addMapLayers = useCallback(() => {
//     if (!map.current) return

//     // Get the style layers and find the first symbol layer's ID
//     const layers = map.current?.getStyle().layers
//     let firstSymbolId: string | undefined

//     if (layers) {
//       const firstSymbolLayer = layers.find((layer) => layer.type === 'symbol')
//       firstSymbolId = firstSymbolLayer?.id
//     }

//     map.current.addSource('geojson', {
//       type: 'geojson',
//       data: geojson,
//     })

//     // Add the heatmap source
//     map.current.addSource('heatmap', {
//       type: 'geojson',
//       data: heatmapGeojson,
//     })

//     // Add the heatmap layer
//     map.current.addLayer(
//       {
//         id: 'heatmap-layer',
//         type: 'heatmap',
//         source: 'heatmap',
//         paint: {
//           // Increase the heatmap weight based on frequency and property magnitude
//           'heatmap-weight': [
//             'interpolate',
//             ['linear'],
//             ['get', 'pop_est'],
//             0,
//             0,
//             100,
//             1,
//           ],
//           // Increase the heatmap color weight by zoom level
//           'heatmap-intensity': [
//             'interpolate',
//             ['linear'],
//             ['zoom'],
//             0,
//             1,
//             9,
//             3,
//           ],
//           // Color ramp for heatmap
//           'heatmap-color': [
//             'interpolate',
//             ['linear'],
//             ['heatmap-density'],
//             0,
//             'rgba(33,102,172,0)',
//             0.2,
//             'rgb(103,169,207)',
//             0.4,
//             'rgb(209,229,240)',
//             0.6,
//             'rgb(253,219,199)',
//             0.8,
//             'rgb(239,138,98)',
//             1,
//             'rgb(178,24,43)',
//           ],
//           // Adjust the heatmap radius by zoom level
//           'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 200],
//           // Transition from heatmap to circle layer by zoom level
//           'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
//         },
//       },
//       firstSymbolId
//     )
//   }, [])

//   useEffect(() => {
//     if (mapContainer.current) {
//       map.current = new maplibregl.Map({
//         container: mapContainer.current,
//         style: 'https://demotiles.maplibre.org/style.json',
//         zoom: 0.5,
//       })

//       map.current.on('load', () => {
//         addMapLayers()
//       })
//     }

//     return () => {
//       map.current?.remove()
//     }
//   }, [addMapLayers])

//   return (
//     <div className="map-wrap h-[690px]">
//       <div ref={mapContainer} className="map h-full" />
//     </div>
//   )
// }
