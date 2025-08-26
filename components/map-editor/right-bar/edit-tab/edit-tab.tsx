import CollapsibleVariables from './collapsible-variables'
import Variablebar from './variable-toolbar'
import { useAtom, useAtomValue } from 'jotai'
import { currLayerAtom, mapAtom } from '@/lib/jotai'
import VariableList from './variable-list'

export default function EditTab() {
  // Jotai
  const currLayer = useAtomValue(currLayerAtom)
  const [map] = useAtom(mapAtom)

  // Get the currently selected layer
  const selectedFeature = map.geojson.features.find(
    (feature) => feature?.id === currLayer
  )

  // Object of local and global sections to be rendered
  const localItems = selectedFeature?.properties as { [key: string]: any }
  // const gobalItems = (map.geojson as CustomFeatureCollection)._shared

  // If no layer is currently selected
  if (!selectedFeature)
    return (
      <div className="mt-5 text-center text-sm text-muted-foreground">
        Select A Layer From The Left To Edit
      </div>
    )
  return (
    <div className="space-y-3">
      <Variablebar />
      {/* TODO add animation to Collapsible */}

      {/* Collapsible for _Self/Local */}
      <CollapsibleVariables header="Local Variables">
        <VariableList
          list={localItems}
          currLayerId={currLayer}
          mapId={map._id}
          mapGeo={map.geojson}
          listName="Local"
          localItems={{}}
        />
      </CollapsibleVariables>

      {/* Collapsible for _Share/Global */}
      {/* <CollapsibleVariables header="Global Variables">
        <VariableList
          list={gobalItems}
          currLayerId={currLayer}
          mapId={map._id}
          mapGeo={map.geojson}
          listName="Global"
          localItems={localItems}
        />
      </CollapsibleVariables> */}
    </div>
  )
}
