// OPTION FOR DRAW PLUGIN
export const styles = [
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

// Maps property to either layout or paint for edit purpose
export const layerMap: any = {
  text: {
    visibility: 'layout',
    'text-field': 'layout',
    'text-size': 'layout',
    // 'text-font': 'layout',
    'text-offset': 'layout',
    'text-anchor': 'layout',
    'text-allow-overlap': 'layout',
    'text-ignore-placement': 'layout',
    'text-color': 'paint',
    'text-halo-color': 'paint',
    'text-halo-width': 'paint',
  },
  marker: {
    'icon-image': 'layout',
    'icon-size': 'layout',
    'icon-allow-overlap': 'layout',
    'icon-opacity': 'paint',
    'icon-halo-color': 'paint',
    'icon-halo-width': 'paint',
    'icon-color': 'change-icon-color',
  },
}

// Categorize some shapes by infill and unfill
export const infill = ['feature', 'draw_rectangle', 'draw_polygon']

export const unfill = ['draw_line_string', 'draw_bezier_curve']

// Maps draw to layerId type
export const drawToLayerType = {
  text: 'text',
  marker: 'icon',
  draw_line_string: 'line',
  draw_bezier_curve: 'line',
  draw_circle: 'circle',
  draw_point: 'circle',
}

// draw no that does nothing
export const NoOpMode = {
  onSetup() {
    return {} // Empty state since there's no setup needed
  },

  onClick() {
    // Prevent any drawing or interaction when clicking
    return false
  },

  onDrag() {
    // Disable dragging
    return false
  },

  onMouseMove() {
    // Prevent hover effects
    return false
  },

  onStop() {
    return {} // Cleanup if needed
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toDisplayFeatures(_state: any, _geojson: any, _display: any) {
    // Do nothing, do not display any features
  },

  onKeyUp() {
    // Handle escape key to possibly exit the mode if needed
    return false
  },
}

// draw no that does nothing
export const SelectMode = {
  onSetup() {
    return {} // Empty state since there's no setup needed
  },

  onClick() {
    // Prevent any drawing or interaction when clicking
    return false
  },

  onDrag() {
    // Disable dragging
    return false
  },

  onMouseMove() {
    // Prevent hover effects
    return false
  },

  onStop() {
    return {} // Cleanup if needed
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toDisplayFeatures(_state: any, _geojson: any, _display: any) {
    // Do nothing, do not display any features
  },

  onKeyUp() {
    // Handle escape key to possibly exit the mode if needed
    return false
  },
}


export const mapPin =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>'
