import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import VariableListItem from './variable-list-item'

export default function VariableList({
  list,
  listName,
  mapGeo,
  mapId,
  currLayerId,
}: {
  list: { [key: string]: any } | undefined // undefine if _shared/_self does not exist
  listName: string
  mapGeo: CustomFeatureCollection
  mapId: string
  currLayerId: string
}) {
  if (!list)
    return (
      <span className="mr-5 text-center text-sm text-gray-500">
        _self/_share not found
      </span>
    ) // If list is undefined, return null

  return (
    <div>
      {Object.keys(list).length === 0 ? (
        <div className="mr-5 py-2 text-center text-sm text-gray-500">
          Start by Adding a {listName} Variable
        </div>
      ) : (
        Object.entries(list).map(([key, value], index) => (
          <VariableListItem
            key={key.concat(index.toString(), value.toString())}
            variablekey={key}
            value={value.toString() || ''}
            listName={listName}
            mapGeo={mapGeo}
            mapId={mapId}
            currLayerId={currLayerId}
          />
        ))
      )}
    </div>
  )
}
