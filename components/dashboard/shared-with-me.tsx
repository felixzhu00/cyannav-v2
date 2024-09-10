import GeneralContent from '@/components/dashboard/general-content'
import CardGrid from '@/components/dashboard/card-grid'

export default function SharedWithMe() {
  const selectOptions = [
    { label: 'Owned By Anyone', value: 'anyone' },
    { label: 'Owned By You', value: 'self' },
  ]

  return (
    <GeneralContent title="Shared With Me" selectOptions={selectOptions}>
      <CardGrid showAddNewMap={false} />
    </GeneralContent>
  )
}
