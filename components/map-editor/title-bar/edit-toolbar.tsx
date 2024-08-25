import { selectedEditOptionAtom } from '@/atoms/jotai'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
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
  // State to track the selected trigger
  const [selectedTrigger, setSelectedTrigger] = useAtom(selectedEditOptionAtom)

  // Helper function to determine the class names
  const triggerStyle = (triggerId: string) =>
    cn(
      'flex flex-row items-center space-x-2 px-3 h-full aspect-square justify-center',
      'bg-transparent dark:bg-transparent',
      'hover:bg-zinc-700 dark:hover:bg-zinc-700',
      {
        'bg-blue-800 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-800':
          selectedTrigger === triggerId, // Change background color when selected
      }
    )

  return (
    <div className={cn('h-full flex-1', className)}>
      <Menubar className="inline-flex h-full space-x-0 border-0 bg-transparent p-0 dark:bg-transparent">
        <MenubarMenu>
          <MenubarTrigger
            className={triggerStyle('file')}
            onClick={() => setSelectedTrigger('file')}
          >
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
          <MenubarTrigger
            className={triggerStyle('pointer')}
            onClick={() => setSelectedTrigger('pointer')}
          >
            <MousePointer className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger
            className={triggerStyle('type')}
            onClick={() => setSelectedTrigger('type')}
          >
            <Type className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger
            className={triggerStyle('minus')}
            onClick={() => setSelectedTrigger('minus')}
          >
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
          <MenubarTrigger
            className={triggerStyle('circle')}
            onClick={() => setSelectedTrigger('circle')}
          >
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
          <MenubarTrigger
            className={triggerStyle('pin')}
            onClick={() => setSelectedTrigger('pin')}
          >
            <MapPin className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
