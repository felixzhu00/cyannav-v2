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
  const [selectMode, setSelectMode] = useState<
    'choropleth' | 'heatmap' | 'none'
  >(mapGeo._shared?.mode || 'none')

  const mapModes = {
    choropleth: {
      'Border Color': { payload: '#FFFFFF', variableType: 'color' },
      'Border Width': { payload: 2, variableType: 'number' },
      'Layer Opacity': { payload: 0.75, variableType: 'number' },
      'Layer Min Color': { payload: '#FFEDA0', variableType: 'color' },
      'Layer Max Color': { payload: '#E31A1C', variableType: 'color' },
    },
    heatmap: {
      'Heat Map Weight': { payload: '#FFFFFF', variableType: 'color' },
      'Heat Map Intensity': { payload: 2, variableType: 'number' },
      'Layer Opacity': { payload: 0.75, variableType: 'number' },
      'Layer Min Color': { payload: '#FFEDA0', variableType: 'color' },
      'Layer Max Color': { payload: '#E31A1C', variableType: 'color' },
    },
    none: {},
  }

  const handleChangeMode = async (
    newMode: 'none' | 'choropleth' | 'heatmap'
  ) => {
    // create default option for map mode if map mode does not exist
    if (!list[newMode]) {
      await editMapGeo(
        mapGeo,
        mapId,
        currLayerId,
        newMode,
        mapModes[newMode],
        'addOrUpdate',
        'editGeoShared'
      )
      await editMapGeo(
        mapGeo,
        mapId,
        currLayerId,
        'mode',
        newMode,
        'addOrUpdate',
        'editGeoShared'
      )
    }
    setSelectMode(newMode) // Set the new mode
  }

  if (!list) {
    return (
      <span className="mr-5 text-center text-sm text-gray-500">
        _self/_share not found
      </span>
    )
  }

  const privateVariablesLocal = ['_id', '_visible', '_lock']
  const privateVariablesGlobal = ['mode']

  const renderList = () => {
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
          {Object.entries(list).map(([key, value], index) => {
            if (!privateVariablesLocal.includes(key)) {
              return (
                <VariableListItem
                  key={key + index.toString()}
                  varKey={key}
                  varValue={value.payload?.toString() || value || ''}
                  listName={listName}
                  mapGeo={mapGeo}
                  mapId={mapId}
                  currLayerId={currLayerId}
                  varType={value.variableType || 'string'}
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
                    { payload?: string | number; variableType?: string },
                  ][]
                ).map(([key, value]) => {
                  if (!privateVariablesGlobal.includes(key)) {
                    return (
                      <VariableListItem
                        key={nanoid()}
                        varKey={key}
                        varValue={value.payload?.toString() || value || ''}
                        listName={listName}
                        mapGeo={mapGeo}
                        mapId={mapId}
                        currLayerId={currLayerId}
                        varType={
                          (value.variableType as
                            | 'string'
                            | 'number'
                            | 'color'
                            | 'select') || 'string'
                        }
                        hasTrash={false}
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
