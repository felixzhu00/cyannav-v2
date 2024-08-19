'use client'
import MapEditPage from '@/components/map-editor/map-edit-page'
import getMapById from '@/actions/getMapById'

// import MapSchema from '@/schema/map';

export default async function MapPage({ params }: { params: { id: string } }) {
  const { id } = params

  if (!id || Array.isArray(id)) return <p>Invalid ID</p>

  const map = await getMapById(id)

  if ('errors' in map) {
    // Handle the error case
    console.error(map.errors)
    return <p>Error: {map.message}</p>
  }

  return <MapEditPage map={map} />
}
