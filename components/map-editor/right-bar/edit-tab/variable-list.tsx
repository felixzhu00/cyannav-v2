import VariableListItem from './variable-list-item'

export default function VariableList({
  list,
  listName,
}: {
  list: { [key: string]: any } | undefined // undefine if _shared/_self does not exist
  listName: string
}) {
  if (!list)
    return (
      <span className="mr-5 text-center text-sm text-gray-500">
        _self/_share not found
      </span>
    ) // If list is undefined, return null

  console.log(Object.entries(list))
  return (
    <div>
      {Object.keys(list).length === 0 ? (
        <div className="mr-5 py-2 text-center text-sm text-gray-500">
          Start by Adding a {listName} Variable
        </div>
      ) : (
        Object.entries(list).map(([key, value]) => (
          <VariableListItem
            variablekey={key}
            value={value}
            listName={listName}
          />
        ))
      )}
    </div>
  )
}
