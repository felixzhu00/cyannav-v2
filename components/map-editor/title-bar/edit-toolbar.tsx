import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar'
import { cn } from '@/lib/utils'
import {
  MousePointer,
  Square,
  Circle,
  Spline,
  Minus,
  Type,
  MapPin,
  File,
  ChevronDown,
} from 'lucide-react'

export default function EditToolbar({ className }: { className: string }) {
  return (
    <div className={cn('flex-1', className)}>
      <Menubar className="inline-flex bg-blue-500">
        <MenubarMenu>
          <MenubarTrigger className="flex flex-row items-center space-x-2 px-3">
            <File className="mr-1 h-5 w-5" />
            <ChevronDown className="h-3 w-3" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Export</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Fork</MenubarItem>
            <MenubarItem>Download PNG</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="flex flex-row items-center space-x-2 px-3">
            <MapPin className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex flex-row items-center space-x-2 px-3">
            <MousePointer className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex flex-row items-center space-x-2 px-3">
            <Type className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex flex-row items-center space-x-2 px-3">
            <Minus className="h-5 w-5 -rotate-45" />
            <ChevronDown className="h-3 w-3" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Spline className="h-5 w-5" /> Spline
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Minus className="h-5 w-5 -rotate-45" /> Line
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex flex-row items-center space-x-2 px-3">
            <Circle className="h-5 w-5" />
            <ChevronDown className="h-3 w-3" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Square className="h-5 w-5" /> Square
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Circle className="h-5 w-5" /> Circle
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="flex flex-row items-center space-x-2 px-3">
            <MapPin className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
