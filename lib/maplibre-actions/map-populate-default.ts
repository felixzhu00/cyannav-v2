import { Feature, GeoJsonProperties, Geometry } from 'geojson'

// Populate new 'feature' with default values
export function populateInfill(feature: Feature<Geometry, GeoJsonProperties>) {
  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}

  // Impute null values / create default render
  const populatedInfill: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        'fill-color': featureRenderValues['fill-color']
          ? featureRenderValues['fill-color']
          : {
              payload: '#FFFFFF',
              variableType: 'color',
            },
        'fill-opacity': featureRenderValues['fill-opacity']
          ? featureRenderValues['fill-opacity']
          : {
              ...fraction,
              payload: 0.6,
              variableType: 'number',
            },
        'line-color': featureRenderValues['line-color']
          ? featureRenderValues['line-color']
          : {
              payload: '#000000',
              variableType: 'color',
            },
        'line-width': featureRenderValues['line-width']
          ? featureRenderValues['line-width']
          : {
              ...width,
              payload: 3,
              variableType: 'number',
            },
      },
    },
  }

  return populatedInfill
}

export function populateUnfill(feature: Feature<Geometry, GeoJsonProperties>) {
  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}

  // Impute null values / create default render
  const populatedUnfill: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        'line-color': featureRenderValues['line-color']
          ? featureRenderValues['line-color']
          : {
              payload: '#000000',
              variableType: 'color',
            },
        'line-width': featureRenderValues['line-width']
          ? featureRenderValues['line-width']
          : {
              ...width,
              payload: 3,
              variableType: 'number',
            },
      },
    },
  }

  return populatedUnfill
}

export function populateCircle(feature: Feature<Geometry, GeoJsonProperties>) {
  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}

  // Impute null values / create default render
  const populatedCircle: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        'circle-color': featureRenderValues['circle-color']
          ? featureRenderValues['circle-color']
          : {
              payload: '#FFFFFF',
              variableType: 'color',
            },
        'circle-opacity': featureRenderValues['circle-opacity']
          ? featureRenderValues['circle-opacity']
          : {
              ...fraction,
              payload: 0.6,
              variableType: 'number',
            },
        'circle-stroke-color': featureRenderValues['circle-stroke-color']
          ? featureRenderValues['circle-stroke-color']
          : {
              payload: '#000000',
              variableType: 'color',
            },
        'circle-stroke-width': featureRenderValues['circle-stroke-width']
          ? featureRenderValues['circle-stroke-width']
          : {
              ...width,
              payload: 3,
              variableType: 'number',
            },
      },
    },
  }

  return populatedCircle
}

export function populateIcon(feature: Feature<Geometry, GeoJsonProperties>) {
  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}

  // Impute null values / create default render
  const populatedIcon: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        'icon-size': featureRenderValues['icon-size']
          ? featureRenderValues['icon-size']
          : {
              ...size,
              payload: 1.25,
              variableType: 'number',
            },
        'icon-allow-overlap': featureRenderValues['icon-allow-overlap']
          ? featureRenderValues['icon-allow-overlap']
          : {
              payload: true,
              variableType: 'boolean',
            },
        'icon-opacity': featureRenderValues['icon-opacity']
          ? featureRenderValues['icon-opacity']
          : {
              ...fraction,
              payload: 1.0,
              variableType: 'number',
            },
        'icon-halo-color': featureRenderValues['icon-halo-color']
          ? featureRenderValues['icon-halo-color']
          : {
              payload: '#000000',
              variableType: 'color',
            },
        'icon-halo-width': featureRenderValues['icon-halo-width']
          ? featureRenderValues['icon-halo-width']
          : {
              ...width,
              payload: 2,
              variableType: 'number',
            },
      },
    },
  }
  return populatedIcon
}

export function populateText(feature: Feature<Geometry, GeoJsonProperties>) {
  // Retreive the render values
  const featureRenderValues = feature.properties?.render || {}


  // Impute null values / create default render
  const populatedText: Feature = {
    ...feature,
    properties: {
      ...feature.properties,
      render: {
        ...featureRenderValues,
        'text-field': featureRenderValues['text-field']
          ? featureRenderValues['text-field']
          : {
              payload: 'text placeholder',
              variableType: 'string',
            },
        'text-size': featureRenderValues['text-size']
          ? featureRenderValues['text-size']
          : {
              ...size,
              payload: 14,
              variableType: 'number',
            },
        'text-font': featureRenderValues['text-font']
          ? featureRenderValues['text-font']
          : {
              payload: 'Open Sans Regular',
              variableType: 'string',
            },
        'text-anchor': featureRenderValues['text-anchor']
          ? featureRenderValues['text-anchor']
          : {
              payload: 'center',
              variableType: 'string',
            },
        'text-overlap': featureRenderValues['text-overlap']
          ? featureRenderValues['text-overlap']
          : {
              payload: true,
              variableType: 'boolean',
            },
        'text-placement': featureRenderValues['text-placement']
          ? featureRenderValues['text-placement']
          : {
              payload: false,
              variableType: 'boolean',
            },
        'text-color': featureRenderValues['text-color']
          ? featureRenderValues['text-color']
          : {
              payload: '#000000',
              variableType: 'color',
            },
        'text-halo-color': featureRenderValues['text-halo-color']
          ? featureRenderValues['text-halo-color']
          : {
              payload: '#FFFFFF',
              variableType: 'color',
            },
        'text-halo-width': featureRenderValues['text-halo-width']
          ? featureRenderValues['text-halo-width']
          : {
              ...width,
              payload: 1.5,
              variableType: 'number',
            },
      },
    },
  }

  console.log(populatedText)
  return populatedText
}

// For standard input range and step for number
const fraction = {
  range: [0, 1],
  step: 0.1,
}

const width = {
  range: [0, 12],
  step: 1,
}

const size = {
  range: [0, 40],
  step: 1,
}
