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
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import { useMapLibre } from '@/lib/hooks/use-maplibre'
import { useSetAtom } from 'jotai'

import { renderCollection } from '@/lib/maplibre-actions/map-render-layers'
import {
  handleCreate,
  handleSelectionChange,
} from '@/lib/maplibre-actions/map-apply-handler'
import DescriptionBox from './description-box'

export default function MapEditPage({
  initialMap,
  isOwner,
}: {
  initialMap: any
  isOwner?: boolean
}) {
  // Decode the GeoJson from REST API
  const decodedGeoJSON = decodeGeo(
    initialMap.geojson
  ) as CustomFeatureCollection

  // Decode the initial map data
  const decodedMap = {
    ...initialMap,
    geojson: decodedGeoJSON,
  }

  // Jotai Setters
  const setCurrLayer = useSetAtom(currLayerAtom)
  const updateMapByNewFeature = useSetAtom(updateMapByNewFeatureAtom)

  useHydrateAtoms([[mapAtom, decodedMap]]) // Hydrate Jotai map atom

  // Use the custom useMapLibre hook
  const { mapContainer } = useMapLibre({
    styleUrl: 'https://demotiles.maplibre.org/style.json',
    onMapLoad: (mapRef, drawRef, handler) => {
      // Ran when both MapRef and DrawRef has both loaded
      // Render the Initial Geojson File from server

      renderCollection(
        mapRef,
        drawRef,
        handler,
        setCurrLayer,
        decodedMap.geojson
      )

      // Initialize event listener for when a map-gl-draw create a shape
      mapRef.on('draw.create', (event) => {
        handleCreate(
          event,
          mapRef,
          drawRef,
          handler,
          setCurrLayer,
          updateMapByNewFeature
        )
      })

      // Initialize event listener for when a map-gl-draw selects a shape
      mapRef.on('draw.selectionchange', (event) => {
        handleSelectionChange(
          event,
          mapRef,
          drawRef,
          handler,
          setCurrLayer,
          updateMapByNewFeature
        )
      })
    },
  })

  return (
    <div className="flex h-screen w-full flex-col bg-pf">
      <MenuBar isOwner={isOwner} />
      <div className="flex h-screen justify-between">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="min-w-[160px]" defaultSize={20}>
            <LeftSidebar isOwner={isOwner} />
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60}>
            <div
              className="relative flex h-full max-h-[calc(100vh-74px)] flex-grow justify-center border-x-2 border-ring"
              ref={mapContainer}
              id="map-container"
            >
              {/* Your main content goes here */}
              <DescriptionBox />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            {isOwner && <RightBar />}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
