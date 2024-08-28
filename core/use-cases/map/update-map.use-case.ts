import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { MapFields } from '@/core/_entities/types/map.types'
import { updateMapFieldsById } from '@/core/data-access/map/update-map.persistence'

export async function updateMapFieldsUseCase(
  id: string,
  updateFields: MapFields
) {
  try {
    // Check if valid id is passed
    if (!id) {
      return NextResponse.json(
        {
          errors: { id: ['Invalid ID'] },
          message: 'Invalid ID',
        },
        { status: 400 }
      )
    }

    // Update Map object in DB
    const updatedMap = await updateMapFieldsById(id, updateFields)

    // If not valid Map found in DB
    if (!updatedMap) {
      return NextResponse.json({ error: 'Map not found' }, { status: 404 })
    }

    // Revalidate the specific path after the map is updated
    revalidatePath(`/map/${id}`)

    // Return success
    return NextResponse.json({
      message: 'Map updated successfully',
      map: updatedMap,
    })
  } catch (error) {
    // Log error on console for dev debug
    console.error(error)
    // Send generic response for user API calls
    return NextResponse.json({ error: 'Failed to update map' }, { status: 500 })
  }
}
