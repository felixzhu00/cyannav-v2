'use client'

import { useHydrateAtoms } from 'jotai/utils'
import { mapAtom } from '@/atoms/jotai'
import Choropleth from '../templates/Choropleth'
import LeftSidebar from '@/components/map-editor/left-bar/left-sidebar'
import RightSideBar from '@/components/map-editor/right-bar/right-sidebar'
import { MapSchemaDecodedType } from '@/lib/types'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import MenuBar from './title-bar/menubar'

export default function MapEditPage({
  initialMap,
}: {
  initialMap: MapSchemaDecodedType
}) {
  useHydrateAtoms([[mapAtom, initialMap]])

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Fixed Top MenuBar */}
      <MenuBar />
      <div className="flex h-screen justify-between">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="min-w-[134px]" defaultSize={20}>
            <LeftSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />

          {/* Main Content */}
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full max-h-[calc(100vh-74px)] flex-grow justify-center border-x-2 border-zinc-700">
              {/* Your main content goes here */}
              {/* <Choropleth/> */}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            <RightSideBar/>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
