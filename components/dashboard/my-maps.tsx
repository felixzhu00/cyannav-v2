import GeneralContent from '@/components/dashboard/general-content'
import CardGrid from '@/components/dashboard/card-grid'

export default function MyMapsPage() {
  const selectOptions = [
    { label: 'Recently Created', value: 'recent-created' },
    { label: 'Alphabetical Order', value: 'alphabet-a-z' },
    { label: 'Most Liked', value: 'popular' },
  ]

  return (
    <GeneralContent title="My Maps" selectOptions={selectOptions}>
      <CardGrid showAddNewMap={true} />
    </GeneralContent>
  )
}
