import {
  attachedHandlersAtom,
  currLayerAtom,
  currSelectedModeAtom,
  mapAtom,
  mapDrawAtom,
  mapLibreAtom,
  mapSourceAtom,
  updateMapByNewFeatureAtom,
} from '@/lib/jotai'
import { Menubar } from '@/components/ui/menubar'
import { cn } from '@/lib/utils'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
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
  Move,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import SelectMenuBar from './select-menu-bar'
import { nanoid } from 'nanoid'
import {
  CustomFeature,
  CustomFeatureCollection,
} from '@/core/_entities/types/map.types'
import { renderCollection } from '@/lib/maplibre-actions/map-render-layers'
import { populateDefault } from '@/lib/maplibre-actions/map-utils'

const menu = [
  [
    {
      label: 'Cursor',
      icon: <MousePointer className="h-5 w-5" />,
      draw: 'select',
    },
    {
      label: 'Move',
      icon: <Move className="h-5 w-5" />,
      draw: 'simple_select', // TODO
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
    // {
    //   label: 'Custom Marker',
    //   icon: <MapPinPlus className="h-5 w-5" />,
    //   draw: 'custom_marker', // TODO
    // },
    {
      label: 'Point',
      icon: <Dot className="h-5 w-5" />,
      draw: 'draw_point',
    },
  ],
]

export default function EditToolbar({ className }: { className: string }) {
  // TODO add tooltip for each menuCol
  // Jotai
  const drawRef = useAtomValue(mapDrawAtom)
  const mapRef = useAtomValue(mapLibreAtom)
  const handlerRef = useAtomValue(attachedHandlersAtom)
  const mapData = useAtomValue(mapAtom)
  const currSelectedMode = useAtomValue(currSelectedModeAtom)

  const transientDrawMode = useRef('select')

  const mapGeo = mapData.geojson

  // Download canvas
  const handlePNG = () => {
    if (mapRef) {
      const imgData = mapRef.getCanvas().toDataURL('image/png')

      // Programmatically create a download link and trigger the download
      const link = document.createElement('a')
      link.href = imgData
      link.download = `${mapData.title}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // Clean up the link
    }
  }

  // Download NavJson
  const handleExport = () => {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(mapGeo, null, 2)

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' })

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element
    const link = document.createElement('a')
    link.href = url
    link.download = `${mapData.title}.navjson`

    // Programmatically trigger the download
    link.click()

    // Clean up the URL object
    URL.revokeObjectURL(url)
  }

  const file = [
    // Trigger Icon Only
    {
      label: 'Trigger',
      icon: <File className="h-5 w-5" />,
      draw: undefined,
      onClick: () => {},
    },
    // Dropdown Options
    {
      label: 'Export',
      icon: <Download className="h-5 w-5" />,
      draw: undefined,
      onClick: handleExport,
    },
    {
      label: 'Fork',
      icon: <GitFork className="h-5 w-5" />,
      draw: undefined,
      onClick: () => {},
    },
    {
      label: 'Download PNG',
      icon: <ImageIcon className="h-5 w-5" />,
      draw: undefined,
      onClick: handlePNG,
    },
  ]

  const setCurrLayer = useSetAtom(currLayerAtom)
  const updateMapByNewFeature = useSetAtom(updateMapByNewFeatureAtom)

  // Handle the map click event
  const handleMapClick = (e: maplibregl.MapMouseEvent) => {
    const current =
      menu[currSelectedMode.menuColIndex][currSelectedMode.menuItemIndex]

    // Destructure draw string
    const currentMode = current.draw

    // drawRef.changeMode('simple_select')
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
        render: {
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
          trash: {
            payload: true,
            variableType: 'boolean',
          },
        },
      },
    }

    const newFeatureAfterDefault = populateDefault(initFeature) as CustomFeature

    const newCollection: CustomFeatureCollection = {
      type: 'FeatureCollection',
      features: [newFeatureAfterDefault],
      _shared: { mode: 'none' },
    }

    // Add Feature back to maplibre
    renderCollection(mapRef, drawRef, handlerRef, setCurrLayer, newCollection)
    updateMapByNewFeature(newFeatureAfterDefault)
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
        if (
          transientDrawMode.current !== currentDraw &&
          nonDraw.includes(transientDrawMode.current)
        ) {
          transientDrawMode.current = currentDraw
          mapRef.off('click', handleMapClick)
        }
        if (nonDraw.includes(currentDraw)) {
          mapRef.on('click', handleMapClick)
          drawRef.changeMode('no_op')
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
          menuColIndex={-1} // Dummy prop
          isActive={false}
          isFile
        />
        {/* Menu Columns */}
        {menu.map((menuCol, index) => (
          <SelectMenuBar
            key={menuCol[0].label}
            items={menuCol}
            menuColIndex={index}
            isActive={currSelectedMode.menuColIndex === index}
          />
        ))}
      </Menubar>
    </div>
  )
}
