import { mapDrawAtom } from '@/lib/jotai'
import { Menubar } from '@/components/ui/menubar'
import { cn } from '@/lib/utils'
import { useAtomValue } from 'jotai'
import {
  MousePointer,
  Circle,
  Spline,
  Minus,
  Type,
  MapPin,
  File,
  Ruler,
  Pencil,
  Pentagon,
  Dot,
  Image as ImageIcon,
  MapPinPlus,
  GitFork,
  Download,
  RectangleHorizontal,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import SelectMenuBar from './select-menu-bar'

const menu = [
  [
    {
      label: 'Cursor',
      icon: <MousePointer className="h-5 w-5" />,
      draw: 'simple_select',
    },
    {
      label: 'Measure',
      icon: <Ruler className="h-5 w-5" />,
      draw: undefined, // TODO
    },
  ],
  [
    {
      label: 'Text',
      icon: <Type className="h-5 w-5" />,
      draw: undefined, // TODO
    },
    {
      label: 'Draw',
      icon: <Pencil className="h-5 w-5" />,
      draw: undefined, // TODO
    },
  ],
  [
    {
      label: 'Line',
      icon: <Minus className="-rotate-45 scale-x-125 scale-y-100 transform" />,
      draw: 'draw_line_string',
    },
    {
      label: 'Spline',
      icon: <Spline className="h-5 w-5" />,
      draw: undefined, // TODO
    },
  ],
  [
    {
      label: 'Rectangle',
      icon: <RectangleHorizontal className="h-5 w-5" />,
      // draw: 'draw_rectangle',
    },
    {
      label: 'Circle',
      icon: <Circle className="h-5 w-5" />,
      // draw: 'draw_circle',
    },
    {
      label: 'Polygon',
      icon: <Pentagon className="h-5 w-5" />,
      draw: 'draw_polygon',
    },
  ],
  [
    {
      label: 'Marker',
      icon: <MapPin className="h-5 w-5" />,
      draw: undefined, // TODO
    },
    {
      label: 'Custom Marker',
      icon: <MapPinPlus className="h-5 w-5" />,
      draw: undefined, // TODO
    },
    {
      label: 'Point',
      icon: <Dot className="h-5 w-5" />,
      draw: 'draw_point',
    },
  ],
]

const file = [
  // Trigger Icon Only
  {
    label: 'Trigger',
    icon: <File className="h-5 w-5" />,
    draw: undefined,
  },
  // Dropdown Options
  {
    label: 'Export',
    icon: <Download className="h-5 w-5" />,
    draw: undefined,
  },
  {
    label: 'Fork',
    icon: <GitFork className="h-5 w-5" />,
    draw: undefined,
  },
  {
    label: 'Download PNG',
    icon: <ImageIcon className="h-5 w-5" />,
    draw: undefined,
  },
]

export default function EditToolbar({ className }: { className: string }) {
  // TODO add tooltip for each menuCol
  const drawRef = useAtomValue(mapDrawAtom)

  const [currSelectedMode, setCurrSelectedMode] = useState({
    menuColIndex: 0, // Row of "menu" matrix
    menuItemIndex: 0, // Col of "menu" matrix
  }) // postion in "menu" matrix, default to cursor

  useEffect(() => {
    // Get the label and draw from matrix
    if (drawRef) {
      console.log(
        menu[currSelectedMode.menuColIndex][currSelectedMode.menuItemIndex]
          .label
      )
      const current =
        menu[currSelectedMode.menuColIndex][currSelectedMode.menuItemIndex]
      const currentLabel = current.label
      const currentDraw = current.draw

      if (currentDraw) drawRef.changeMode(currentDraw)

      console.log(currentLabel)
    }
  }, [currSelectedMode, drawRef])

  return (
    <div className={cn('h-full flex-1', className)}>
      <Menubar className="inline-flex h-full space-x-0 border-0 bg-transparent p-0 dark:bg-transparent">
        {/* File Option : using SelectMenuBar just for identical styling */}
        <SelectMenuBar
          items={file}
          setCurrSelectedMode={() => {}} // Dummy prop
          menuColIndex={-1} // Dummy prop
          isActive={false}
          isFile
        />
        {/* Menu Columns */}
        {menu.map((menuCol, index) => (
          <SelectMenuBar
            key={menuCol[0].label}
            items={menuCol}
            setCurrSelectedMode={setCurrSelectedMode}
            menuColIndex={index}
            isActive={currSelectedMode.menuColIndex === index}
          />
        ))}
      </Menubar>
    </div>
  )
}
