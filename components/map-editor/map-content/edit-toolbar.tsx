import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import {
  MousePointer,
  Square,
  Circle,
  Spline,
  Minus,
  Type,
  MapPin,
} from 'lucide-react'

export default function EditToolbar() {
  return (
    <div className="top-70 absolute pt-2">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="flex items-center justify-center">
            <MousePointer className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex items-center justify-center">
            <Type className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex items-center justify-center">
            <Minus className="h-5 w-5 -rotate-45" />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex items-center justify-center">
            <Spline className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex items-center justify-center">
            <Circle className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex items-center justify-center">
            <Square className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
