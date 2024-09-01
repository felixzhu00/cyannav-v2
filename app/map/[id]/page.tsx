import MapEditPage from '@/components/map-editor/map-edit-page'

export default async function MapPage({ params }: { params: { id: string } }) {
  const { id } = params

  if (!id || Array.isArray(id)) {
    return <p>Invalid ID</p>
  }

  try {
    // Fetch the data from the API route
    const response = await fetch(`http:/localhost:3000/api/map/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json()
      return <p>Error: {errorData.message}</p>
    }

    const map = await response.json()
    // Render the MapEditPage with the fetched map data
    return <MapEditPage initialMap={map.payload} />
  } catch (error) {
    return <p>Error fetching map</p>
  }
}
// TODO make proper NotFound page for Map not Found or Error
