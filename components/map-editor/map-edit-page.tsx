'use client'

import { useHydrateAtoms } from 'jotai/utils'
import {
  currLayerAtom,
  mapAtom,
  setMapFieldAtom,
  updateMapByNewFeatureAtom,
} from '@/lib/jotai'
import LeftSidebar from '@/components/map-editor/left-bar/left-sidebar'
import RightBar from '@/components/map-editor/right-bar/right-bar'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import MenuBar from './title-bar/menubar'
import { decodeGeo } from '@/lib/utils'
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import { useMapLibre } from '@/lib/hooks/useMapLibre'
import { useSetAtom } from 'jotai'
import { renderMap } from '@/lib/map-render'

export default function MapEditPage({ initialMap }: { initialMap: any }) {
  const decodedGeoJSON = decodeGeo(
    initialMap.geojson
  ) as CustomFeatureCollection

  // const filteredFeatures = decodedGeoJSON.features.filter(
  //   (feature) => feature.properties?.name.payload === 'Canada'
  // )

  // Create a new GeoJSON with the filtered feature
  // const newGeojson: FeatureCollection<Geometry, GeoJsonProperties> = {
  //   type: 'FeatureCollection',
  //   features: filteredFeatures,
  // }

  // Decode the initial map data
  const decodedMap = {
    ...initialMap,
    geojson: decodedGeoJSON,
  }

  console.log(decodedGeoJSON)

  const setCurrLayer = useSetAtom(currLayerAtom)
  const updateMapByNewFeature = useSetAtom(updateMapByNewFeatureAtom)
  useHydrateAtoms([[mapAtom, decodedMap]])

  // Hydrate Jotai map atom

  // Use the custom useMapLibre hook
  const { mapContainer } = useMapLibre({
    mapGeo: decodedMap,
    styleUrl: 'https://demotiles.maplibre.org/style.json',
    onMapLoad: (mapRef, drawRef, sourceRef) => {
      renderMap(mapRef, sourceRef, drawRef, setCurrLayer, decodedMap.geojson) // Render layers with fill style

      // Listen for when the feature goes inactive and remove it from draw
      const handleSelectionChange = (event: any) => {
        const selectedFeatures = event.features

        if (selectedFeatures.length === 0) {
          // Get the Feature Collection that is going to be deleted
          const deletedCollection = drawRef.getAll()

          // Remove feature from draw
          drawRef.deleteAll()

          // Add Feature back to maplibre
          renderMap(mapRef, sourceRef, drawRef, setCurrLayer, deletedCollection)

          // Update backend of the change feature
          updateMapByNewFeature(deletedCollection.features[0])
          // const newGeo = updateFeature()
        }
      }
      mapRef.on('draw.selectionchange', handleSelectionChange)

      // applyHover(mapRef) // Apply hover event listener
      // applyClick(mapRef, drawRef, setCurrLayer, map.geojson) // Apply click event listener
      // applyEditMode(mapRef, drawRef, setCurrLayer, map.geojson) // Apply edit mode event listener
      // renderFillV2(drawRef, mapRef, decodedMap.geojson)
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
