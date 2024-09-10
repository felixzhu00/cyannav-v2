import GeneralContent from '@/components/dashboard/general-content'
import CardGrid from '@/components/dashboard/card-grid'

export default function StarredMaps() {
  const selectOptions = [
    { label: 'Owned By Anyone', value: 'anyone' },
    { label: 'Owned By You', value: 'self' },
  ]

  return (
    <GeneralContent title="Starred Maps" selectOptions={selectOptions}>
      <CardGrid showAddNewMap={false} />
    </GeneralContent>
  )
}
