'use client'

import { featureMap } from '@/lib/const'
import LeftSidebar from '@/components/map-editor/left-bar/left-sidebar'
import MenuBar from '@/components/map-editor/title-bar/menubar'
import RightSideBar from '@/components/map-editor/right-bar/right-sidebar'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import EditToolbar from '@/components/map-editor/map-content/edit-toolbar'

export default function MapPage({ params }: { params: { id: string } }) {
  const { id } = params

  if (!id || Array.isArray(id)) return <p>Invalid ID</p>

  const featureId = parseInt(id, 10)
  const feature = featureMap[featureId]

  if (!feature) return <p>Feature not found</p>

  const ComponentToRender = feature.component

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
          <ResizablePanel>
            <div className="flex h-full max-h-[calc(100vh-74px)] flex-grow justify-center border-x-2 border-zinc-700">
              <EditToolbar />
              {/* Your main content goes here */}
              <ComponentToRender />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            <RightSideBar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
