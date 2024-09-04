'use client'

import { useHydrateAtoms } from 'jotai/utils'
import { currLayerAtom, mapAtom } from '@/lib/jotai'
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
import { applyClick, applyHover, renderFill } from '@/lib/map-render'

export default function MapEditPage({ initialMap }: { initialMap: any }) {
  // Decode the initial map data
  const decodedMap = {
    ...initialMap,
    geojson: decodeGeo(initialMap.geojson) as CustomFeatureCollection,
  }

  const setCurrLayer = useSetAtom(currLayerAtom)

  // Hydrate Jotai map atom
  useHydrateAtoms([[mapAtom, decodedMap]])

  // Use the custom useMapLibre hook
  const { mapContainer } = useMapLibre({
    styleUrl: 'https://demotiles.maplibre.org/style.json',
    onMapLoad: (mapRef) => {
      renderFill({ current: mapRef }, decodedMap.geojson) // Render layers with fill style
      applyHover({ current: mapRef }) // Apply hover event listener
      applyClick({ current: mapRef }, setCurrLayer) // Apply click event listener
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
