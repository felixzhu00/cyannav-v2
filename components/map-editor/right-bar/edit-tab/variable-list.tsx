import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import VariableListItem from './variable-list-item'
import { nanoid } from 'nanoid'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import ByFeature from './by-feature'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { editMapGeo } from '@/lib/utils'

export default function VariableList({
  list,
  listName,
  mapGeo,
  mapId,
  currLayerId,
  localItems = {},
}: {
  list: { [key: string]: any } // undefined if _shared/_self does not exist
  listName: string
  mapGeo: CustomFeatureCollection
  mapId: string
  currLayerId: string
  localItems: { [key: string]: any }
}) {
  // State of current mode
  const [selectMode, setSelectMode] = useState<
    'choropleth' | 'heatmap' | 'none'
  >(mapGeo._shared?.mode || 'none')

  // Default map mode values base on selected mode
  const mapModes = {
    choropleth: {
      'Border Color': {
        payload: '#FFFFFF',
        variableType: 'color',
        layer: 'outline-layer',
        property: 'line-color',
        index: -1,
      },
      'Border Width': {
        payload: 2,
        variableType: 'number',
        layer: 'outline-layer',
        property: 'line-width',
        index: -1,
        range: [0.5, 12, 0.1], // min,max,step
      },
      'Layer Opacity': {
        payload: 0.75,
        variableType: 'number',
        layer: 'geojson-layer',
        property: 'fill-opacity',
        index: -1,
        range: [0.01, 1, 0.01],
      },
      'Layer Min Color': {
        payload: '#FFEDA0',
        variableType: 'color',
        layer: 'geojson-layer',
        property: 'fill-color',
        index: 4,
      },
      'Layer Max Color': {
        payload: '#E31A1C',
        variableType: 'color',
        layer: 'geojson-layer',
        property: 'fill-color',
        index: 6,
      },
    },
    heatmap: {
      'Heat Map Radius': { payload: 2, variableType: 'number' },
      'Heat Map Opacity': { payload: 0.75, variableType: 'number' },
    },
    none: {},
  }

  // Handler that update Backend base on mode change
  const handleChangeMode = async (
    newMode: 'none' | 'choropleth' | 'heatmap'
  ) => {
    // TODO: Optimisic Update: revert if promise failed

    // create default option for map mode if map mode does not exist
    if (!list[newMode]) {
      // add default option into _shared
      await editMapGeo(
        mapGeo,
        mapId,
        currLayerId,
        newMode,
        mapModes[newMode],
        'addOrUpdate',
        'editGeoShared'
      )

      // make sure that center exisit in _self if heatmap
    }

    // Change mode in the backend
    await editMapGeo(
      mapGeo,
      mapId,
      currLayerId,
      'mode',
      newMode,
      'addOrUpdate',
      'editGeoShared'
    )

    setSelectMode(newMode) // Set the new mode
  }

  // Fallback display if "list" is empty or missing
  if (!list) {
    return (
      <span className="mr-5 text-center text-sm text-gray-500">
        _self/_share not found
      </span>
    )
  }

  // Filter out variable user should not be able to edit
  const privateVariablesLocal = ['id', 'visible', 'lock', 'draw']
  const privateVariablesGlobal = ['mode']

  // Render logic for empty, local and global
  const renderList = () => {
    // Empty Logic
    if (Object.keys(list).length === 0) {
      return (
        <div className="mr-5 py-2 text-center text-sm text-gray-500">
          Start by Adding a {listName} Variable
        </div>
      )
    }

    if (listName === 'Local') {
      return (
        <>
          {Object.entries(list.render).map(([key, value], index) => {
            if (!privateVariablesLocal.includes(key)) {
              return (
                <VariableListItem
                  key={nanoid() + index.toString()}
                  inputObject={{ [key]: value }}
                  listName={listName}
                  mapGeo={mapGeo}
                  mapId={mapId}
                  currLayerId={currLayerId}
                  draw={list.render.draw.payload}
                  hasTrash={key !== 'name'}
                />
              )
            }
            return null
          })}
        </>
      )
    }

    if (listName === 'Global') {
      return (
        <>
          <div className="flex w-full flex-col items-start gap-1.5 pt-2">
            <Label className="px-1" htmlFor="mapmode">
              Map Mode
            </Label>
            <Select value={selectMode} onValueChange={handleChangeMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="choropleth">Choropleth</SelectItem>
                  <SelectItem value="heatmap">Heatmap</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {selectMode !== 'none' && (
            <>
              {mapModes[selectMode] &&
                (
                  Object.entries(list[selectMode] || mapModes[selectMode]) as [
                    string,
                    {
                      payload: string | number
                      variableType: 'string' | 'number' | 'color' | 'select'
                    },
                  ][]
                ).map(([key, value], index) => {
                  if (!privateVariablesGlobal.includes(key)) {
                    return (
                      <VariableListItem
                        key={value.payload + index.toString()}
                        inputObject={{ [key]: value }}
                        listName={listName}
                        mapGeo={mapGeo}
                        mapId={mapId}
                        currLayerId={currLayerId}
                        hasTrash={false}
                        draw={list.render.draw.payload}
                      />
                    )
                  }
                  return null
                })}
              <ByFeature localItems={localItems} />
            </>
          )}
        </>
      )
    }

    return <div>Error</div>
  }

  return <div>{renderList()}</div>
}
