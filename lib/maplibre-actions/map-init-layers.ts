import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import MapPin from '@/public/map-pin.svg'
import temp from '@/public/logo-text-black.png'

import {
  populateCircle,
  populateIcon,
  populateInfill,
  populateText,
  populateUnfill,
} from './map-populate-default'

// GeoFeature, Rectangle, Polygon
export function initializeInfillLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return

  // ID of source and layer
  const featureId = feature.id as string

  // Fail safe in case default values does not exist on feature
  const populatedInfill = populateInfill(feature)

  // Retreive the render values from newFeature
  const newRenderValues = populatedInfill.properties?.render

  // Extract render value
  const visible = populatedInfill.properties?.render?.visible.payload
  const fillColor = newRenderValues['fill-color']?.payload
  const fillOpacity = newRenderValues['fill-opacity']?.payload
  const lineColor = newRenderValues['line-color']?.payload
  const lineWidth = newRenderValues['line-width']?.payload

  // Add Source
  addSource(mapRef, featureId, populatedInfill)

  // Add Fill
  addFillLayer(mapRef, featureId, visible, fillColor, fillOpacity)

  // Add Line
  addLineLayer(mapRef, featureId, visible, lineColor, lineWidth)
}

// Lines and Splines
export function initializeUnfillLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return
  // ID of source and layer
  const featureId = feature.id as string

  // Fail safe in case default values does not exist on feature
  const populatedUnfill = populateUnfill(feature)

  // Retreive the render values from newFeature
  const newRenderValues = populatedUnfill.properties?.render

  // Extract render value
  const visible = populatedUnfill.properties?.render?.visible.payload
  const lineColor = newRenderValues['line-color']?.payload
  const lineWidth = newRenderValues['line-width']?.payload

  // Add Source
  addSource(mapRef, featureId, populatedUnfill)

  // Add Line
  addLineLayer(mapRef, featureId, visible, lineColor, lineWidth)
}

// Circle
export function initializeCircleFillLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return
  // ID of source and layer
  const featureId = feature.id as string

  // Fail safe in case default values does not exist on feature
  const populatedCircle = populateCircle(feature)

  // Retreive the render values from newFeature
  const newRenderValues = populatedCircle.properties?.render

  // Extract render value
  const visible = populatedCircle.properties?.render?.visible.payload
  const circleColor = newRenderValues['circle-color']?.payload
  const circleOpacity = newRenderValues['circle-opacity']?.payload
  const circleStrokeColor = newRenderValues['circle-stroke-color']?.payload
  const circleStrokeWidth = newRenderValues['circle-stroke-width']?.payload
  const circleRadius = newRenderValues.radius?.payload

  // Add Source
  addSource(mapRef, featureId, populatedCircle)

  // Add Line
  addCircleLayer(
    mapRef,
    featureId,
    visible,
    circleColor,
    circleOpacity,
    circleStrokeColor,
    circleStrokeWidth,
    circleRadius
  )
}

// Marker/ Custom Marker
export function initializeIconLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return
  // ID of source and layer
  const featureId = feature.id as string

  // Fail safe in case default values does not exist on feature
  const populatedIcon = populateIcon(feature)

  // Retreive the render values from newFeature
  const newRenderValues = populatedIcon.properties?.render

  // Extract render value
  const visible = populatedIcon.properties?.render?.visible.payload
  const iconSize = newRenderValues['icon-size']?.payload
  const iconAllowOverlap = newRenderValues['icon-allow-overlap']?.payload
  const iconOpacity = newRenderValues['icon-opacity']?.payload
  const iconHaloColor = newRenderValues['icon-halo-color']?.payload
  const iconHalowWidth = newRenderValues['icon-halo-width']?.payload

  // Add point feature as a source to mapRef
  addSource(mapRef, featureId, populatedIcon)

  // Add SVG
  loadSVGAsImage(mapRef, 'Pin', MapPin)

  addIconLayer(
    mapRef,
    featureId,
    visible,
    'Pin',
    iconSize,
    iconAllowOverlap,
    iconOpacity,
    iconHaloColor,
    iconHalowWidth
  )
}

// Text
export function initializeTextLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return
  // ID of source and layer
  const featureId = feature.id as string

  // Fail safe in case default values does not exist on feature
  const populatedText = populateText(feature)

  // Retreive the render values from newFeature
  const newRenderValues = populatedText.properties?.render

  // Extract render value
  const visible = populatedText.properties?.render?.visible.payload
  const textInput = newRenderValues['text-input']?.payload
  const textSize = newRenderValues['text-size']?.payload
  const textFont = newRenderValues['text-font']?.payload
  const textAnchor = newRenderValues['text-anchor']?.payload
  const textOverlap = newRenderValues['text-overlap']?.payload
  const textPlacement = newRenderValues['text-placement']?.payload
  const textColor = newRenderValues['text-color']?.payload
  const textHaloColor = newRenderValues['text-halo-color']?.payload
  const textHaloWidth = newRenderValues['text-halo-width']?.payload

  // Add point feature as a source to mapRef
  addSource(mapRef, featureId, populatedText)

  addTextLayer(
    mapRef,
    featureId,
    visible,
    textInput,
    textSize,
    textFont,
    textAnchor,
    textOverlap,
    textPlacement,
    textColor,
    textHaloColor,
    textHaloWidth
  )
}

// Primative function: add source to mapRef
export function addSource(
  mapRef: maplibregl.Map,
  featureId: string,
  feature: Feature
) {
  mapRef.addSource(featureId, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [feature],
    },
    promoteId: 'id',
  })
}

// Primative function: add fill layer to mapRef
export function addFillLayer(
  mapRef: maplibregl.Map,
  featureId: string,
  visible: boolean, // in render
  fillColor: string, // in render
  fillOpacity: string, // in render
  selectColor: string = '#407a4f',
  hoverColor: string = '#40587a',
  selectOpacity: number = 1,
  hoverOpacity: number = 1
) {
  // Add a fill layer for the feature
  mapRef.addLayer({
    id: `${featureId}-fill`,
    type: 'fill',
    source: featureId,
    layout: {
      visibility: visible ? 'visible' : 'none',
    },
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        selectColor, // Color for selected features
        ['boolean', ['feature-state', 'hover'], false],
        hoverColor, // Color for hovered features
        fillColor, // Default color
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        selectOpacity, // Opacity for selected features
        ['boolean', ['feature-state', 'hover'], false],
        hoverOpacity, // Opacity for hovered features
        fillOpacity, // Default opacity
      ],
    },
  })
}

// Primative function: add line layer to mapRef
export function addLineLayer(
  mapRef: maplibregl.Map,
  featureId: string,
  visible: boolean, // in render
  lineColor: string, // in render
  lineWidth: number // in render
) {
  // Add an outline layer for the feature
  mapRef.addLayer({
    id: `${featureId}-line`,
    type: 'line',
    source: featureId,
    layout: {
      visibility: visible ? 'visible' : 'none',
    },
    paint: {
      'line-color': lineColor,
      'line-width': lineWidth,
    },
  })
}

// Primative function: add circle layer to mapRef
export function addCircleLayer(
  mapRef: maplibregl.Map,
  featureId: string,
  visible: boolean, // in render
  circleColor: string, // in render
  circleOpacity: string, // in render
  circleStrokeColor: string, // in render
  circleStrokeWidth: number, // in render
  circleRadius: number, // in render
  selectColor: string = '#407a4f',
  hoverColor: string = '#40587a',
  selectOpacity: number = 1,
  hoverOpacity: number = 1
) {
  // Add a fill layer for the feature
  mapRef.addLayer({
    id: `${featureId}-circle`,
    type: 'circle',
    source: featureId,
    layout: {
      visibility: visible ? 'visible' : 'none',
    },
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        selectColor, // Color for selected features
        ['boolean', ['feature-state', 'hover'], false],
        hoverColor, // Color for hovered features
        circleColor, // Default color
      ],
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        selectOpacity, // Opacity for selected features
        ['boolean', ['feature-state', 'hover'], false],
        hoverOpacity, // Opacity for hovered features
        circleOpacity, // Default opacity
      ],
      'circle-stroke-color': circleStrokeColor,
      'circle-stroke-width': circleStrokeWidth,
      'circle-radius': circleRadius,
    },
  })
}

// Primative function: add text layer to mapRef
export function addTextLayer(
  mapRef: maplibregl.Map,
  featureId: string,
  visible: boolean, // in render
  textInput: string,
  textSize: number,
  textFont: string,
  textAnchor:
    | 'center'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right',
  textOverlap: boolean,
  textPlacement: boolean,
  textColor: string,
  textHaloColor: string,
  textHaloWidth: number
) {
  mapRef.addLayer({
    id: `${featureId}-text`,
    type: 'symbol',
    source: featureId,
    layout: {
      visibility: visible ? 'visible' : 'none',
      'text-field': textInput, // Fetches the text from the properties
      'text-size': textSize,
      // 'text-font': [textFont],
      'text-offset': [0, 0.6],
      'text-anchor': textAnchor,
      'text-allow-overlap': textOverlap,
      'text-ignore-placement': textPlacement,
    },
    paint: {
      'text-color': textColor,
      'text-halo-color': textHaloColor,
      'text-halo-width': textHaloWidth,
    },
  })
}

// Primative function: add icon layer to mapRef
export function addIconLayer(
  mapRef: maplibregl.Map,
  featureId: string,
  visible: boolean, // in render
  iconImage: string,
  iconSize: number,
  iconAllowOverlap: boolean,
  iconOpacity: number,
  iconHaloColor: string,
  iconHalowWidth: number
) {
  mapRef.addLayer({
    id: `${featureId}-icon`,
    type: 'symbol',
    source: featureId,
    layout: {
      visibility: visible ? 'visible' : 'none',
      'icon-image': iconImage, // Refers to the 'icon' property in the feature
      'icon-size': iconSize, // Resize icon
      'icon-allow-overlap': iconAllowOverlap,
    },
    paint: {
      'icon-opacity': iconOpacity,
      'icon-halo-color': iconHaloColor,
      'icon-halo-width': iconHalowWidth,
    },
  })
}

// Function to add the SVG as an image to the map
function loadSVGAsImage(map: maplibregl.Map, iconId: string, svgIcon: any) {
  // Check if image is already added

  const img = new Image()
  img.onload = () => {
    if (map.hasImage(iconId)) return
    map.addImage(iconId, img)
  }
  img.src = svgIcon.src
}
