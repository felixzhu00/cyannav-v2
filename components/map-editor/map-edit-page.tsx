'use client'

import { useHydrateAtoms } from 'jotai/utils'
import { currLayerAtom, mapAtom, updateMapByNewFeatureAtom } from '@/lib/jotai'
import LeftSidebar from '@/components/map-editor/left-bar/left-sidebar'
import RightBar from '@/components/map-editor/right-bar/right-bar'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import MenuBar from './title-bar/menubar'
import { decodeGeo } from '@/lib/utils'
import {
  CustomFeature,
  CustomFeatureCollection,
} from '@/core/_entities/types/map.types'
import { useMapLibre } from '@/lib/hooks/use-maplibre'
import { useSetAtom } from 'jotai'
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic'
import { renderCollection } from '@/lib/maplibre-actions/map-render-layers'
import { populateDefault } from '@/lib/maplibre-actions/map-utils'

export default function MapEditPage({ initialMap }: { initialMap: any }) {
  const decodedGeoJSON = decodeGeo(
    initialMap.geojson
  ) as CustomFeatureCollection
  // Decode the initial map data
  const decodedMap = {
    ...initialMap,
    geojson: decodedGeoJSON,
  }

  console.log(decodedGeoJSON)
  const setCurrLayer = useSetAtom(currLayerAtom)
  const updateMapByNewFeature = useSetAtom(updateMapByNewFeatureAtom)

  useHydrateAtoms([[mapAtom, decodedMap]]) // Hydrate Jotai map atom

  // Use the custom useMapLibre hook
  const { mapContainer } = useMapLibre({
    styleUrl: 'https://demotiles.maplibre.org/style.json',
    onMapLoad: (mapRef, drawRef, sourceRef) => {
      renderCollection(
        mapRef,
        sourceRef,
        drawRef,
        setCurrLayer,
        decodedMap.geojson
      ) // Render layers with fill style

      // Listen for when the feature goes inactive and remove it from draw
      const handleSelectionChange = (event: any) => {
        const selectedFeatures = event.features
        if (selectedFeatures.length === 0) {
          // Get the Feature Collection that is going to be deleted
          const deletedCollection = drawRef.getAll()

          // Remove feature from draw
          drawRef.deleteAll()

          // Add Feature back to maplibre
          renderCollection(
            mapRef,
            sourceRef,
            drawRef,
            setCurrLayer,
            deletedCollection
          )

          // Update backend of the change feature
          updateMapByNewFeature(deletedCollection.features[0])
          // const newGeo = updateFeature()
        }
      }

      // Handles adding feature to atom upon creation
      const handleCreate = (event: any) => {
        const currentCollection = drawRef.getAll()
        const createdFeature = currentCollection.features[0]
        const currentMode = drawRef.getMode()

        console.log(currentCollection)

        // Initialize default value for Polygon, Rectangle, Circle, Point, Line, Spine
        const newFeaturePopulated = {
          ...createdFeature,
          properties: {
            ...createdFeature.properties,
            id: createdFeature.id,
            // Ensure render is initialized as an empty object if it doesn't exist
            render: {
              ...(createdFeature.properties?.render || {}),
              name: {
                payload: `New Feature`,
                variableType: 'string',
              },
              visible: {
                payload: true,
                variableType: 'boolean',
              },
              lock: {
                payload: false,
                variableType: 'boolean',
              },
              draw: {
                payload: currentMode,
                variableType: 'string',
              },
            },
          },
        }

        // If a Point
        if (currentMode === 'draw_point') {
          newFeaturePopulated.properties.render.radius = {
            payload: 10,
            variableType: 'number',
          }
        }

        // If a Circle is created
        if (createdFeature.properties.circleRadius) {
          const geojson = event.features[0] // created Circle
          const center = MapboxDrawGeodesic.getCircleCenter(geojson)
          const radius = MapboxDrawGeodesic.getCircleRadius(geojson)

          // Convert radius from kilometers to meters
          const radiusInMeters = radius * 1000

          const radiusInDegreesLng =
            ((radiusInMeters / 6378137) * (180 / Math.PI)) /
            Math.cos((center[1] * Math.PI) / 180)

          // Create a new point for the circumference
          const circumferencePoint: [number, number] = [
            center[0] + radiusInDegreesLng, // Longitude shift
            center[1], // Latitude remains the same
          ]

          // Project both the center and circumference point into pixel coordinates
          const centerPixel = mapRef.project(center)
          const circumferencePixel = mapRef.project(circumferencePoint)

          // Calculate the distance in pixels
          const radiusInPixels = Math.sqrt(
            (circumferencePixel.x - centerPixel.x) ** 2 +
              (circumferencePixel.y - centerPixel.y) ** 2
          )

          // Update geometry
          newFeaturePopulated.geometry = {
            type: 'Point',
            coordinates: center,
          }

          // Update radius
          newFeaturePopulated.properties.render.radius = {
            payload: radiusInPixels,
            variableType: 'number',
          }
        }

        const newFeatureAfterDefault = populateDefault(
          newFeaturePopulated
        ) as CustomFeature

        const newCollection: CustomFeatureCollection = {
          type: 'FeatureCollection',
          features: [newFeatureAfterDefault],
          _shared: { mode: 'none' },
        }

        // Remove collection
        drawRef.deleteAll()

        // Add Feature back to maplibre
        renderCollection(
          mapRef,
          sourceRef,
          drawRef,
          setCurrLayer,
          newCollection
        )
        // Update atom collection
        updateMapByNewFeature(newFeatureAfterDefault)

        // Change to select
        // drawRef.changeMode(currentMode)
        // Update React State

        // This code allow continues drawing
        setTimeout(() => {
          drawRef.changeMode(currentMode)
        }, 0)
      }

      mapRef.on('draw.create', handleCreate)

      mapRef.on('draw.selectionchange', handleSelectionChange)
    },
  })

  return (
    <div className="flex h-screen w-full flex-col">
      <MenuBar />
      <div className="flex h-screen justify-between">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="min-w-[134px]" defaultSize={20}>
            <LeftSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60}>
            <div
              className="flex h-full max-h-[calc(100vh-74px)] flex-grow justify-center border-x-2 border-zinc-700"
              ref={mapContainer}
              id="map-container"
            >
              {/* Your main content goes here */}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            <RightBar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
