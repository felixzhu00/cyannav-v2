import { FeatureCollection, Point as PointType } from 'geojson';
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import {centroid} from '@turf/turf'
import geojsonData from '../../public/america.geo.json';

const geojson = geojsonData as FeatureCollection;

// Generate point data from GeoJSON
const generatePointData = (geojsonParam: FeatureCollection) => {
  const points = geojsonParam.features.map(feature => {
    const centroidFeature = centroid(feature);
    return {
      type: 'Feature',
      geometry: centroidFeature.geometry as PointType,
      properties: {
        pop_est: feature.properties?.pop_est || 0,
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features: points,
  };
};

const pointGeojson = generatePointData(geojson) as FeatureCollection;

export default function Point() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const [minPopEst, maxPopEst] = useMemo(() => {
    const popEstValues = geojson.features
      .map(feature => feature.properties?.pop_est || 0)
      .filter(value => value !== 0); // Filter out any undefined or zero values

    return [Math.min(...popEstValues), Math.max(...popEstValues)];
  }, [geojson]);

  const addMapLayers = useCallback(() => {
    if (!map.current) return;

    // Get the style layers and find the first symbol layer's ID
    const layers = map.current?.getStyle().layers;
    let firstSymbolId: string | undefined;

    if (layers) {
      const firstSymbolLayer = layers.find((layer) => layer.type === 'symbol');
      firstSymbolId = firstSymbolLayer?.id;
    }

    // Add the point source
    map.current.addSource('points', {
      type: 'geojson',
      data: pointGeojson,
    });

    // Add the circle layer
    map.current.addLayer({
      id: 'circles',
      type: 'circle',
      source: 'points',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'pop_est'],
          minPopEst,
          5, // Minimum radius
          maxPopEst,
          30 // Maximum radius
        ],
        'circle-color': '#ff5722',
        'circle-opacity': 0.8,
      },
    }, firstSymbolId);
  }, [minPopEst, maxPopEst]);

  useEffect(() => {
    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        zoom:.5,
      });

      map.current.on('load', () => {
        addMapLayers();
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [addMapLayers]);

  return (
    <div className="map-wrap h-[690px]">
      <div ref={mapContainer} className="map h-full" />
    </div>
  );
}


