import {
  currLayerAtom,
  mapDrawAtom,
  mapLibreAtom,
  mapSourceAtom,
  updateMapByNewFeatureAtom,
} from '@/lib/jotai'
import { Menubar } from '@/components/ui/menubar'
import { cn } from '@/lib/utils'
import { useAtomValue, useSetAtom } from 'jotai'
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
import {
  addImageLayer,
  addTextLayer,
  createMarkerLayer,
  createSource,
} from '@/lib/render/manage-layers'
import { nanoid } from 'nanoid'
import { Feature } from 'geojson'
import { renderMap } from '@/lib/map-render'
import {
  CustomFeature,
  CustomFeatureCollection,
} from '@/core/_entities/types/map.types'

const menu = [
  [
    {
      label: 'Cursor',
      icon: <MousePointer className="h-5 w-5" />,
      draw: 'simple_select',
    },
    // {
    //   label: 'Measure',
    //   icon: <Ruler className="h-5 w-5" />,
    //   draw: undefined, // TODO
    // },
  ],
  [
    {
      label: 'Text',
      icon: <Type className="h-5 w-5" />,
      draw: 'text', // TODO
    },
    // {
    //   label: 'Draw',
    //   icon: <Pencil className="h-5 w-5" />,
    //   draw: undefined,
    // },
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
      draw: 'draw_bezier_curve',
    },
  ],
  [
    {
      label: 'Rectangle',
      icon: <RectangleHorizontal className="h-5 w-5" />,
      draw: 'draw_rectangle',
    },
    {
      label: 'Circle',
      icon: <Circle className="h-5 w-5" />,
      draw: 'draw_circle',
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
      draw: 'marker', // TODO
    },
    {
      label: 'Custom Marker',
      icon: <MapPinPlus className="h-5 w-5" />,
      draw: 'custom_marker', // TODO
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
  const mapRef = useAtomValue(mapLibreAtom)
  const sourceRef = useAtomValue(mapSourceAtom)

  const setCurrLayer = useSetAtom(currLayerAtom)
  const updateMapByNewFeature = useSetAtom(updateMapByNewFeatureAtom)

  const [currSelectedMode, setCurrSelectedMode] = useState({
    menuColIndex: 0, // Row of "menu" matrix
    menuItemIndex: 0, // Col of "menu" matrix
  }) // postion in "menu" matrix, default to cursor

  // Handle the map click event
  const handleMapClick = (e: maplibregl.MapMouseEvent) => {
    const current =
      menu[currSelectedMode.menuColIndex][currSelectedMode.menuItemIndex]

    // Destructure draw string
    const currentMode = current.draw

    drawRef.changeMode('simple_select')
    if (!mapRef) return
    const coordinates = e.lngLat.toArray() // Get clicked location
    const newID = nanoid(32) // Unique ID for the marker

    // Create default feature object for marker/text
    const initFeature: CustomFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates,
      },
      id: newID,
      properties: {
        id: newID,
        meta: {
          name: {
            payload: `${currentMode}${newID.substring(0, 2)}`,
            variableType: 'string',
          },
          visible: {
            payload: true,
            variableType: 'boolean',
          },
          lock: {
            payload: false,
            variableType: 'boolean',
          },
          draw: {
            payload: currentMode,
            variableType: 'string',
          },
        },
        render: {},
      },
    }

    const newCollection: CustomFeatureCollection = {
      type: 'FeatureCollection',
      features: [initFeature],
      _shared: { mode: 'none' },
    }

    // Add Feature back to maplibre
    renderMap(mapRef, sourceRef, drawRef, setCurrLayer, newCollection)
    updateMapByNewFeature(initFeature)

    mapRef.off('click', handleMapClick)
  }

  useEffect(() => {
    // Check if drawRef and mapRef are initialized
    if (drawRef && mapRef) {
      // Get the current element from matrix
      const current =
        menu[currSelectedMode.menuColIndex][currSelectedMode.menuItemIndex]

      // Destructure draw string
      const currentDraw = current.draw

      const nonDraw = ['marker', 'text']

      // Remove previous 'click' event handler before attaching a new one

      // Check if element has a valid currentDraw
      if (currentDraw) {
        if (nonDraw.includes(currentDraw)) {
          mapRef.on('click', handleMapClick)
        } else {
          drawRef.changeMode(currentDraw)
        }
      }
    }

    // Cleanup function to remove the event listener on component unmount or mode change
    return () => {
      mapRef?.off('click', handleMapClick)
    }
  }, [currSelectedMode, drawRef, mapRef])

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
