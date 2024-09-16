import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import MapPin from '@/public/map-pin.svg'

// GeoFeature, Rectangle, Polygon
export function addInfillLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return

  // ID of source and layer
  const featureId = feature.id as string

  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}

  // Impute null values / create default render
  const populatedInfill: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        fillColor: featureRenderValues.fillColor
          ? featureRenderValues.fillColor
          : {
              payload: '#000000',
              variableType: 'color',
            },
        fillOpacity: featureRenderValues.fillOpacity
          ? featureRenderValues.fillOpacity
          : {
              payload: 0.4,
              variableType: 'number',
            },
        lineColor: featureRenderValues.fillColor
          ? featureRenderValues.fillColor
          : {
              payload: '#FFFFFF',
              variableType: 'color',
            },
        lineWidth: featureRenderValues.fillColor
          ? featureRenderValues.fillColor
          : {
              payload: 1,
              variableType: 'number',
            },
      },
    },
  }

  // Retreive the render values from newFeature
  const newRenderValues = populatedInfill.properties?.render

  // Extract render value
  const visible = populatedInfill.properties?.meta?.visible.payload
  const fillColor = newRenderValues.fillColor?.payload
  const fillOpacity = newRenderValues.fillOpacity?.payload
  const lineColor = newRenderValues.lineColor?.payload
  const lineWidth = newRenderValues.lineWidth?.payload

  // Add Source
  createSource(mapRef, featureId, populatedInfill)

  // Add Fill
  createFillLayer(mapRef, featureId, visible, fillColor, fillOpacity)

  // Add Line
  createLineLayer(mapRef, featureId, visible, lineColor, lineWidth)
}

// Lines and Splines
export function addUnfillLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return
  // ID of source and layer
  const featureId = feature.id as string

  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}

  // Impute null values / create default render
  const populatedUnfill: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        lineColor: featureRenderValues.fillColor
          ? featureRenderValues.fillColor
          : {
              payload: '#FFFFFF',
              variableType: 'color',
            },
        lineWidth: featureRenderValues.fillColor
          ? featureRenderValues.fillColor
          : {
              payload: 1,
              variableType: 'number',
            },
      },
    },
  }

  // Retreive the render values from newFeature
  const newRenderValues = populatedUnfill.properties?.render

  // Extract render value
  const visible = populatedUnfill.properties?.meta?.visible.payload
  const lineColor = newRenderValues.lineColor?.payload
  const lineWidth = newRenderValues.lineWidth?.payload

  // Add Source
  createSource(mapRef, featureId, populatedUnfill)

  // Add Line
  createLineLayer(mapRef, featureId, visible, lineColor, lineWidth)
}

// Circle
export function addCircleFillLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return
  // ID of source and layer
  const featureId = feature.id as string

  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}

  // Impute null values / create default render
  const populatedCircle: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        circleColor: featureRenderValues.circleColor
          ? featureRenderValues.circleColor
          : {
              payload: '#000000',
              variableType: 'color',
            },
        circleOpacity: featureRenderValues.circleOpacity
          ? featureRenderValues.circleOpacity
          : {
              payload: 0.4,
              variableType: 'number',
            },
        circleStrokeColor: featureRenderValues.circleStrokeColor
          ? featureRenderValues.circleStrokeColor
          : {
              payload: '#FFFFFF',
              variableType: 'color',
            },
        circleStrokeWidth: featureRenderValues.circleStrokeWidth
          ? featureRenderValues.circleStrokeWidth
          : {
              payload: 1,
              variableType: 'number',
            },
      },
    },
  }

  // Retreive the render values from newFeature
  const newRenderValues = populatedCircle.properties?.render

  // Extract render value
  const visible = populatedCircle.properties?.meta?.visible.payload
  const circleColor = newRenderValues.circleColor?.payload
  const circleOpacity = newRenderValues.circleOpacity?.payload
  const circleStrokeColor = newRenderValues.circleStrokeColor?.payload
  const circleStrokeWidth = newRenderValues.circleStrokeWidth?.payload
  const circleRadius = newRenderValues.radius?.payload
  console.log(
    visible,
    circleColor,
    circleOpacity,
    circleStrokeColor,
    circleStrokeWidth,
    circleRadius
  )

  // Add Source
  createSource(mapRef, featureId, populatedCircle)

  // Add Line
  createCircleLayer(
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

export function addImageLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return
  // ID of source and layer
  const featureId = feature.id as string

  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}

  // Impute null values / create default render
  const populatedCircle: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        iconSize: featureRenderValues.iconSize
          ? featureRenderValues.iconSize
          : {
              payload: 1.25,
              variableType: 'number',
            },
        iconAllowOverlap: featureRenderValues.iconAllowOverlap
          ? featureRenderValues.iconAllowOverlap
          : {
              payload: true,
              variableType: 'boolean',
            },
        iconOpacity: featureRenderValues.iconOpacity
          ? featureRenderValues.iconOpacity
          : {
              payload: 1.0,
              variableType: 'number',
            },
        iconHaloColor: featureRenderValues.iconHaloColor
          ? featureRenderValues.iconHaloColor
          : {
              payload: '#000000',
              variableType: 'color',
            },
        iconHalowWidth: featureRenderValues.iconHalowWidth
          ? featureRenderValues.iconHalowWidth
          : {
              payload: 2,
              variableType: 'number',
            },
      },
    },
  }

  // Retreive the render values from newFeature
  const newRenderValues = populatedCircle.properties?.render

  // Extract render value
  const visible = populatedCircle.properties?.meta?.visible.payload
  // const circleColor = newRenderValues.circleColor?.payload
  const iconSize = newRenderValues.iconSize?.payload
  const iconAllowOverlap = newRenderValues.iconAllowOverlap?.payload
  const iconOpacity = newRenderValues.iconOpacity?.payload
  const iconHaloColor = newRenderValues.iconHaloColor?.payload
  const iconHalowWidth = newRenderValues.iconHalowWidth?.payload

  // Add point feature as a source to mapRef
  createSource(mapRef, featureId, feature)

  // Add SVG
  loadSVGAsImage(mapRef, featureId, MapPin)

  console.log(
    visible,
    featureId,
    iconSize,
    iconAllowOverlap,
    iconOpacity,
    iconHaloColor,
    iconHalowWidth
  )

  createMarkerLayer(
    mapRef,
    featureId,
    visible,
    featureId,
    iconSize,
    iconAllowOverlap,
    iconOpacity,
    iconHaloColor,
    iconHalowWidth
  )
}

export function addTextLayer(
  mapRef: maplibregl.Map | null,
  feature: Feature<Geometry, GeoJsonProperties>
) {
  if (!mapRef) return
  // ID of source and layer
  const featureId = feature.id as string

  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}

  // Impute null values / create default render
  const populatedCircle: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        textInput: featureRenderValues.textInput
          ? featureRenderValues.textInput
          : {
              payload: 'text placeholder',
              variableType: 'string',
            },
        textSize: featureRenderValues.textSize
          ? featureRenderValues.textSize
          : {
              payload: 14,
              variableType: 'number',
            },
        textFont: featureRenderValues.textFont
          ? featureRenderValues.textFont
          : {
              payload: 'Open Sans Regular',
              variableType: 'string',
            },
        textAnchor: featureRenderValues.textAnchor
          ? featureRenderValues.textAnchor
          : {
              payload: 'center',
              variableType: 'string',
            },
        textOverlap: featureRenderValues.textOverlap
          ? featureRenderValues.textOverlap
          : {
              payload: true,
              variableType: 'boolean',
            },
        textPlacement: featureRenderValues.textPlacement
          ? featureRenderValues.textPlacement
          : {
              payload: false,
              variableType: 'boolean',
            },
        textColor: featureRenderValues.textColor
          ? featureRenderValues.textColor
          : {
              payload: '#000000',
              variableType: 'color',
            },
        textHaloColor: featureRenderValues.textHaloColor
          ? featureRenderValues.textHaloColor
          : {
              payload: '#FFFFFF',
              variableType: 'color',
            },
        textHaloWidth: featureRenderValues.textHaloWidth
          ? featureRenderValues.textHaloWidth
          : {
              payload: 1.5,
              variableType: 'number',
            },
      },
    },
  }

  // Retreive the render values from newFeature
  const newRenderValues = populatedCircle.properties?.render

  // Extract render value
  const visible = populatedCircle.properties?.meta?.visible.payload
  const textInput = newRenderValues.textInput?.payload
  const textSize = newRenderValues.textSize?.payload
  const textFont = newRenderValues.textFont?.payload
  const textAnchor = newRenderValues.textAnchor?.payload
  const textOverlap = newRenderValues.textOverlap?.payload
  const textPlacement = newRenderValues.textPlacement?.payload
  const textColor = newRenderValues.textColor?.payload
  const textHaloColor = newRenderValues.textHaloColor?.payload
  const textHaloWidth = newRenderValues.textHaloWidth?.payload

  // Add point feature as a source to mapRef
  createSource(mapRef, featureId, populatedCircle)

  createTextLayer(
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

export function createSource(
  mapRef: maplibregl.Map,
  featureId: string,
  feature: Feature
) {
  // Add a source for the feature
  mapRef.addSource(featureId, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [feature],
    },
    promoteId: 'id',
  })
}

export function createFillLayer(
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
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'visible'], visible],
        [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          selectColor, // Color for selected features
          ['boolean', ['feature-state', 'hover'], false],
          hoverColor, // Color for hovered features
          fillColor, // Default color
        ],
        'rgba(0,0,0,0)', // Transparent color for hidden features
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'visible'], visible],
        [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          selectOpacity, // Opacity for selected features
          ['boolean', ['feature-state', 'hover'], false],
          hoverOpacity, // Opacity for hovered features
          fillOpacity, // Default opacity
        ],
        0, // Fully transparent for hidden features
      ],
    },
  })
}

export function createLineLayer(
  mapRef: maplibregl.Map,
  featureId: string,
  visible: boolean, // in render
  lineColor: string, // in render
  lineWidth: number // in render
) {
  // Add an outline layer for the feature
  mapRef.addLayer({
    id: `${featureId}-outline`,
    type: 'line',
    source: featureId,
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'visible'], visible],
        lineColor, // Color for visible features
        'rgba(0,0,0,0)', // Transparent color for hidden features
      ],
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'visible'], visible],
        lineWidth, // Width for visible features
        0, // Width for hidden features
      ],
    },
  })
}

export function createCircleLayer(
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
  // const metersPerPixel = (lat: number, zoom: number) =>
  //   (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)

  // Convert radius in kilometers to meters
  const radiusInMeters = circleRadius

  // Add a fill layer for the feature
  mapRef.addLayer({
    id: `${featureId}-fill`,
    type: 'circle',
    source: featureId,
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'visible'], visible],
        [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          selectColor, // Color for selected features
          ['boolean', ['feature-state', 'hover'], false],
          hoverColor, // Color for hovered features
          circleColor, // Default color
        ],
        'rgba(0,0,0,0)', // Transparent color for hidden features
      ],
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'visible'], visible],
        [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          selectOpacity, // Opacity for selected features
          ['boolean', ['feature-state', 'hover'], false],
          hoverOpacity, // Opacity for hovered features
          circleOpacity, // Default opacity
        ],
        0, // Fully transparent for hidden features
      ],
      'circle-stroke-color': [
        'case',
        ['boolean', ['feature-state', 'visible'], visible],
        circleStrokeColor,
        'rgba(0,0,0,0)', // Fully transparent for hidden features
      ],
      'circle-stroke-width': [
        'case',
        ['boolean', ['feature-state', 'visible'], visible],
        circleStrokeWidth,
        0, // Fully transparent for hidden features
      ],
      'circle-radius': radiusInMeters,
    },
  })
}

export function createTextLayer(
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
    id: `${featureId}-fill`,
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

export function createMarkerLayer(
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
    id: `${featureId}-fill`,
    type: 'symbol',
    source: featureId,
    layout: {
      'icon-image': iconImage, // Refers to the 'icon' property in the feature
      'icon-size': iconSize, // Resize icon
      'icon-allow-overlap': iconAllowOverlap,
    },
    paint: {
      'icon-opacity': [
        'case',
        ['boolean', ['feature-state', 'visible'], visible],
        iconOpacity,
        0, // Fully transparent for hidden features
      ],
      'icon-halo-color': iconHaloColor,
      'icon-halo-width': iconHalowWidth,
    },
  })
}

// Function to add the SVG as an image to the map
function loadSVGAsImage(map: maplibregl.Map, iconId: string, svgIcon: any) {
  const img = new Image()
  img.onload = () => {
    map.addImage(iconId, img)
  }
  img.src = svgIcon.src
}
