import MapEditPage from '@/components/map-editor/map-edit-page'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function MapPage({ params }: { params: { id: string } }) {
  const { id } = params
  if (!id || Array.isArray(id)) return <p>Invalid ID</p>

  // get session
  const session = await auth()
  const userId = session?.user?.id

  // Fetch map data
  const response = await fetch(`http://localhost:3000/api/map/${id}`, {
    cache: 'no-store',
  })
  if (!response.ok) {
    const errorData = await response.json()
    return <p>Error: {errorData.message}</p>
  }

  const data = await response.json()
  const mapRes = data.payload

  const isOwner = (mapRes.owner as any)._id.toString() === userId

  const userInSharedUser =
    mapRes.sharedUsers?.some(
      (sharedId: any) => sharedId.toString() === userId
    ) || isOwner

  if (!userInSharedUser && mapRes.isPublished === 'private') {
    redirect('/unauthorized')
  }

  return <MapEditPage initialMap={mapRes} isOwner={isOwner} />
}
