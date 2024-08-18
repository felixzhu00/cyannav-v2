'use client'

import Choropleth from '../templates/Choropleth'
import LeftSidebar from '@/components/map-editor/left-bar/left-sidebar'
import MenuBar from '@/components/map-editor/title-bar/menubar'
import RightSideBar from '@/components/map-editor/right-bar/right-sidebar'
import { MapSchemaDecoded } from '@/actions/getMapById'
import { z } from 'zod'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import EditToolbar from '@/components/map-editor/map-content/edit-toolbar'

export default function MapEditPage({
  map,
}: {
  map: z.infer<typeof MapSchemaDecoded>
}) {
  console.log(map)
  const {
    title,
    owner,
    mapType,
    isPublished,
    geojson,
    likes,
    dislike,
    comments,
    sharedUsers,
    forkedFrom,
    dateCreated,
  } = map

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Fixed Top MenuBar */}
      <MenuBar
        title={title}
        owner={owner}
        isPublished={isPublished}
        sharedUsers={sharedUsers}
        forkedFrom={forkedFrom}
      />
      <div className="flex h-screen justify-between">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="min-w-[134px]" defaultSize={20}>
            <LeftSidebar geojson={geojson} />
          </ResizablePanel>
          <ResizableHandle withHandle />

          {/* Main Content */}
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full max-h-[calc(100vh-74px)] flex-grow justify-center border-x-2 border-zinc-700">
              <EditToolbar />
              {/* Your main content goes here */}
              <Choropleth geojson={geojson} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            {/* <RightSideBar geojson={geojson} messages={messages}/> */}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
