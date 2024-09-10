import GeneralContent from '@/components/dashboard/general-content'
import CardGrid from '@/components/dashboard/card-grid'

export default function RecentMaps() {
  const selectOptions = [
    { label: 'Owned By Anyone', value: 'anyone' },
    { label: 'Owned By You', value: 'self' },
  ]

  return (
    <GeneralContent title="Recently Viewed Maps" selectOptions={selectOptions}>
      <CardGrid showAddNewMap={true} />
    </GeneralContent>
  )
}
